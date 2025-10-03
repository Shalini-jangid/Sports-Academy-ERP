// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/ui/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { userAPI, leaveAPI } from '../../services/api';
import { Users, UserCheck, Calendar, Settings, TrendingUp, AlertTriangle, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    pendingLeaves: 0,
    activeCoaches: 0,
    attendanceRate: 0,
    systemHealth: 100
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, staffRes, leavesRes] = await Promise.all([
        userAPI.getStudents(),
        userAPI.getStaff(),
        leaveAPI.getAllLeaves({ status: 'pending' })
      ]);

      const students = studentsRes.data.data;
      const staff = staffRes.data.data;
      const pendingLeaves = leavesRes.data.data;

      const coaches = staff.filter(s => s.role === 'coach');

      setStats({
        totalStudents: students.length,
        totalStaff: staff.length,
        pendingLeaves: pendingLeaves.length,
        activeCoaches: coaches.length,
        attendanceRate: 85, // This would come from backend in real app
        systemHealth: 100
      });

      // Mock recent activities
      setRecentActivities([
        {
          id: 1,
          type: 'user',
          title: 'New Student Registered',
          description: 'John Doe joined Basketball program',
          time: '2 hours ago',
          status: 'info'
        },
        {
          id: 2,
          type: 'leave',
          title: 'Leave Request Approved',
          description: 'Medical leave for Sarah Wilson',
          time: '4 hours ago',
          status: 'success'
        },
        {
          id: 3,
          type: 'system',
          title: 'System Backup Completed',
          description: 'Nightly backup completed successfully',
          time: '6 hours ago',
          status: 'success'
        },
        {
          id: 4,
          type: 'attendance',
          title: 'Attendance Report Generated',
          description: 'Weekly report sent to all coaches',
          time: '1 day ago',
          status: 'info'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      description: 'Across all sports',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Staff Members',
      value: stats.totalStaff,
      icon: UserCheck,
      description: 'Coaches & Admins',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      description: 'Need approval',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Active Coaches',
      value: stats.activeCoaches,
      icon: Shield,
      description: 'Currently active',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Attendance',
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      description: 'Overall rate',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'System Health',
      value: `${stats.systemHealth}%`,
      icon: Settings,
      description: 'All systems operational',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Staff',
      description: 'Add or manage coaching staff',
      icon: Users,
      link: '/admin/staff',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'System Settings',
      description: 'Configure academy settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-50 text-gray-600'
    },
    {
      title: 'View Reports',
      description: 'Generate system reports',
      icon: TrendingUp,
      link: '/coach/reports',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Leave Management',
      description: 'Approve pending requests',
      link: '/coach/leaves',
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.name}. Manage the entire sports academy system.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-5 w-5" />
              <span>System Administrator</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.link}
                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center"
                  >
                    <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent System Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100"
                >
                  <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success-500' : 
                    activity.status === 'info' ? 'bg-primary-500' : 'bg-warning-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.totalStudents}</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{stats.totalStaff}</div>
              <div className="text-sm text-gray-600">Staff Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">{stats.pendingLeaves}</div>
              <div className="text-sm text-gray-600">Pending Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.systemHealth}%</div>
              <div className="text-sm text-gray-600">System Status</div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {stats.pendingLeaves > 0 && (
          <div className="card p-6 border-l-4 border-l-warning-400">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Attention Required</h3>
            </div>
            <p className="text-gray-600 mt-2">
              You have {stats.pendingLeaves} pending leave requests that need approval.
            </p>
            <a
              href="/coach/leaves"
              className="inline-flex items-center mt-3 text-primary-600 hover:text-primary-700"
            >
              Review requests
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;