import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Filter,
  Download,
  Eye,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Anomalies = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [serviceStats, setServiceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [riskFilter, setRiskFilter] = useState('all');

  useEffect(() => {
    // Simulate data fetching
    const mockAnomalies = Array.from({ length: 50 }, (_, i) => ({
      id: `CLM_${String(i + 1).padStart(6, '0')}`,
      patientId: `PAT_${Math.floor(Math.random() * 900000) + 100000}`,
      serviceCode: ['99213', '99214', '97110', '99215', '99212'][Math.floor(Math.random() * 5)],
      billedAmount: Math.floor(Math.random() * 5000) + 1000,
      riskScore: Math.floor(Math.random() * 30) + 70, // High risk anomalies
      flags: ['excessive_amount', 'age_mismatch', 'specialty_mismatch'].slice(0, Math.floor(Math.random() * 3) + 1),
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      providerSpecialty: ['Internal Medicine', 'Family Medicine', 'Cardiology', 'Dermatology', 'Orthopedics'][Math.floor(Math.random() * 5)]
    }));

    setAnomalies(mockAnomalies);

    const mockServiceStats = [
      { serviceCode: '99213', count: 15, avgRisk: 78.5, totalAmount: 45000 },
      { serviceCode: '99214', count: 12, avgRisk: 82.3, totalAmount: 38000 },
      { serviceCode: '97110', count: 8, avgRisk: 75.2, totalAmount: 12000 },
      { serviceCode: '99215', count: 10, avgRisk: 85.1, totalAmount: 35000 },
      { serviceCode: '99212', count: 5, avgRisk: 72.8, totalAmount: 8000 }
    ];
    setServiceStats(mockServiceStats);

    setLoading(false);
  }, []);

  const getRiskColor = (score) => {
    if (score >= 90) return 'text-red-600 bg-red-100';
    if (score >= 80) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getFlagColor = (flag) => {
    switch (flag) {
      case 'excessive_amount': return 'text-red-600 bg-red-100';
      case 'age_mismatch': return 'text-orange-600 bg-orange-100';
      case 'specialty_mismatch': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAnomalies = anomalies.filter(anomaly => {
    if (riskFilter === 'all') return true;
    if (riskFilter === 'high') return anomaly.riskScore >= 80;
    if (riskFilter === 'critical') return anomaly.riskScore >= 90;
    return true;
  });

  const handleAnomalyClick = (anomaly) => {
    setSelectedAnomaly(anomaly);
    setShowModal(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Claim ID', 'Patient ID', 'Service Code', 'Billed Amount', 'Risk Score', 'Flags', 'Date'],
      ...filteredAnomalies.map(anomaly => [
        anomaly.id,
        anomaly.patientId,
        anomaly.serviceCode,
        anomaly.billedAmount,
        anomaly.riskScore,
        anomaly.flags.join(';'),
        anomaly.date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anomalies_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Anomalies</h1>
          <p className="text-gray-600">Detected anomalies and high-risk claims</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-danger-100">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Anomalies</p>
              <p className="text-2xl font-semibold text-gray-900">{anomalies.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-100">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk (80%+)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {anomalies.filter(a => a.riskScore >= 80).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <BarChart3 className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical (90%+)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {anomalies.filter(a => a.riskScore >= 90).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${anomalies.reduce((sum, a) => sum + a.billedAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomalies by Service Code */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Anomalies by Service Code</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="serviceCode" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Score Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: '70-79%', value: anomalies.filter(a => a.riskScore >= 70 && a.riskScore < 80).length, color: '#F59E0B' },
                  { name: '80-89%', value: anomalies.filter(a => a.riskScore >= 80 && a.riskScore < 90).length, color: '#EF4444' },
                  { name: '90-100%', value: anomalies.filter(a => a.riskScore >= 90).length, color: '#DC2626' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {[
                  { name: '70-79%', value: anomalies.filter(a => a.riskScore >= 70 && a.riskScore < 80).length, color: '#F59E0B' },
                  { name: '80-89%', value: anomalies.filter(a => a.riskScore >= 80 && a.riskScore < 90).length, color: '#EF4444' },
                  { name: '90-100%', value: anomalies.filter(a => a.riskScore >= 90).length, color: '#DC2626' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk (80%+)</option>
              <option value="critical">Critical (90%+)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billed Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flags
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
              {filteredAnomalies.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {anomaly.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{anomaly.serviceCode}</div>
                      <div className="text-gray-500">{anomaly.providerSpecialty}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${anomaly.billedAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(anomaly.riskScore)}`}>
                      {anomaly.riskScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {anomaly.flags.map((flag, index) => (
                        <span key={index} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFlagColor(flag)}`}>
                          {flag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(anomaly.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleAnomalyClick(anomaly)}
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
      </div>

      {/* Anomaly Details Modal */}
      {showModal && selectedAnomaly && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Anomaly Details</h3>
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
                  <p className="mt-1 text-sm text-gray-900">{selectedAnomaly.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAnomaly.patientId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Code</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAnomaly.serviceCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider Specialty</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAnomaly.providerSpecialty}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Billed Amount</label>
                  <p className="mt-1 text-sm text-gray-900">${selectedAnomaly.billedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Risk Score</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAnomaly.riskScore}%</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Detected Flags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedAnomaly.flags.map((flag, index) => (
                    <span key={index} className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getFlagColor(flag)}`}>
                      {flag.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button className="bg-danger-600 text-white px-4 py-2 rounded-md hover:bg-danger-700 transition-colors">
                  Flag for Review
                </button>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Investigate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Anomalies;
