import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random

def generate_synthetic_claims(num_claims=1000):
    """Generate synthetic claims data with anomalies"""
    
    # Service codes and their typical amounts
    service_codes = {
        '99213': (150, 300),  # Office visit, established patient
        '99214': (200, 400),  # Office visit, detailed
        '97110': (50, 150),   # Therapeutic exercise
        '99215': (300, 600),  # Office visit, comprehensive
        '99212': (100, 200),  # Office visit, brief
        '99201': (80, 180),   # Office visit, new patient
        '99202': (120, 250),  # Office visit, new patient
        '99203': (150, 300),  # Office visit, new patient
        '99204': (200, 450),  # Office visit, new patient
        '99205': (250, 500),  # Office visit, new patient
    }
    
    specialties = [
        'Internal Medicine', 'Family Medicine', 'Cardiology', 
        'Dermatology', 'Orthopedics', 'Neurology', 'Pediatrics',
        'Psychiatry', 'Ophthalmology', 'Gastroenterology'
    ]
    
    genders = ['M', 'F']
    
    claims = []
    
    for i in range(num_claims):
        # Basic claim info
        claim_id = f"CLM_{i+1:06d}"
        patient_id = f"PAT_{random.randint(100000, 999999)}"
        patient_age = random.randint(18, 80)
        patient_gender = random.choice(genders)
        service_code = random.choice(list(service_codes.keys()))
        provider_id = f"PROV_{random.randint(1000, 9999)}"
        provider_specialty = random.choice(specialties)
        
        # Generate claim date (last 6 months)
        days_ago = random.randint(1, 180)
        claim_date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
        
        # Generate amounts
        min_amount, max_amount = service_codes[service_code]
        billed_amount = random.uniform(min_amount, max_amount)
        
        # Add some anomalies
        is_anomaly = random.random() < 0.15  # 15% anomaly rate
        
        if is_anomaly:
            anomaly_type = random.choice(['excessive_amount', 'age_mismatch', 'specialty_mismatch', 'frequency_spike'])
            
            if anomaly_type == 'excessive_amount':
                billed_amount *= random.uniform(3, 8)  # 3-8x normal amount
            elif anomaly_type == 'age_mismatch':
                patient_age = random.randint(5, 17)  # Underage patient
            elif anomaly_type == 'specialty_mismatch':
                # Mismatch specialty with service
                if service_code in ['99213', '99214']:
                    provider_specialty = 'Dermatology'  # Unusual for office visits
            elif anomaly_type == 'frequency_spike':
                # Multiple claims for same patient on same day
                pass  # This would require more complex logic
        
        # Allowed amount (usually 80-95% of billed)
        allowed_amount = billed_amount * random.uniform(0.8, 0.95)
        
        claim = {
            'claim_id': claim_id,
            'patient_id': patient_id,
            'patient_age': patient_age,
            'patient_gender': patient_gender,
            'service_code': service_code,
            'billed_amount': round(billed_amount, 2),
            'allowed_amount': round(allowed_amount, 2),
            'provider_id': provider_id,
            'provider_specialty': provider_specialty,
            'claim_date': claim_date
        }
        
        claims.append(claim)
    
    return claims

def save_data(claims, csv_path='data/synthetic_claims.csv', json_path='data/synthetic_claims.json'):
    """Save claims data to CSV and JSON files"""
    
    # Create data directory
    import os
    os.makedirs('data', exist_ok=True)
    
    # Save as CSV
    df = pd.DataFrame(claims)
    df.to_csv(csv_path, index=False)
    print(f"Saved {len(claims)} claims to {csv_path}")
    
    # Save as JSON
    with open(json_path, 'w') as f:
        json.dump(claims, f, indent=2)
    print(f"Saved {len(claims)} claims to {json_path}")
    
    return df

if __name__ == '__main__':
    # Generate 1000 synthetic claims
    claims = generate_synthetic_claims(1000)
    df = save_data(claims)
    
    # Print summary statistics
    print("\nSummary Statistics:")
    print(f"Total claims: {len(df)}")
    print(f"Total billed amount: ${df['billed_amount'].sum():,.2f}")
    print(f"Average billed amount: ${df['billed_amount'].mean():.2f}")
    print(f"Service codes: {df['service_code'].value_counts().to_dict()}")
    print(f"Specialties: {df['provider_specialty'].value_counts().to_dict()}")
    print(f"Age range: {df['patient_age'].min()}-{df['patient_age'].max()}")
    print(f"Gender distribution: {df['patient_gender'].value_counts().to_dict()}")
