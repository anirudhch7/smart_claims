import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Download,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';

const Savings = () => {
  const [savingsData, setSavingsData] = useState({
    totalBilled: 0,
    totalRepriced: 0,
    totalSavings: 0,
    savingsPercentage: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [serviceSavings, setServiceSavings] = useState([]);
  const [providerSavings, setProviderSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6months');

  useEffect(() => {
    // Simulate data fetching
    const mockSavingsData = {
      totalBilled: 2345678.90,
      totalRepriced: 1903456.78,
      totalSavings: 442222.12,
      savingsPercentage: 18.9
    };
    setSavingsData(mockSavingsData);

    const mockMonthlyData = [
      { month: 'Jan', billed: 380000, repriced: 310000, savings: 70000 },
      { month: 'Feb', billed: 420000, repriced: 340000, savings: 80000 },
      { month: 'Mar', billed: 390000, repriced: 320000, savings: 70000 },
      { month: 'Apr', billed: 450000, repriced: 360000, savings: 90000 },
      { month: 'May', billed: 410000, repriced: 330000, savings: 80000 },
      { month: 'Jun', billed: 440000, repriced: 350000, savings: 90000 }
    ];
    setMonthlyData(mockMonthlyData);

    const mockServiceSavings = [
      { serviceCode: '99213', count: 450, billed: 180000, repriced: 144000, savings: 36000 },
      { serviceCode: '99214', count: 320, billed: 200000, repriced: 160000, savings: 40000 },
      { serviceCode: '97110', count: 280, billed: 84000, repriced: 63000, savings: 21000 },
      { serviceCode: '99215', count: 150, billed: 120000, repriced: 90000, savings: 30000 },
      { serviceCode: '99212', count: 200, billed: 60000, repriced: 48000, savings: 12000 }
    ];
    setServiceSavings(mockServiceSavings);

    const mockProviderSavings = [
      { provider: 'Internal Medicine', savings: 85000, percentage: 19.2 },
      { provider: 'Family Medicine', savings: 72000, percentage: 18.5 },
      { provider: 'Cardiology', savings: 68000, percentage: 22.1 },
      { provider: 'Dermatology', savings: 45000, percentage: 16.8 },
      { provider: 'Orthopedics', savings: 38000, percentage: 17.3 }
    ];
    setProviderSavings(mockProviderSavings);

    setLoading(false);
  }, []);

  const handleExportCSV = () => {
    const csvContent = [
      ['Service Code', 'Claims Count', 'Billed Amount', 'Repriced Amount', 'Savings', 'Savings %'],
      ...serviceSavings.map(service => [
        service.serviceCode,
        service.count,
        service.billed,
        service.repriced,
        service.savings,
        ((service.savings / service.billed) * 100).toFixed(1)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'savings_analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(serviceSavings.map(service => ({
      'Service Code': service.serviceCode,
      'Claims Count': service.count,
      'Billed Amount': service.billed,
      'Repriced Amount': service.repriced,
      'Savings': service.savings,
      'Savings %': ((service.savings / service.billed) * 100).toFixed(1)
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Savings Analysis');
    XLSX.writeFile(workbook, 'savings_analysis.xlsx');
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
          <h1 className="text-2xl font-bold text-gray-900">Savings Analysis</h1>
          <p className="text-gray-600">Track cost savings and repricing effectiveness</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Billed</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${savingsData.totalBilled.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-100">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Repriced</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${savingsData.totalRepriced.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-success-100">
              <BarChart3 className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${savingsData.totalSavings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-success-100">
              <PieChartIcon className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Savings %</p>
              <p className="text-2xl font-semibold text-gray-900">
                {savingsData.savingsPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Savings Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Savings Trend</h3>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              <Line 
                type="monotone" 
                dataKey="billed" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Billed Amount"
              />
              <Line 
                type="monotone" 
                dataKey="repriced" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Repriced Amount"
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Savings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Savings by Service Code */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings by Service Code</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceSavings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="serviceCode" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              <Bar dataKey="savings" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analysis Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Code Analysis */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Savings by Service Code</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claims
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Savings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {serviceSavings.map((service) => (
                  <tr key={service.serviceCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.serviceCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${service.savings.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((service.savings / service.billed) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provider Analysis */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Savings by Provider Specialty</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Savings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providerSavings.map((provider) => (
                  <tr key={provider.provider} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {provider.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${provider.savings.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {provider.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Savings Breakdown Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              ${(savingsData.totalSavings * 0.4).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Repricing Savings (40%)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning-600 mb-2">
              ${(savingsData.totalSavings * 0.35).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Fraud Prevention (35%)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">
              ${(savingsData.totalSavings * 0.25).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Process Optimization (25%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Savings;
