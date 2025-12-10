"use client";
import React from "react";
import {
  FaHotel,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaEye,
} from "react-icons/fa";

const AdminDashboard = () => {
  // Sample stats data
  const stats = [
    {
      title: "Total Bookings",
      value: "1,234",
      change: "+12.5%",
      isPositive: true,
      icon: <FaCalendarAlt />,
      color: "primary",
    },
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+8.2%",
      isPositive: true,
      icon: <FaDollarSign />,
      color: "success",
    },
    {
      title: "Active Users",
      value: "856",
      change: "+5.7%",
      isPositive: true,
      icon: <FaUsers />,
      color: "info",
    },
    {
      title: "Total Listings",
      value: "142",
      change: "-2.3%",
      isPositive: false,
      icon: <FaHotel />,
      color: "warning",
    },
  ];

  // Sample recent bookings
  const recentBookings = [
    {
      id: 1,
      customer: "John Doe",
      hotel: "Hotel Paradise",
      date: "2025-11-10",
      amount: "$450",
      status: "Confirmed",
    },
    {
      id: 2,
      customer: "Jane Smith",
      hotel: "Beach Resort",
      date: "2025-11-12",
      amount: "$680",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      hotel: "Mountain Lodge",
      date: "2025-11-15",
      amount: "$320",
      status: "Confirmed",
    },
    {
      id: 4,
      customer: "Sarah Williams",
      hotel: "City Center Hotel",
      date: "2025-11-18",
      amount: "$550",
      status: "Confirmed",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-neutral-500 font-medium">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-neutral-800 mt-2">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-2 mt-3">
                  {stat.isPositive ? (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <FaArrowUp size={12} />
                      <span>{stat.change}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <FaArrowDown size={12} />
                      <span>{stat.change}</span>
                    </div>
                  )}
                  <span className="text-xs text-neutral-400">
                    vs last month
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "primary"
                    ? "bg-primary-100 text-primary-600"
                    : stat.color === "success"
                    ? "bg-green-100 text-green-600"
                    : stat.color === "info"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">
              Recent Bookings
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Latest reservations from customers
            </p>
          </div>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2">
            <FaEye />
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {booking.customer.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-neutral-800">
                        {booking.customer}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-700">
                      {booking.hotel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-700">
                      {booking.date}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-neutral-800">
                      {booking.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:border-primary-500 hover:shadow-lg transition-all text-left group">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
            <FaHotel className="text-primary-600 text-xl group-hover:text-white" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800">
            Add New Listing
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Create a new hotel or property listing
          </p>
        </button>

        <button className="bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:border-primary-500 hover:shadow-lg transition-all text-left group">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
            <FaCalendarAlt className="text-green-600 text-xl group-hover:text-white" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800">
            Manage Bookings
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            View and manage all reservations
          </p>
        </button>

        <button className="bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:border-primary-500 hover:shadow-lg transition-all text-left group">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
            <FaUsers className="text-blue-600 text-xl group-hover:text-white" />
          </div>
          <h3 className="text-lg font-bold text-neutral-800">
            User Management
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            Manage users and permissions
          </p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
