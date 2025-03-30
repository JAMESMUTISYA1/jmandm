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
import { db } from '../../../../Shared/Firebaseconfig';
import { collection, getDocs } from "firebase/firestore";

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
  const [contacts, setContacts] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contacts
        const contactsSnapshot = await getDocs(collection(db, "contacts"));
        const contactsData = [];
        contactsSnapshot.forEach((doc) => {
          contactsData.push({ id: doc.id, ...doc.data() });
        });
        setContacts(contactsData);

        // Fetch vehicles
        const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
        const vehiclesData = [];
        vehiclesSnapshot.forEach((doc) => {
          vehiclesData.push({ id: doc.id, ...doc.data() });
        });
        setVehicles(vehiclesData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalContacts = contacts.length;
  const contactedCount = contacts.filter(c => c.contacted).length;
  const pendingCount = totalContacts - contactedCount;
  const contactRate = totalContacts > 0 ? Math.round((contactedCount / totalContacts) * 100) : 0;

  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const reservedVehicles = vehicles.filter(v => v.status === 'reserved').length;
  const soldVehicles = vehicles.filter(v => v.status === 'sold').length;
  const popularBrands = getPopularBrands(vehicles);

  function getPopularBrands(vehicles) {
    const brandCounts = {};
    vehicles.forEach(vehicle => {
      brandCounts[vehicle.make] = (brandCounts[vehicle.make] || 0) + 1;
    });
    return Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

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

  const vehicleStatusData = {
    labels: ['Available', 'Reserved', 'Sold'],
    datasets: [
      {
        data: [availableVehicles, reservedVehicles, soldVehicles],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const contactStatusData = {
    labels: ['Contacted', 'Pending'],
    datasets: [
      {
        data: [contactedCount, pendingCount],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const popularBrandsData = {
    labels: popularBrands.map(brand => brand[0]),
    datasets: [
      {
        label: 'Count',
        data: popularBrands.map(brand => brand[1]),
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      }
    ]
  };

  const stats = [
    { name: 'Total Visitors', value: '12,345', change: '+12%', trend: 'up' },
    { name: 'Avg. Session', value: '2m 45s', change: '+3%', trend: 'up' },
    { name: 'Total Vehicles', value: totalVehicles, change: '', trend: '' },
    { name: 'Available Vehicles', value: availableVehicles, change: '', trend: '' },
    { name: 'Total Contacts', value: totalContacts, change: '', trend: '' },
    { name: 'Contact Rate', value: `${contactRate}%`, change: '', trend: '' },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6 text-black">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dealership Analytics Dashboard</h1>
          <div className="flex space-x-2 text-black">
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
            <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-6 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-gray-500 text-sm">{stat.name}</div>
                  <div className="mt-2 text-3xl font-bold">{stat.value}</div>
                  {stat.change && (
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
                  )}
                </div>
              ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-black">
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

              <div className="bg-white p-6 text-black rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Vehicle Status</h2>
                <div className="h-80">
                  <Pie
                    data={vehicleStatusData}
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

              <div className="bg-white text-black p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Contact Status</h2>
                <div className="h-80">
                  <Pie
                    data={contactStatusData}
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
            <div className="grid grid-cols-1 text-black lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Popular Vehicle Brands</h2>
                <div className="h-80">
                  <Bar
                    data={popularBrandsData}
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

              <div className="bg-white p-6 text-black rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Recent Vehicle Additions</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y text-black divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y text-black divide-gray-200">
                      {vehicles.slice(0, 5).map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.make}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${vehicle.price?.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                              vehicle.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {vehicle.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Activity Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Recent Contacts</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contacts.slice(0, 5).map((contact) => (
                        <tr key={contact.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {contact.contacted ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Contacted
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(contact.createdAt?.seconds * 1000 || contact.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Recent Website Activity</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-black divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { page: '/vehicles/123', visitor: 'User from Kenya', time: '2 mins ago' },
                        { page: '/contact', visitor: 'User from UK', time: '5 mins ago' },
                        { page: '/blog/post-1', visitor: 'Returning User', time: '12 mins ago' },
                        { page: '/', visitor: 'New User', time: '18 mins ago' },
                        { page: '/about', visitor: 'User from US', time: '25 mins ago' },
                      ].map((activity, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                            {activity.page}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.visitor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}