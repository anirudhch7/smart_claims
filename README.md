# Smart Claims Repricing & Anomaly Detection Platform

A comprehensive healthcare claims processing platform that leverages machine learning to detect anomalies, optimize repricing, and maximize cost savings.

## Features

### 🔐 Authentication & Security
- Firebase Authentication with Email/Password and Google Sign-in
- JWT token-based API security
- Role-based access control

### 📊 Dashboard & Analytics
- Real-time KPI monitoring
- Interactive charts and visualizations
- Risk distribution analysis
- Monthly trends tracking

### 🏥 Claims Management
- Comprehensive claims processing
- Advanced filtering and search
- Real-time status updates
- Detailed claim inspection

### 🚨 Anomaly Detection
- ML-powered fraud detection
- Rules-based flagging system
- Risk scoring (0-100%)
- Multiple detection algorithms:
  - Isolation Forest (unsupervised)
  - XGBoost (supervised)
  - Autoencoder (deep learning)

### 💰 Smart Repricing
- Automated repricing based on service codes
- Configurable discount rules
- PPO repricing optimization
- Cost savings tracking

### 📈 Savings Analysis
- Comprehensive savings reporting
- Service code analysis
- Provider performance metrics
- Export capabilities (CSV/Excel)

### 📤 File Processing
- Drag-and-drop file upload
- Support for CSV, JSON, XLS, XLSX
- Real-time processing status
- Batch processing capabilities

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Firebase SDK** - Authentication and real-time data
- **React Dropzone** - File upload handling
- **SheetJS** - Excel file processing

### Backend
- **Python 3.11** - Core backend language
- **Flask** - Web framework
- **Firebase Admin SDK** - Authentication and database
- **Pandas** - Data processing
- **Scikit-learn** - Machine learning
- **XGBoost** - Gradient boosting
- **TensorFlow/Keras** - Deep learning
- **Joblib** - Model persistence

### ML Models
- **Isolation Forest** - Unsupervised anomaly detection
- **XGBoost** - Supervised learning with weak labels
- **Autoencoder** - Deep anomaly detection via reconstruction error
- **Ensemble Scoring** - Combined risk assessment

## Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.11+
- Firebase project with Authentication and Firestore enabled

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Set up Firebase service account:
   - Download your Firebase service account key
   - Save it as `firebase-service-account.json` in the backend directory

4. Generate synthetic data:
```bash
python generate_synthetic_data.py
```

5. Start the backend server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Update `src/firebase/config.js` with your Firebase configuration
   - Enable Authentication and Firestore in your Firebase console

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase JWT token

### Claims Processing
- `POST /api/claims/upload` - Upload and process claims files
- `GET /api/claims` - Retrieve claims with filtering and pagination

### Analytics
- `GET /api/anomalies` - Get detected anomalies and statistics
- `GET /api/savings` - Retrieve savings analysis data

### Export
- `GET /api/export/csv` - Export processed data as CSV

## Data Model

### Claims Schema
```json
{
  "claim_id": "string",
  "patient_id": "string", 
  "patient_age": "number",
  "patient_gender": "string",
  "service_code": "string",
  "billed_amount": "number",
  "allowed_amount": "number",
  "repriced_amount": "number",
  "discount_percent": "number",
  "provider_id": "string",
  "provider_specialty": "string",
  "claim_date": "string",
  "rules_flags": "array",
  "ml_risk_score": "number",
  "status": "string"
}
```

## ML Pipeline

1. **Data Preprocessing** - Clean and normalize input data
2. **Feature Engineering** - Extract relevant features for ML models
3. **Rules-based Detection** - Apply business rules for initial flagging
4. **ML Model Training** - Train ensemble of anomaly detection models
5. **Risk Scoring** - Generate composite risk scores (0-100%)
6. **Repricing** - Apply discount rules based on service codes
7. **Results Storage** - Save processed results to Firestore

## Configuration

### Repricing Rules
```python
REPRICING_RULES = {
    '99213': 0.20,  # 20% discount
    '97110': 0.25,  # 25% discount
    'default': 0.15  # 15% default discount
}
```

### ML Model Parameters
- Isolation Forest: contamination=0.1
- XGBoost: Random state for reproducibility
- Autoencoder: 2-layer architecture with ReLU activation

## Usage

1. **Upload Data** - Use the Uploads page to process claims files
2. **Review Claims** - Check the Claims page for processed results
3. **Analyze Anomalies** - Use the Anomalies page to review flagged claims
4. **Track Savings** - Monitor cost savings in the Savings page
5. **Export Results** - Download processed data in CSV or Excel format

## Security

- All API endpoints require Firebase JWT authentication
- File uploads are validated and sanitized
- Sensitive data is encrypted in transit and at rest
- HIPAA-compliant data handling practices

## Performance

- Real-time processing with live status updates
- Efficient pagination for large datasets
- Optimized ML model inference
- Cached results for improved response times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
