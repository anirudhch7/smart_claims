import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClaims: 0,
    totalSavings: 0,
    anomalyCount: 0,
    avgRiskScore: 0,
    processingRate: 0,
    costReduction: 0
  });

  const [riskDistribution, setRiskDistribution] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);

  useEffect(() => {
    // Simulate data fetching
    const mockStats = {
      totalClaims: 1247,
      totalSavings: 234567.89,
      anomalyCount: 89,
      avgRiskScore: 23.4,
      processingRate: 98.5,
      costReduction: 18.7
    };
    setStats(mockStats);

    const mockRiskDistribution = [
      { name: 'Low Risk', value: 856, color: '#10B981' },
      { name: 'Medium Risk', value: 302, color: '#F59E0B' },
      { name: 'High Risk', value: 89, color: '#EF4444' }
    ];
    setRiskDistribution(mockRiskDistribution);

    const mockMonthlyTrends = [
      { month: 'Jan', claims: 1200, savings: 45000 },
      { month: 'Feb', claims: 1350, savings: 52000 },
      { month: 'Mar', claims: 1180, savings: 48000 },
      { month: 'Apr', claims: 1420, savings: 55000 },
      { month: 'May', claims: 1380, savings: 53000 },
      { month: 'Jun', claims: 1247, savings: 48000 }
    ];
    setMonthlyTrends(mockMonthlyTrends);

    const mockRecentClaims = [
      { id: 'CLM_001234', amount: 1250.00, risk: 15, status: 'Processed' },
      { id: 'CLM_001235', amount: 890.50, risk: 45, status: 'Review' },
      { id: 'CLM_001236', amount: 2100.00, risk: 78, status: 'Flagged' },
      { id: 'CLM_001237', amount: 675.25, risk: 22, status: 'Processed' },
      { id: 'CLM_001238', amount: 1450.75, risk: 67, status: 'Review' }
    ];
    setRecentClaims(mockRecentClaims);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          {change > 0 ? (
            <ArrowUpRight className="h-4 w-4 text-success-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-danger-500" />
          )}
          <span className={`ml-1 text-sm font-medium ${change > 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {Math.abs(change)}%
          </span>
          <span className="ml-1 text-sm text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your claims processing and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Claims"
          value={stats.totalClaims.toLocaleString()}
          change={12.5}
          icon={FileText}
          color="primary"
        />
        <StatCard
          title="Total Savings"
          value={`$${stats.totalSavings.toLocaleString()}`}
          change={8.3}
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Anomalies Detected"
          value={stats.anomalyCount}
          change={-15.2}
          icon={AlertTriangle}
          color="warning"
        />
        <StatCard
          title="Avg Risk Score"
          value={`${stats.avgRiskScore}%`}
          change={-5.1}
          icon={Activity}
          color="primary"
        />
        <StatCard
          title="Processing Rate"
          value={`${stats.processingRate}%`}
          change={2.1}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Cost Reduction"
          value={`${stats.costReduction}%`}
          change={3.7}
          icon={Users}
          color="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center space-x-6">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="claims" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Claims"
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Savings ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${claim.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      claim.risk < 30 ? 'bg-success-100 text-success-800' :
                      claim.risk < 70 ? 'bg-warning-100 text-warning-800' :
                      'bg-danger-100 text-danger-800'
                    }`}>
                      {claim.risk}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      claim.status === 'Processed' ? 'bg-success-100 text-success-800' :
                      claim.status === 'Review' ? 'bg-warning-100 text-warning-800' :
                      'bg-danger-100 text-danger-800'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
