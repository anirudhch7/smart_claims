import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Download,
  RefreshCw
} from 'lucide-react';

const Uploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      processedAt: null,
      claimsCount: 0,
      errors: []
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate file processing
    processFiles(newFiles);
  }, []);

  const processFiles = async (files) => {
    setProcessing(true);
    
    for (const fileObj of files) {
      // Simulate processing steps
      await simulateProcessing(fileObj);
    }
    
    setProcessing(false);
  };

  const simulateProcessing = async (fileObj) => {
    const steps = [
      { progress: 20, status: 'validating', message: 'Validating file format...' },
      { progress: 40, status: 'parsing', message: 'Parsing data...' },
      { progress: 60, status: 'processing', message: 'Processing claims...' },
      { progress: 80, status: 'analyzing', message: 'Running ML analysis...' },
      { progress: 100, status: 'completed', message: 'Processing complete!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileObj.id 
          ? { 
              ...f, 
              progress: step.progress, 
              status: step.status,
              processedAt: step.progress === 100 ? new Date().toISOString() : f.processedAt,
              claimsCount: step.progress === 100 ? Math.floor(Math.random() * 1000) + 100 : f.claimsCount
            }
          : f
      ));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 5,
    maxSize: 16 * 1024 * 1024 // 16MB
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const retryFile = (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      processFiles([file]);
    }
  };

  const downloadResults = (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      // Simulate download
      const csvContent = `Claim ID,Patient ID,Service Code,Billed Amount,Repriced Amount,Risk Score,Status
CLM_001,PAT_001,99213,150.00,120.00,25,Processed
CLM_002,PAT_002,99214,200.00,160.00,45,Review
CLM_003,PAT_003,97110,75.00,60.00,15,Processed`;

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name}_results.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-danger-500" />;
      default: return <RefreshCw className="h-5 w-5 text-primary-500 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-100';
      case 'error': return 'text-danger-600 bg-danger-100';
      case 'processing': return 'text-primary-600 bg-primary-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">File Uploads</h1>
        <p className="text-gray-600">Upload and process claims data files</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-gray-600 mb-4">
            or click to select files
          </p>
          <p className="text-sm text-gray-500">
            Supports CSV, JSON, XLS, XLSX files up to 16MB
          </p>
        </div>
      </div>

      {/* File Processing Status */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Processing Status</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status)}`}>
                        {file.status}
                      </span>
                    </div>
                    
                    {file.status === 'completed' && (
                      <div className="text-sm text-gray-600">
                        {file.claimsCount} claims processed
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      {file.status === 'completed' && (
                        <button
                          onClick={() => downloadResults(file.id)}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      )}
                      
                      {file.status === 'error' && (
                        <button
                          onClick={() => retryFile(file.id)}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {file.status !== 'completed' && file.status !== 'error' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Processing...</span>
                      <span>{file.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Processing Steps */}
                {file.status === 'processing' && (
                  <div className="mt-4">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <div className={`flex items-center ${file.progress >= 20 ? 'text-primary-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${file.progress >= 20 ? 'bg-primary-600' : 'bg-gray-300'}`} />
                        Validating
                      </div>
                      <div className={`flex items-center ${file.progress >= 40 ? 'text-primary-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${file.progress >= 40 ? 'bg-primary-600' : 'bg-gray-300'}`} />
                        Parsing
                      </div>
                      <div className={`flex items-center ${file.progress >= 60 ? 'text-primary-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${file.progress >= 60 ? 'bg-primary-600' : 'bg-gray-300'}`} />
                        Processing
                      </div>
                      <div className={`flex items-center ${file.progress >= 80 ? 'text-primary-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${file.progress >= 80 ? 'bg-primary-600' : 'bg-gray-300'}`} />
                        Analyzing
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Results Summary */}
                {file.status === 'completed' && (
                  <div className="mt-4 p-4 bg-success-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
                      <span className="text-sm font-medium text-success-800">
                        Successfully processed {file.claimsCount} claims
                      </span>
                    </div>
                    <p className="text-sm text-success-700 mt-1">
                      Results are now available in the Claims and Anomalies sections
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Upload Instructions</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Supported formats:</strong> CSV, JSON, XLS, XLSX</p>
          <p><strong>File size limit:</strong> 16MB per file</p>
          <p><strong>Required columns:</strong> claim_id, patient_id, patient_age, patient_gender, service_code, billed_amount, allowed_amount, provider_id, provider_specialty, claim_date</p>
          <p><strong>Processing time:</strong> Typically 1-3 minutes per file depending on size</p>
        </div>
      </div>
    </div>
  );
};

export default Uploads;
