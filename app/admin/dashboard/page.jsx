"use client";
import { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ProtectedRoute from '@/components/ProtectedRoute';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample data
  const pageViewsData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Page Views',
        data: [120, 190, 300, 250, 200, 180, 400],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.3,
      }
    ]
  };

  const trafficSourcesData = {
    labels: ['Direct', 'Social', 'Search', 'Referral', 'Email'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const popularPagesData = {
    labels: ['Home', 'Vehicles', 'About', 'Contact', 'Blog'],
    datasets: [
      {
        label: 'Visits',
        data: [1200, 800, 400, 300, 200],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      }
    ]
  };

  const userActivityData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Active Users',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 1000)),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const stats = [
    { name: 'Total Visitors', value: '12,345', change: '+12%', trend: 'up' },
    { name: 'Avg. Session', value: '2m 45s', change: '+3%', trend: 'up' },
    { name: 'Bounce Rate', value: '42%', change: '-5%', trend: 'down' },
    { name: 'Conversions', value: '87', change: '+24%', trend: 'up' },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Website Analytics</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md ${timeRange === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md ${timeRange === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-md ${timeRange === '90d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              90 Days
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">{stat.name}</div>
                  <div className="mt-2 text-3xl font-bold">{stat.value}</div>
                  <div className={`mt-2 flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                    {stat.trend === 'up' ? (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Page Views</h2>
                <div className="h-80">
                  <Line
                    data={pageViewsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Traffic Sources</h2>
                <div className="h-80">
                  <Pie
                    data={trafficSourcesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'right' },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Popular Pages</h2>
                <div className="h-80">
                  <Bar
                    data={popularPagesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">User Activity (24h)</h2>
                <div className="h-80">
                  <Line
                    data={userActivityData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { page: '/vehicles/123', visitor: 'User from Kenya', duration: '2:45', time: '2 mins ago' },
                      { page: '/contact', visitor: 'User from UK', duration: '1:30', time: '5 mins ago' },
                      { page: '/blog/post-1', visitor: 'Returning User', duration: '4:15', time: '12 mins ago' },
                      { page: '/', visitor: 'New User', duration: '0:45', time: '18 mins ago' },
                      { page: '/about', visitor: 'User from US', duration: '3:20', time: '25 mins ago' },
                    ].map((activity, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                          {activity.page}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.visitor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}