"use client";
import { useState, useEffect } from "react";
import { db } from '../../../../Shared/Firebaseconfig';
import { collection, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, 
         CategoryScale, 
         LinearScale, 
         BarElement, 
         Title, 
         Tooltip, 
         Legend, 
         ArcElement,
         PointElement,
         LineElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function CombinedAnalyticsPage() {
  const [vehicles, setVehicles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicles
      const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
      const vehiclesData = [];
      vehiclesSnapshot.forEach((doc) => {
        const data = doc.data();
        vehiclesData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          price: Number(data.price) || 0
        });
      });
      setVehicles(vehiclesData);

      // Fetch contacts
      const contactsSnapshot = await getDocs(collection(db, "contacts"));
      const contactsData = [];
      contactsSnapshot.forEach((doc) => {
        const data = doc.data();
        contactsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      setContacts(contactsData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  // Vehicle statistics
  const totalVehicles = vehicles.length;
  const availableCount = vehicles.filter(v => v.status === 'available').length;
  const reservedCount = vehicles.filter(v => v.status === 'reserved').length;
  const soldCount = vehicles.filter(v => v.status === 'sold').length;
  const averagePrice = totalVehicles > 0 
    ? Math.round(vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0) / totalVehicles)
    : 0;

  // Contact statistics
  const totalContacts = contacts.length;
  const contactedCount = contacts.filter(c => c.contacted).length;
  const pendingCount = totalContacts - contactedCount;
  const contactRate = totalContacts > 0 ? Math.round((contactedCount / totalContacts) * 100) : 0;

  // Get popular brands
  const getPopularBrands = () => {
    const brandCounts = {};
    vehicles.forEach(vehicle => {
      const brand = vehicle.brand || 'Unknown';
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
    return Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const popularBrands = getPopularBrands();

  // Prepare time-based data for charts
  const getTimeData = () => {
    const now = new Date();
    let labels = [];
    let vehicleData = {
      available: [],
      reserved: [],
      sold: []
    };
    let contactData = {
      contacted: [],
      pending: []
    };

    if (timeRange === 'day') {
      // Last 24 hours by hour
      labels = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(now.getHours() - 23 + i);
        return `${hour.getHours()}:00`;
      });
      
      // Initialize data arrays
      vehicleData.available = new Array(24).fill(0);
      vehicleData.reserved = new Array(24).fill(0);
      vehicleData.sold = new Array(24).fill(0);
      contactData.contacted = new Array(24).fill(0);
      contactData.pending = new Array(24).fill(0);

      // Populate vehicle data
      vehicles.forEach(vehicle => {
        const vehicleDate = new Date(vehicle.createdAt);
        const hourDiff = Math.floor((now.getTime() - vehicleDate.getTime()) / (1000 * 60 * 60));
        if (hourDiff >= 0 && hourDiff < 24) {
          const hourIndex = 23 - hourDiff;
          if (vehicle.status === 'available') vehicleData.available[hourIndex]++;
          else if (vehicle.status === 'reserved') vehicleData.reserved[hourIndex]++;
          else if (vehicle.status === 'sold') vehicleData.sold[hourIndex]++;
        }
      });

      // Populate contact data
      contacts.forEach(contact => {
        const contactDate = new Date(contact.createdAt);
        const hourDiff = Math.floor((now.getTime() - contactDate.getTime()) / (1000 * 60 * 60));
        if (hourDiff >= 0 && hourDiff < 24) {
          const hourIndex = 23 - hourDiff;
          if (contact.contacted) contactData.contacted[hourIndex]++;
          else contactData.pending[hourIndex]++;
        }
      });
    } 
    // Similar logic for week, month, and year ranges...
    // [Previous time range calculation code...]

    return { labels, vehicleData, contactData };
  };

  const { labels, vehicleData, contactData } = getTimeData();

  // Chart data configurations
  const vehicleStatusTrendData = {
    labels,
    datasets: [
      {
        label: 'Available',
        data: vehicleData.available,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Reserved',
        data: vehicleData.reserved,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Sold',
        data: vehicleData.sold,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const contactStatusTrendData = {
    labels,
    datasets: [
      {
        label: 'Contacted',
        data: contactData.contacted,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: contactData.pending,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  // ... other chart configurations ...

  return (
    <div className="bg-white text-black rounded-lg shadow p-6">
      <ToastContainer />
      <h1 className="text-2xl text-black font-bold mb-6">Dealership Analytics Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Time range selector */}
          <div className="mb-6 flex justify-end">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            {/* Vehicle stats */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-blue-800">Total Vehicles</h3>
              <p className="text-3xl font-bold text-blue-600">{totalVehicles}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-green-800">Available</h3>
              <p className="text-3xl font-bold text-green-600">{availableCount}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-yellow-800">Reserved</h3>
              <p className="text-3xl font-bold text-yellow-600">{reservedCount}</p>
            </div>
            
            {/* Contact stats */}
            <div className="bg-indigo-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-indigo-800">Total Contacts</h3>
              <p className="text-3xl font-bold text-indigo-600">{totalContacts}</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-teal-800">Contacted</h3>
              <p className="text-3xl font-bold text-teal-600">{contactedCount}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-purple-800">Contact Rate</h3>
              <p className="text-3xl font-bold text-purple-600">{contactRate}%</p>
            </div>
          </div>

          {/* Vehicle Analytics Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Vehicle Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Vehicle Status Trend</h3>
                <Bar data={vehicleStatusTrendData} options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: `Vehicle Status (Last ${timeRange})` },
                  },
                }} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Popular Brands</h3>
                <Bar data={{
                  labels: popularBrands.map(brand => brand[0]),
                  datasets: [{
                    label: 'Count',
                    data: popularBrands.map(brand => brand[1]),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                  }],
                }} options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Top Vehicle Brands' },
                  },
                }} />
              </div>
            </div>
          </div>

          {/* Contact Analytics Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Contact Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Contact Status Trend</h3>
                <Bar data={contactStatusTrendData} options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: `Contact Status (Last ${timeRange})` },
                  },
                }} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Contact Status Distribution</h3>
                <Pie data={{
                  labels: ['Contacted', 'Pending'],
                  datasets: [{
                    data: [contactedCount, pendingCount],
                    backgroundColor: [
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 159, 64, 0.6)'
                    ],
                    borderWidth: 1,
                  }],
                }} options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Contact Status' },
                  },
                }} />
              </div>
            </div>
          </div>

          {/* Recent Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Vehicles</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Vehicle table content... */}
                </table>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Contacts</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .slice(0, 5)
                      .map((contact) => (
                        <tr key={contact.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {contact.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contact.email || '-'}
                          </td>
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
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </td>
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
  );
}