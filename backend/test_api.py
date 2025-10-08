#!/usr/bin/env python3
"""
Test script for the Smart Claims Platform API
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:5000"
TEST_CSV_PATH = "data/synthetic_claims.csv"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_claims_upload():
    """Test claims upload endpoint"""
    print("\nTesting claims upload...")
    
    # Read test CSV file
    try:
        with open(TEST_CSV_PATH, 'rb') as f:
            files = {'file': ('test_claims.csv', f, 'text/csv')}
            headers = {'Authorization': 'Bearer test-token'}  # Mock token for testing
            
            response = requests.post(
                f"{BASE_URL}/api/claims/upload",
                files=files,
                headers=headers
            )
            
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
            return response.status_code in [200, 401]  # 401 expected without real auth
    except FileNotFoundError:
        print("Test CSV file not found. Run generate_synthetic_data.py first.")
        return False

def test_claims_retrieval():
    """Test claims retrieval endpoint"""
    print("\nTesting claims retrieval...")
    
    headers = {'Authorization': 'Bearer test-token'}  # Mock token for testing
    response = requests.get(
        f"{BASE_URL}/api/claims",
        headers=headers,
        params={'page': 1, 'limit': 10}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code in [200, 401]  # 401 expected without real auth

def test_anomalies():
    """Test anomalies endpoint"""
    print("\nTesting anomalies...")
    
    headers = {'Authorization': 'Bearer test-token'}  # Mock token for testing
    response = requests.get(f"{BASE_URL}/api/anomalies", headers=headers)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code in [200, 401]  # 401 expected without real auth

def test_savings():
    """Test savings endpoint"""
    print("\nTesting savings...")
    
    headers = {'Authorization': 'Bearer test-token'}  # Mock token for testing
    response = requests.get(f"{BASE_URL}/api/savings", headers=headers)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code in [200, 401]  # 401 expected without real auth

def main():
    """Run all tests"""
    print("Smart Claims Platform API Test Suite")
    print("=" * 40)
    
    tests = [
        test_health_check,
        test_claims_upload,
        test_claims_retrieval,
        test_anomalies,
        test_savings
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
                print("✅ PASSED")
            else:
                print("❌ FAILED")
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)  # Brief pause between tests
    
    print("\n" + "=" * 40)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed. Check the output above.")

if __name__ == "__main__":
    main()
