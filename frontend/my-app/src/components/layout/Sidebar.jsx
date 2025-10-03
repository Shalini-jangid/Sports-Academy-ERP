// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Calendar,
  Users,
  BarChart3,
  Settings,
  UserCheck,
  FileText,
  Clock
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const studentMenu = [
    { name: 'Dashboard', href: '/student', icon: Home },
    { name: 'Apply Leave', href: '/student/leave', icon: Calendar },
    { name: 'Leave History', href: '/student/leaves', icon: FileText },
    { name: 'My Attendance', href: '/student/attendance', icon: UserCheck },
    { name: 'Schedule', href: '/student/schedule', icon: Clock },
  ];

  const parentMenu = [
    { name: 'Dashboard', href: '/parent', icon: Home },
    { name: "Child's Attendance", href: '/parent/attendance', icon: UserCheck },
    { name: 'Leave Status', href: '/parent/leaves', icon: FileText },
  ];

  const coachMenu = [
    { name: 'Dashboard', href: '/coach', icon: Home },
    { name: 'Leave Requests', href: '/coach/leaves', icon: Calendar },
    { name: 'Mark Attendance', href: '/coach/attendance', icon: UserCheck },
    { name: 'Students', href: '/coach/students', icon: Users },
    { name: 'Schedule', href: '/coach/schedule', icon: Clock },
    { name: 'Reports', href: '/coach/reports', icon: BarChart3 },
  ];

  const adminMenu = [
    ...coachMenu,
    { name: 'Staff Management', href: '/admin/staff', icon: Users },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'student': return studentMenu;
      case 'parent': return parentMenu;
      case 'coach': return coachMenu;
      case 'admin': return adminMenu;
      default: return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="h-full flex flex-col">
          <div className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
          
          {/* User info */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;