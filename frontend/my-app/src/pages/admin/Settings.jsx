// src/pages/admin/Settings.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Settings, Save, Bell, Shield, Mail, Database, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Academy Settings
    academyName: 'Sports Academy ERP',
    contactEmail: 'admin@sportsacademy.edu',
    contactPhone: '+1 (555) 123-4567',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    leaveApprovalAlerts: true,
    attendanceAlerts: true,
    
    // System Settings
    autoBackup: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    
    // Security Settings
    passwordPolicy: 'medium',
    twoFactorAuth: false,
    loginAttempts: 5
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    // In real app, this would save to backend
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const runSystemBackup = () => {
    // Simulate backup process
    alert('System backup started...');
  };

  const clearCache = () => {
    // Simulate cache clearing
    alert('Cache cleared successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-2">
              Configure academy-wide settings and preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary flex items-center"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <a href="#academy" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg">
                <Settings className="h-4 w-4 mr-3" />
                Academy Settings
              </a>
              <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </a>
              <a href="#security" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <Shield className="h-4 w-4 mr-3" />
                Security
              </a>
              <a href="#system" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <Database className="h-4 w-4 mr-3" />
                System
              </a>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academy Settings */}
            <div id="academy" className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Academy Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academy Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={settings.academyName}
                    onChange={(e) => handleInputChange('academy', 'academyName', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      className="input"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange('academy', 'contactEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      className="input"
                      value={settings.contactPhone}
                      onChange={(e) => handleInputChange('academy', 'contactPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div id="notifications" className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive important updates via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleCheckboxChange('emailNotifications')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      SMS Notifications
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive urgent alerts via SMS
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={() => handleCheckboxChange('smsNotifications')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Leave Approval Alerts
                    </label>
                    <p className="text-sm text-gray-500">
                      Notify when leave requests need approval
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.leaveApprovalAlerts}
                    onChange={() => handleCheckboxChange('leaveApprovalAlerts')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Attendance Alerts
                    </label>
                    <p className="text-sm text-gray-500">
                      Alert for unusual attendance patterns
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.attendanceAlerts}
                    onChange={() => handleCheckboxChange('attendanceAlerts')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div id="security" className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Policy
                  </label>
                  <select
                    className="input"
                    value={settings.passwordPolicy}
                    onChange={(e) => handleInputChange('security', 'passwordPolicy', e.target.value)}
                  >
                    <option value="low">Low (6+ characters)</option>
                    <option value="medium">Medium (8+ characters with mix)</option>
                    <option value="high">High (12+ characters with special chars)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Two-Factor Authentication
                    </label>
                    <p className="text-sm text-gray-500">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleCheckboxChange('twoFactorAuth')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Login Attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="input"
                    value={settings.loginAttempts}
                    onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div id="system" className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Automatic Backups
                    </label>
                    <p className="text-sm text-gray-500">
                      Automatically backup system data
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={() => handleCheckboxChange('autoBackup')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                {settings.autoBackup && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup Frequency
                    </label>
                    <select
                      className="input"
                      value={settings.backupFrequency}
                      onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    className="input"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('system', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    onClick={runSystemBackup}
                    className="btn btn-secondary flex items-center"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Run Backup Now
                  </button>
                  <button
                    onClick={clearCache}
                    className="btn btn-secondary flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;