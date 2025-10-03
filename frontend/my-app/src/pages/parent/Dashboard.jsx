// src/pages/parent/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/ui/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { attendanceAPI, leaveAPI } from '../../services/api';
import { UserCheck, Calendar, AlertTriangle, TrendingUp, Bell } from 'lucide-react';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes, leavesRes] = await Promise.all([
        attendanceAPI.getMyAttendance(),
        leaveAPI.getMyLeaves()
      ]);
      
      setAttendance(attendanceRes.data.data.summary);
      setLeaves(leavesRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Attendance Rate',
      value: `${attendance.attendancePercentage || 0}%`,
      icon: UserCheck,
      description: 'Overall attendance'
    },
    {
      title: 'Present Sessions',
      value: attendance.presentSessions || 0,
      icon: TrendingUp,
      description: 'This month'
    },
    {
      title: 'Leave Applications',
      value: leaves.length,
      icon: Calendar,
      description: 'Total applications'
    },
    {
      title: 'Absent Sessions',
      value: attendance.absentSessions || 0,
      icon: AlertTriangle,
      description: 'Needs attention'
    }
  ];

  const recentLeaves = leaves.slice(0, 5);
  const pendingLeaves = leaves.filter(leave => leave.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Parent Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitoring your child's sports academy activities and progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leave Requests */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Leave Requests
              </h2>
              <Bell className="h-5 w-5 text-warning-500" />
            </div>
            
            {pendingLeaves.length > 0 ? (
              <div className="space-y-3">
                {pendingLeaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="p-3 border border-warning-200 bg-warning-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{leave.type}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-warning-100 text-warning-800 rounded-full">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{leave.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending leave requests</p>
              </div>
            )}
          </div>

          {/* Recent Leave History */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Leave History
            </h2>
            
            {recentLeaves.length > 0 ? (
              <div className="space-y-3">
                {recentLeaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{leave.type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(leave.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      leave.status === 'approved' 
                        ? 'bg-success-100 text-success-800'
                        : leave.status === 'rejected'
                        ? 'bg-error-100 text-error-800'
                        : 'bg-warning-100 text-warning-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No leave history available</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Overview */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <UserCheck className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-600">
                {attendance.presentSessions || 0}
              </div>
              <div className="text-sm text-gray-600">Present Sessions</div>
            </div>
            
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-success-600">
                {attendance.attendancePercentage || 0}%
              </div>
              <div className="text-sm text-gray-600">Attendance Rate</div>
            </div>
            
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <Calendar className="h-8 w-8 text-warning-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-warning-600">
                {leaves.length}
              </div>
              <div className="text-sm text-gray-600">Total Leaves</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;