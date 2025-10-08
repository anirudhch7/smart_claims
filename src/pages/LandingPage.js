import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, BarChart3, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Smart Claims</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Claims
            <span className="text-primary-600"> Repricing</span>
            <br />
            & Anomaly Detection
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Leverage advanced machine learning to detect fraudulent claims, optimize repricing, 
            and maximize savings with real-time anomaly detection and automated processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="border border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to optimize your claims processing
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fraud Detection
              </h3>
              <p className="text-gray-600">
                Advanced ML algorithms detect suspicious patterns and anomalies in real-time
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Repricing
              </h3>
              <p className="text-gray-600">
                Automated repricing based on service codes with intelligent discount calculations
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600">
                Comprehensive insights and reporting with real-time data visualization
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Smart Claims?
            </h2>
            <p className="text-xl text-gray-600">
              Proven results and cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Reduce Costs & Increase Efficiency
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Up to 30% Cost Reduction</h4>
                    <p className="text-gray-600">Intelligent repricing saves money on every claim</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Processing</h4>
                    <p className="text-gray-600">Instant anomaly detection and claim processing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Advanced Analytics</h4>
                    <p className="text-gray-600">Comprehensive insights and reporting capabilities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-success-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure & Compliant</h4>
                    <p className="text-gray-600">Enterprise-grade security with HIPAA compliance</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                <div className="text-lg text-gray-600 mb-4">Accuracy Rate</div>
                <div className="text-sm text-gray-500">in fraud detection</div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Speed</span>
                  <span className="font-semibold text-gray-900">10x Faster</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost Savings</span>
                  <span className="font-semibold text-gray-900">$2.3M+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Claims Processed</span>
                  <span className="font-semibold text-gray-900">1M+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Claims Processing?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of healthcare organizations already saving millions
          </p>
          <Link
            to="/signup"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Smart Claims Platform</h3>
            <p className="text-gray-400 mb-4">
              Advanced AI-powered claims processing and fraud detection
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Smart Claims Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
