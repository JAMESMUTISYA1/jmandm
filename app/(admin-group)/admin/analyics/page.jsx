// app/(admin)/analytics/page.jsx
"use client";
import { useState, useEffect } from "react";
import { db } from '../../../../Shared/Firebaseconfig';
import { collection, getDocs, query, where } from "firebase/firestore";
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

export default function AnalyticsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'

  useEffect(() => {
    fetchContacts();
  }, [timeRange]);

  const fetchContacts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "contacts"));
      const contactsData = [];
      querySnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() });
      });
      setContacts(contactsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts: ", error);
      toast.error("Failed to load contacts");
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalContacts = contacts.length;
  const contactedCount = contacts.filter(c => c.contacted).length;
  const pendingCount = totalContacts - contactedCount;
  const contactRate = totalContacts > 0 ? Math.round((contactedCount / totalContacts) * 100) : 0;

  // Prepare data for charts
  const getTimeData = () => {
    const now = new Date();
    let labels = [];
    let contactedData = [];
    let pendingData = [];

    if (timeRange === 'day') {
      // Last 24 hours by hour
      labels = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(now.getHours() - 23 + i);
        return hour.getHours() + ':00';
      });
      
      // Initialize data arrays with zeros
      contactedData = new Array(24).fill(0);
      pendingData = new Array(24).fill(0);

      // Populate data
      contacts.forEach(contact => {
        const contactDate = new Date(contact.createdAt?.seconds * 1000 || contact.createdAt);
        const hourDiff = Math.floor((now - contactDate) / (1000 * 60 * 60));
        if (hourDiff >= 0 && hourDiff < 24) {
          const hourIndex = 23 - hourDiff;
          if (contact.contacted) {
            contactedData[hourIndex]++;
          } else {
            pendingData[hourIndex]++;
          }
        }
      });
    } 
    else if (timeRange === 'week') {
      // Last 7 days
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - 6 + i);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      });

      contactedData = new Array(7).fill(0);
      pendingData = new Array(7).fill(0);

      contacts.forEach(contact => {
        const contactDate = new Date(contact.createdAt?.seconds * 1000 || contact.createdAt);
        const dayDiff = Math.floor((now - contactDate) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 7) {
          const dayIndex = 6 - dayDiff;
          if (contact.contacted) {
            contactedData[dayIndex]++;
          } else {
            pendingData[dayIndex]++;
          }
        }
      });
    }
    else if (timeRange === 'month') {
      // Last 30 days
      labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - 29 + i);
        return date.getDate();
      });

      contactedData = new Array(30).fill(0);
      pendingData = new Array(30).fill(0);

      contacts.forEach(contact => {
        const contactDate = new Date(contact.createdAt?.seconds * 1000 || contact.createdAt);
        const dayDiff = Math.floor((now - contactDate) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 30) {
          const dayIndex = 29 - dayDiff;
          if (contact.contacted) {
            contactedData[dayIndex]++;
          } else {
            pendingData[dayIndex]++;
          }
        }
      });
    }
    else { // year
      // Last 12 months
      labels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - 11 + i);
        return date.toLocaleDateString('en-US', { month: 'short' });
      });

      contactedData = new Array(12).fill(0);
      pendingData = new Array(12).fill(0);

      contacts.forEach(contact => {
        const contactDate = new Date(contact.createdAt?.seconds * 1000 || contact.createdAt);
        const monthDiff = (now.getFullYear() - contactDate.getFullYear()) * 12 + 
                         (now.getMonth() - contactDate.getMonth());
        if (monthDiff >= 0 && monthDiff < 12) {
          const monthIndex = 11 - monthDiff;
          if (contact.contacted) {
            contactedData[monthIndex]++;
          } else {
            pendingData[monthIndex]++;
          }
        }
      });
    }

    return { labels, contactedData, pendingData };
  };

  const { labels, contactedData, pendingData } = getTimeData();

  // Chart data configurations
  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Contacted',
        data: contactedData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: pendingData,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Contacted', 'Pending'],
    datasets: [
      {
        data: [contactedCount, pendingCount],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Total Contacts',
        data: labels.map((_, i) => contactedData[i] + pendingData[i]),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Contacts by Status (Last ${timeRange})`,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Contact Status Distribution',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Total Contacts Trend (Last ${timeRange})`,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Contact Analytics Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500">No contact data available for analysis</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-blue-800">Total Contacts</h3>
              <p className="text-3xl font-bold text-blue-600">{totalContacts}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-green-800">Contacted</h3>
              <p className="text-3xl font-bold text-green-600">{contactedCount}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-yellow-800">Contact Rate</h3>
              <p className="text-3xl font-bold text-yellow-600">{contactRate}%</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>

          {/* Recent Contacts Table */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Contacts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.slice(0, 5).map((contact) => (
                    <tr key={contact.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{contact.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contact.createdAt?.seconds * 1000 || contact.createdAt).toLocaleString()}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}