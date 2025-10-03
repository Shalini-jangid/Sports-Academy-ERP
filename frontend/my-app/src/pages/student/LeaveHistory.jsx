// src/pages/student/LeaveHistory.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/common/Table';
import Badge from '../../components/ui/Badge';
import { leaveAPI } from '../../services/api';
import { format } from 'date-fns';
import { Calendar, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeaveHistory = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getMyLeaves();
      setLeaves(response.data.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'error', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const headers = ['Leave Type', 'Date Range', 'Duration', 'Reason', 'Status', 'Applied On'];

  const renderRow = (leave) => (
    <tr key={leave._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {leave.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(leave.startDate), 'MMM dd, yyyy')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {leave.reason}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(leave.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(leave.createdAt), 'MMM dd, yyyy')}
      </td>
    </tr>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/student')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Leave History</h1>
            <p className="text-gray-600 mt-2">
              View your leave applications and their status
            </p>
          </div>
          <button
            onClick={() => navigate('/student/leave')}
            className="btn btn-primary"
          >
            Apply for Leave
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{leaves.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-success-600">
              {leaves.filter(l => l.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-warning-600">
              {leaves.filter(l => l.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-error-600">
              {leaves.filter(l => l.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Leave History Table */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Leave Applications</h2>
          </div>
          
          <Table
            headers={headers}
            data={leaves}
            loading={loading}
            emptyMessage="No leave applications found"
            renderRow={renderRow}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaveHistory;