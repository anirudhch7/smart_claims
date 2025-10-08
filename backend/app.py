import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
from werkzeug.utils import secure_filename
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.optimizers import Adam
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'data/uploads'
PROCESSED_FOLDER = 'data/processed'
ALLOWED_EXTENSIONS = {'csv', 'json'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Initialize Firebase Admin
if not firebase_admin._apps:
    # Use service account key or default credentials
    try:
        cred = credentials.Certificate('firebase-service-account.json')
        firebase_admin.initialize_app(cred)
    except:
        # Use default credentials for development
        firebase_admin.initialize_app()

db = firestore.client()

# ML Models
isolation_forest = None
xgboost_model = None
autoencoder = None
scaler = StandardScaler()

# Repricing rules
REPRICING_RULES = {
    '99213': 0.20,  # 20% discount
    '97110': 0.25,  # 25% discount
    'default': 0.15  # 15% default discount
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def verify_firebase_token(token):
    """Verify Firebase JWT token"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None

def authenticate_request():
    """Extract and verify Firebase token from request"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    return verify_firebase_token(token)

def apply_rules_based_detection(claim):
    """Apply rules-based anomaly detection"""
    flags = []
    
    # Age/Gender mismatch (simplified rule)
    if claim['patient_age'] < 18 and claim['service_code'] in ['99213', '99214']:
        flags.append('age_service_mismatch')
    
    # Excessive billed amount (above 95th percentile)
    if claim['billed_amount'] > 5000:
        flags.append('excessive_billed_amount')
    
    # Specialty mismatch (simplified)
    if claim['provider_specialty'] == 'Dermatology' and claim['service_code'] in ['99213', '99214']:
        flags.append('specialty_mismatch')
    
    return flags

def calculate_repricing(service_code, billed_amount):
    """Calculate repriced amount based on service code"""
    discount_rate = REPRICING_RULES.get(service_code, REPRICING_RULES['default'])
    repriced_amount = billed_amount * (1 - discount_rate)
    discount_percent = discount_rate * 100
    
    return repriced_amount, discount_percent

def prepare_features(df):
    """Prepare features for ML models"""
    features = []
    for _, row in df.iterrows():
        feature_vector = [
            row['patient_age'],
            1 if row['patient_gender'] == 'M' else 0,
            row['billed_amount'],
            row['allowed_amount'],
            len(str(row['service_code'])),  # Service code length as feature
            row['claim_date'].day if pd.notna(row['claim_date']) else 0,
            row['claim_date'].month if pd.notna(row['claim_date']) else 0,
        ]
        features.append(feature_vector)
    
    return np.array(features)

def train_ml_models(df):
    """Train ML models for anomaly detection"""
    global isolation_forest, xgboost_model, autoencoder, scaler
    
    # Prepare features
    X = prepare_features(df)
    X_scaled = scaler.fit_transform(X)
    
    # Train Isolation Forest
    isolation_forest = IsolationForest(contamination=0.1, random_state=42)
    isolation_forest.fit(X_scaled)
    
    # Train XGBoost (using weak labels from rules)
    y_weak = np.zeros(len(df))
    for i, (_, row) in enumerate(df.iterrows()):
        flags = apply_rules_based_detection(row.to_dict())
        if flags:
            y_weak[i] = 1
    
    if np.sum(y_weak) > 0:
        xgboost_model = xgb.XGBClassifier(random_state=42)
        xgboost_model.fit(X_scaled, y_weak)
    
    # Train Autoencoder
    input_dim = X_scaled.shape[1]
    input_layer = Input(shape=(input_dim,))
    encoded = Dense(input_dim // 2, activation='relu')(input_layer)
    encoded = Dense(input_dim // 4, activation='relu')(encoded)
    decoded = Dense(input_dim // 2, activation='relu')(encoded)
    decoded = Dense(input_dim, activation='sigmoid')(decoded)
    
    autoencoder = Model(input_layer, decoded)
    autoencoder.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    autoencoder.fit(X_scaled, X_scaled, epochs=50, batch_size=32, verbose=0)

def calculate_ml_risk_score(claim):
    """Calculate ML-based risk score"""
    if isolation_forest is None or xgboost_model is None or autoencoder is None:
        return 50  # Default score if models not trained
    
    # Prepare features
    features = prepare_features(pd.DataFrame([claim]))
    features_scaled = scaler.transform(features)
    
    # Isolation Forest score
    iso_score = isolation_forest.decision_function(features_scaled)[0]
    iso_normalized = max(0, min(100, (1 - iso_score) * 50))
    
    # XGBoost score
    xgb_proba = xgboost_model.predict_proba(features_scaled)[0][1]
    xgb_normalized = xgb_proba * 100
    
    # Autoencoder reconstruction error
    reconstructed = autoencoder.predict(features_scaled, verbose=0)
    reconstruction_error = np.mean(np.square(features_scaled - reconstructed))
    ae_normalized = min(100, reconstruction_error * 1000)
    
    # Ensemble score
    ensemble_score = (iso_normalized + xgb_normalized + ae_normalized) / 3
    return min(100, max(0, ensemble_score))

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/auth/verify', methods=['POST'])
def verify_auth():
    user = authenticate_request()
    if user:
        return jsonify({'valid': True, 'uid': user['uid']})
    return jsonify({'valid': False}), 401

@app.route('/api/claims/upload', methods=['POST'])
def upload_claims():
    user = authenticate_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the file
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(filepath)
            else:
                with open(filepath, 'r') as f:
                    data = json.load(f)
                df = pd.DataFrame(data)
            
            # Process claims
            processed_claims = []
            for _, row in df.iterrows():
                claim = row.to_dict()
                
                # Apply rules-based detection
                flags = apply_rules_based_detection(claim)
                
                # Calculate repricing
                repriced_amount, discount_percent = calculate_repricing(
                    claim['service_code'], claim['billed_amount']
                )
                
                # Calculate ML risk score
                ml_risk_score = calculate_ml_risk_score(claim)
                
                processed_claim = {
                    'claim_id': claim['claim_id'],
                    'patient_id': claim['patient_id'],
                    'patient_age': claim['patient_age'],
                    'patient_gender': claim['patient_gender'],
                    'service_code': claim['service_code'],
                    'billed_amount': claim['billed_amount'],
                    'allowed_amount': claim['allowed_amount'],
                    'repriced_amount': repriced_amount,
                    'discount_percent': discount_percent,
                    'provider_id': claim['provider_id'],
                    'provider_specialty': claim['provider_specialty'],
                    'claim_date': claim['claim_date'],
                    'rules_flags': flags,
                    'ml_risk_score': ml_risk_score,
                    'status': 'processed',
                    'upload_timestamp': datetime.now().isoformat()
                }
                processed_claims.append(processed_claim)
            
            # Save processed data
            processed_df = pd.DataFrame(processed_claims)
            processed_filename = f"processed_{filename}"
            processed_filepath = os.path.join(PROCESSED_FOLDER, processed_filename)
            processed_df.to_csv(processed_filepath, index=False)
            
            # Store in Firestore
            batch = db.batch()
            for claim in processed_claims:
                doc_ref = db.collection('claims').document(claim['claim_id'])
                batch.set(doc_ref, claim)
            batch.commit()
            
            # Train models on new data
            train_ml_models(processed_df)
            
            return jsonify({
                'message': 'File processed successfully',
                'filename': filename,
                'processed_count': len(processed_claims),
                'processed_file': processed_filename
            })
            
        except Exception as e:
            return jsonify({'error': f'Processing failed: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/claims', methods=['GET'])
def get_claims():
    user = authenticate_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Get query parameters
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 50))
    risk_threshold = float(request.args.get('risk_threshold', 0))
    service_code = request.args.get('service_code', '')
    
    # Query Firestore
    query = db.collection('claims')
    
    if risk_threshold > 0:
        query = query.where('ml_risk_score', '>=', risk_threshold)
    
    if service_code:
        query = query.where('service_code', '==', service_code)
    
    # Get total count
    total_docs = query.get()
    total_count = len(total_docs)
    
    # Paginate
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    
    claims = []
    for i, doc in enumerate(total_docs):
        if i >= start_idx and i < end_idx:
            claim_data = doc.to_dict()
            claims.append(claim_data)
    
    return jsonify({
        'claims': claims,
        'pagination': {
            'page': page,
            'limit': limit,
            'total': total_count,
            'pages': (total_count + limit - 1) // limit
        }
    })

@app.route('/api/anomalies', methods=['GET'])
def get_anomalies():
    user = authenticate_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Get high-risk claims
    high_risk_claims = db.collection('claims').where('ml_risk_score', '>=', 70).get()
    
    anomalies = []
    for doc in high_risk_claims:
        claim_data = doc.to_dict()
        anomalies.append(claim_data)
    
    # Group by service code
    service_stats = {}
    for claim in anomalies:
        service_code = claim['service_code']
        if service_code not in service_stats:
            service_stats[service_code] = {
                'count': 0,
                'total_risk': 0,
                'avg_risk': 0
            }
        service_stats[service_code]['count'] += 1
        service_stats[service_code]['total_risk'] += claim['ml_risk_score']
    
    # Calculate averages
    for service_code in service_stats:
        service_stats[service_code]['avg_risk'] = (
            service_stats[service_code]['total_risk'] / 
            service_stats[service_code]['count']
        )
    
    return jsonify({
        'anomalies': anomalies,
        'service_stats': service_stats
    })

@app.route('/api/savings', methods=['GET'])
def get_savings():
    user = authenticate_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Get all claims
    all_claims = db.collection('claims').get()
    
    total_billed = 0
    total_repriced = 0
    total_savings = 0
    
    savings_by_date = {}
    
    for doc in all_claims:
        claim = doc.to_dict()
        billed = claim['billed_amount']
        repriced = claim['repriced_amount']
        savings = billed - repriced
        
        total_billed += billed
        total_repriced += repriced
        total_savings += savings
        
        # Group by date
        claim_date = claim['claim_date']
        if claim_date not in savings_by_date:
            savings_by_date[claim_date] = {
                'billed': 0,
                'repriced': 0,
                'savings': 0
            }
        savings_by_date[claim_date]['billed'] += billed
        savings_by_date[claim_date]['repriced'] += repriced
        savings_by_date[claim_date]['savings'] += savings
    
    return jsonify({
        'total_billed': total_billed,
        'total_repriced': total_repriced,
        'total_savings': total_savings,
        'savings_percentage': (total_savings / total_billed * 100) if total_billed > 0 else 0,
        'savings_by_date': savings_by_date
    })

@app.route('/api/export/csv', methods=['GET'])
def export_csv():
    user = authenticate_request()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Get all claims
    all_claims = db.collection('claims').get()
    
    claims_data = []
    for doc in all_claims:
        claims_data.append(doc.to_dict())
    
    # Create DataFrame and save
    df = pd.DataFrame(claims_data)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"claims_export_{timestamp}.csv"
    filepath = os.path.join(PROCESSED_FOLDER, filename)
    df.to_csv(filepath, index=False)
    
    return jsonify({
        'filename': filename,
        'download_url': f'/api/download/{filename}'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
