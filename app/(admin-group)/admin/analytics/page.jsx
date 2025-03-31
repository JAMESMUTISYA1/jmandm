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

export default function VehicleAnalyticsPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'

  useEffect(() => {
    fetchVehicles();
  }, [timeRange]);

  const fetchVehicles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "vehicles"));
      const vehiclesData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        vehiclesData.push({ 
          id: doc.id, 
          ...data,
          // Ensure createdAt is a Date object
          createdAt: data.createdAt?.toDate() || new Date(),
          // Ensure price is a number
          price: Number(data.price) || 0
        });
      });
      setVehicles(vehiclesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
      toast.error("Failed to load vehicles");
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalVehicles = vehicles.length;
  const availableCount = vehicles.filter(v => v.status === 'available').length;
  const reservedCount = vehicles.filter(v => v.status === 'reserved').length;
  const soldCount = vehicles.filter(v => v.status === 'sold').length;
  
  // Fixed average price calculation
  const averagePrice = totalVehicles > 0 
    ? Math.round(vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0) / totalVehicles)
    : 0;

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

  // Prepare data for charts
  const getTimeData = () => {
    const now = new Date();
    let labels = [];
    let availableData = [];
    let reservedData = [];
    let soldData = [];

    if (timeRange === 'day') {
      // Last 24 hours by hour
      labels = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(now.getHours() - 23 + i);
        return `${hour.getHours()}:00`;
      });
      
      // Initialize data arrays with zeros
      availableData = new Array(24).fill(0);
      reservedData = new Array(24).fill(0);
      soldData = new Array(24).fill(0);

      // Populate data with proper date comparison
      vehicles.forEach(vehicle => {
        const vehicleDate = new Date(vehicle.createdAt);
        const hourDiff = Math.floor((now.getTime() - vehicleDate.getTime()) / (1000 * 60 * 60));
        if (hourDiff >= 0 && hourDiff < 24) {
          const hourIndex = 23 - hourDiff;
          if (vehicle.status === 'available') {
            availableData[hourIndex]++;
          } else if (vehicle.status === 'reserved') {
            reservedData[hourIndex]++;
          } else if (vehicle.status === 'sold') {
            soldData[hourIndex]++;
          }
        }
      });
    } else if (timeRange === 'week') {
      // Last 7 days
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - 6 + i);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      });

      availableData = new Array(7).fill(0);
      reservedData = new Array(7).fill(0);
      soldData = new Array(7).fill(0);

      vehicles.forEach(vehicle => {
        const vehicleDate = new Date(vehicle.createdAt);
        const dayDiff = Math.floor((now.getTime() - vehicleDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 7) {
          const dayIndex = 6 - dayDiff;
          if (vehicle.status === 'available') {
            availableData[dayIndex]++;
          } else if (vehicle.status === 'reserved') {
            reservedData[dayIndex]++;
          } else if (vehicle.status === 'sold') {
            soldData[dayIndex]++;
          }
        }
      });
    } else if (timeRange === 'month') {
      // Last 30 days
      labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - 29 + i);
        return date.getDate().toString();
      });

      availableData = new Array(30).fill(0);
      reservedData = new Array(30).fill(0);
      soldData = new Array(30).fill(0);

      vehicles.forEach(vehicle => {
        const vehicleDate = new Date(vehicle.createdAt);
        const dayDiff = Math.floor((now.getTime() - vehicleDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 30) {
          const dayIndex = 29 - dayDiff;
          if (vehicle.status === 'available') {
            availableData[dayIndex]++;
          } else if (vehicle.status === 'reserved') {
            reservedData[dayIndex]++;
          } else if (vehicle.status === 'sold') {
            soldData[dayIndex]++;
          }
        }
      });
    } else { // year
      // Last 12 months
      labels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - 11 + i);
        return date.toLocaleDateString('en-US', { month: 'short' });
      });

      availableData = new Array(12).fill(0);
      reservedData = new Array(12).fill(0);
      soldData = new Array(12).fill(0);

      vehicles.forEach(vehicle => {
        const vehicleDate = new Date(vehicle.createdAt);
        const monthDiff = (now.getFullYear() - vehicleDate.getFullYear()) * 12 + 
                         (now.getMonth() - vehicleDate.getMonth());
        if (monthDiff >= 0 && monthDiff < 12) {
          const monthIndex = 11 - monthDiff;
          if (vehicle.status === 'available') {
            availableData[monthIndex]++;
          } else if (vehicle.status === 'reserved') {
            reservedData[monthIndex]++;
          } else if (vehicle.status === 'sold') {
            soldData[monthIndex]++;
          }
        }
      });
    }

    return { labels, availableData, reservedData, soldData };
  };

  const { labels, availableData, reservedData, soldData } = getTimeData();

  // Fixed price trend data calculation
  const getPriceTrendData = () => {
    const now = new Date();
    return labels.map((_, i) => {
      const periodVehicles = vehicles.filter(v => {
        const vehicleDate = new Date(v.createdAt);
        let diff;
        
        if (timeRange === 'day') {
          diff = Math.floor((now.getTime() - vehicleDate.getTime()) / (1000 * 60 * 60));
          return diff >= 0 && diff < 24 && (23 - diff) === i;
        } else if (timeRange === 'week') {
          diff = Math.floor((now.getTime() - vehicleDate.getTime()) / (1000 * 60 * 60 * 24));
          return diff >= 0 && diff < 7 && (6 - diff) === i;
        } else if (timeRange === 'month') {
          diff = Math.floor((now.getTime() - vehicleDate.getTime()) / (1000 * 60 * 60 * 24));
          return diff >= 0 && diff < 30 && (29 - diff) === i;
        } else {
          diff = (now.getFullYear() - vehicleDate.getFullYear()) * 12 + 
                (now.getMonth() - vehicleDate.getMonth());
          return diff >= 0 && diff < 12 && (11 - diff) === i;
        }
      });
      
      if (periodVehicles.length === 0) return 0;
      
      const sum = periodVehicles.reduce((total, v) => total + v.price, 0);
      return Math.round(sum / periodVehicles.length);
    });
  };

  const priceTrendData = {
    labels,
    datasets: [
      {
        label: 'Average Price',
        data: getPriceTrendData(),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="bg-white text-black rounded-lg shadow p-6">
      <ToastContainer />
      <h1 className="text-2xl text-black font-bold mb-6">Vehicle Analytics Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center text-black items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicle data available for analysis</p>
      ) : (
        <>
          {/* Time range selector */}
          <div className="mb-6 text-black flex justify-end">
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
          <div className="grid text-black grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <div className="bg-purple-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-purple-800">Avg. Price</h3>
              <p className="text-3xl font-bold text-purple-600">Ksh {averagePrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid text-black grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Vehicle Status Trend</h3>
              <Bar 
                data={{
                  labels,
                  datasets: [
                    {
                      label: 'Available',
                      data: availableData,
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Reserved',
                      data: reservedData,
                      backgroundColor: 'rgba(255, 206, 86, 0.6)',
                      borderColor: 'rgba(255, 206, 86, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Sold',
                      data: soldData,
                      backgroundColor: 'rgba(255, 99, 132, 0.6)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1,
                    },
                  ],
                }} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: `Vehicle Status Over Time (Last ${timeRange})`,
                    },
                  },
                }} 
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Status Distribution</h3>
              <Pie 
                data={{
                  labels: ['Available', 'Reserved', 'Sold'],
                  datasets: [
                    {
                      data: [availableCount, reservedCount, soldCount],
                      backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                      ],
                      borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Current Vehicle Status',
                    },
                  },
                }} 
              />
            </div>
          </div>

          <div className="grid text-black grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Popular Brands</h3>
              <Bar 
                data={{
                  labels: popularBrands.map(brand => brand[0]),
                  datasets: [
                    {
                      label: 'Count',
                      data: popularBrands.map(brand => brand[1]),
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                    },
                  ],
                }} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Top 5 Vehicle Brands',
                    },
                  },
                }} 
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Price Trend</h3>
              <Line 
                data={priceTrendData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: `Average Price Trend (Last ${timeRange})`,
                    },
                  },
                }} 
              />
            </div>
          </div>

          {/* Recent Vehicles Table */}
          <div className="mt-8 text-black">
            <h2 className="text-xl font-semibold mb-4">Recent Vehicle Additions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...vehicles]
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .slice(0, 5)
                    .map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.brand || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.model || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ksh {vehicle.price?.toLocaleString() || '0'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {vehicle.status === 'available' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Available
                            </span>
                          ) : vehicle.status === 'reserved' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Reserved
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Sold
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(vehicle.createdAt).toLocaleDateString()}
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