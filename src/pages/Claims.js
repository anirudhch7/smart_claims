import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    // Simulate data fetching
    const mockClaims = Array.from({ length: 100 }, (_, i) => ({
      id: `CLM_${String(i + 1).padStart(6, '0')}`,
      patientId: `PAT_${Math.floor(Math.random() * 900000) + 100000}`,
      patientAge: Math.floor(Math.random() * 60) + 20,
      patientGender: Math.random() > 0.5 ? 'M' : 'F',
      serviceCode: ['99213', '99214', '97110', '99215', '99212'][Math.floor(Math.random() * 5)],
      billedAmount: Math.floor(Math.random() * 2000) + 100,
      allowedAmount: Math.floor(Math.random() * 1500) + 100,
      repricedAmount: Math.floor(Math.random() * 1200) + 100,
      discountPercent: Math.floor(Math.random() * 30) + 10,
      providerId: `PROV_${Math.floor(Math.random() * 9000) + 1000}`,
      providerSpecialty: ['Internal Medicine', 'Family Medicine', 'Cardiology', 'Dermatology', 'Orthopedics'][Math.floor(Math.random() * 5)],
      claimDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rulesFlags: Math.random() > 0.8 ? ['excessive_amount'] : [],
      mlRiskScore: Math.floor(Math.random() * 100),
      status: ['Processed', 'Review', 'Flagged'][Math.floor(Math.random() * 3)]
    }));

    setClaims(mockClaims);
    setFilteredClaims(mockClaims);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = claims;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(claim =>
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.serviceCode.includes(searchTerm)
      );
    }

    // Risk filter
    if (riskFilter !== 'all') {
      const riskThreshold = riskFilter === 'high' ? 70 : riskFilter === 'medium' ? 30 : 0;
      filtered = filtered.filter(claim => {
        if (riskFilter === 'high') return claim.mlRiskScore >= 70;
        if (riskFilter === 'medium') return claim.mlRiskScore >= 30 && claim.mlRiskScore < 70;
        return claim.mlRiskScore < 30;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(claim => claim.status.toLowerCase() === statusFilter);
    }

    setFilteredClaims(filtered);
    setCurrentPage(1);
  }, [claims, searchTerm, riskFilter, statusFilter]);

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-danger-600 bg-danger-100';
    if (score >= 30) return 'text-warning-600 bg-warning-100';
    return 'text-success-600 bg-success-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'text-success-600 bg-success-100';
      case 'Review': return 'text-warning-600 bg-warning-100';
      case 'Flagged': return 'text-danger-600 bg-danger-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processed': return <CheckCircle className="h-4 w-4" />;
      case 'Review': return <Clock className="h-4 w-4" />;
      case 'Flagged': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleClaimClick = (claim) => {
    setSelectedClaim(claim);
    setShowModal(true);
  };

  const handleExport = () => {
    // Simulate CSV export
    const csvContent = [
      ['Claim ID', 'Patient ID', 'Service Code', 'Billed Amount', 'Repriced Amount', 'Risk Score', 'Status'],
      ...filteredClaims.map(claim => [
        claim.id,
        claim.patientId,
        claim.serviceCode,
        claim.billedAmount,
        claim.repricedAmount,
        claim.mlRiskScore,
        claim.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claims_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClaims = filteredClaims.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          <p className="text-gray-600">Manage and review processed claims</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk (0-29%)</option>
              <option value="medium">Medium Risk (30-69%)</option>
              <option value="high">High Risk (70-100%)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="processed">Processed</option>
              <option value="review">Review</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amounts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{claim.patientId}</div>
                      <div className="text-gray-500">{claim.patientAge} {claim.patientGender}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{claim.serviceCode}</div>
                      <div className="text-gray-500">{claim.providerSpecialty}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">${claim.billedAmount.toLocaleString()}</div>
                      <div className="text-success-600">→ ${claim.repricedAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{claim.discountPercent}% off</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(claim.mlRiskScore)}`}>
                      {claim.mlRiskScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      <span className="ml-1">{claim.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.claimDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleClaimClick(claim)}
                      className="text-primary-600 hover:text-primary-900 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredClaims.length)}</span> of{' '}
                  <span className="font-medium">{filteredClaims.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Claim Details Modal */}
      {showModal && selectedClaim && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Claim Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Claim ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClaim.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClaim.patientId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Code</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClaim.serviceCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider Specialty</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClaim.providerSpecialty}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Billed Amount</label>
                  <p className="mt-1 text-sm text-gray-900">${selectedClaim.billedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Repriced Amount</label>
                  <p className="mt-1 text-sm text-success-600">${selectedClaim.repricedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClaim.discountPercent}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Risk Score</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClaim.mlRiskScore}%</p>
                </div>
              </div>
              
              {selectedClaim.rulesFlags.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedClaim.rulesFlags.map((flag, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800">
                        {flag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Take Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Claims;
