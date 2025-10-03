// src/pages/student/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/ui/StatsCard';
import { Calendar, UserCheck, Award, Clock, ArrowRight, Plus } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Leave Balance',
      value: user?.leaveBalance || 0,
      icon: Calendar,
      description: 'Days remaining'
    },
    {
      title: 'Training Sessions',
      value: '24',
      icon: Clock,
      description: 'This month'
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      icon: UserCheck,
      description: 'Overall'
    },
    {
      title: 'Achievements',
      value: '5',
      icon: Award,
      description: 'Badges earned'
    }
  ];

  const quickActions = [
    {
      title: 'Apply for Leave',
      description: 'Submit a new leave request',
      icon: Plus,
      link: '/student/leave',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'View Attendance',
      description: 'Check your attendance records',
      icon: UserCheck,
      link: '/student/attendance',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Leave History',
      description: 'View your leave applications',
      icon: Calendar,
      link: '/student/leaves',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'leave',
      title: 'Leave Application Approved',
      description: 'Your medical leave for Oct 15-16 has been approved',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Attendance Marked',
      description: 'You were marked present for morning training',
      time: '1 day ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'training',
      title: 'New Training Schedule',
      description: 'Updated schedule for next week is available',
      time: '2 days ago',
      status: 'info'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your training overview and recent activities. You have {user?.leaveBalance || 0} leave days remaining.
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
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activities
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

        {/* Today's Schedule */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Schedule
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Morning Training</p>
                  <p className="text-sm text-gray-600">6:00 AM - 8:00 AM</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Main Ground
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Theory Class</p>
                  <p className="text-sm text-gray-600">2:00 PM - 3:30 PM</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Classroom A
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;