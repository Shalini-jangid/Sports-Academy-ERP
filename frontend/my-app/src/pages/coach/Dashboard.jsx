// src/pages/coach/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/ui/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { userAPI, leaveAPI, attendanceAPI } from '../../services/api';
import { Users, Calendar, UserCheck, AlertTriangle, Bell, TrendingUp } from 'lucide-react';

const CoachDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    pendingLeaves: 0,
    todayAttendance: 0,
    attendanceRate: 0
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, leavesRes, attendanceRes] = await Promise.all([
        userAPI.getStudents(),
        leaveAPI.getAllLeaves({ status: 'pending' }),
        attendanceAPI.getSportAttendance({ date: new Date().toISOString().split('T')[0] })
      ]);

      const students = studentsRes.data.data;
      const pendingLeaves = leavesRes.data.data;
      const todayAttendance = attendanceRes.data.data;

      const presentCount = todayAttendance.filter(a => a.attendance?.status === 'present').length;
      const attendanceRate = students.length > 0 ? (presentCount / students.length) * 100 : 0;

      setStats({
        students: students.length,
        pendingLeaves: pendingLeaves.length,
        todayAttendance: presentCount,
        attendanceRate: Math.round(attendanceRate)
      });

      setRecentLeaves(pendingLeaves.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: 'Total Students',
      value: stats.students,
      icon: Users,
      description: 'In your sport'
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      description: 'Need approval'
    },
    {
      title: "Today's Attendance",
      value: `${stats.todayAttendance}/${stats.students}`,
      icon: UserCheck,
      description: 'Present students'
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      description: 'Overall'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Coach Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, Coach {user?.name}. Manage your team and track performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
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
            
            {recentLeaves.length > 0 ? (
              <div className="space-y-3">
                {recentLeaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="p-3 border border-warning-200 bg-warning-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {leave.student?.name}
                        </p>
                        <p className="text-sm text-gray-600">{leave.type}</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-warning-100 text-warning-800 rounded-full">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending leave requests</p>
              </div>
            )}
            
            {stats.pendingLeaves > 5 && (
              <div className="mt-4 text-center">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all {stats.pendingLeaves} pending requests
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Mark Attendance</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Record today's attendance
                </p>
              </button>
              
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Leaves</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Review leave applications
                </p>
              </button>
              
              <button className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">View Students</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Manage student roster
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Important Alerts</h2>
          </div>
          <div className="space-y-2">
            {stats.pendingLeaves > 0 && (
              <div className="flex items-center p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning-600 mr-2" />
                <p className="text-sm text-warning-800">
                  You have {stats.pendingLeaves} pending leave requests waiting for approval.
                </p>
              </div>
            )}
            
            {stats.attendanceRate < 80 && (
              <div className="flex items-center p-3 bg-error-50 border border-error-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-error-600 mr-2" />
                <p className="text-sm text-error-800">
                  Team attendance rate is below 80%. Consider following up with absent students.
                </p>
              </div>
            )}
            
            {stats.attendanceRate >= 80 && (
              <div className="flex items-center p-3 bg-success-50 border border-success-200 rounded-lg">
                <TrendingUp className="h-4 w-4 text-success-600 mr-2" />
                <p className="text-sm text-success-800">
                  Great! Team attendance rate is {stats.attendanceRate}%. Keep up the good work!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachDashboard;