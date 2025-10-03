// src/pages/student/Attendance.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/common/Table';
import Badge from '../../components/ui/Badge';
import { attendanceAPI } from '../../services/api';
import { format, subDays } from 'date-fns';
import { UserCheck, Calendar, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchAttendance();
  }, [dateRange]);

  const fetchAttendance = async () => {
    try {
      const response = await attendanceAPI.getMyAttendance(dateRange);
      setAttendance(response.data.data.attendance);
      setSummary(response.data.data.summary);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      present: { variant: 'success', label: 'Present' },
      absent: { variant: 'error', label: 'Absent' },
      leave: { variant: 'info', label: 'On Leave' }
    };
    
    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const headers = ['Date', 'Session Type', 'Status', 'Marked By', 'Notes'];

  const renderRow = (record) => (
    <tr key={record._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {format(new Date(record.date), 'MMM dd, yyyy')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
        {record.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(record.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {record.markedBy?.name || 'System'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
        {record.notes || '-'}
      </td>
    </tr>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/student')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600 mt-2">
            Track your training and tournament attendance
          </p>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalSessions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-2xl font-bold text-gray-900">{summary.presentSessions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-gray-900">{summary.leaveSessions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-50 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">%</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.attendancePercentage || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Attendance Records</h2>
            <div className="flex space-x-4">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="input"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card p-6">
          <Table
            headers={headers}
            data={attendance}
            loading={loading}
            emptyMessage="No attendance records found for the selected period"
            renderRow={renderRow}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;