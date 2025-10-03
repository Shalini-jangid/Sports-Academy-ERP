// src/pages/parent/Leaves.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/common/Table';
import Badge from '../../components/ui/Badge';
import { leaveAPI } from '../../services/api';
import { format } from 'date-fns';
import { Calendar, FileText, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParentLeaves = () => {
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

  const getStatusIcon = (status) => {
    const icons = {
      approved: CheckCircle,
      rejected: XCircle,
      pending: Clock
    };
    const Icon = icons[status];
    return Icon ? <Icon className="h-4 w-4 mr-1" /> : null;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'error', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || { variant: 'default', label: status };
    return (
      <Badge variant={config.variant}>
        {getStatusIcon(status)}
        {config.label}
      </Badge>
    );
  };

  const headers = ['Leave Type', 'Date Range', 'Duration', 'Reason', 'Status', 'Applied On', 'Action'];

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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {leave.attachment && (
          <a
            href={`http://localhost:5000/${leave.attachment}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-900"
          >
            View Attachment
          </a>
        )}
      </td>
    </tr>
  );

  const stats = {
    total: leaves.length,
    approved: leaves.filter(l => l.status === 'approved').length,
    pending: leaves.filter(l => l.status === 'pending').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/parent')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Leave Applications</h1>
          <p className="text-gray-600 mt-2">
            Monitor your child's leave applications and their status
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-success-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-error-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Leave History Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Leave Applications</h2>
            </div>
            <div className="text-sm text-gray-600">
              {leaves.length} application(s) found
            </div>
          </div>
          
          <Table
            headers={headers}
            data={leaves}
            loading={loading}
            emptyMessage="No leave applications found"
            renderRow={renderRow}
          />
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {leaves.slice(0, 3).map((leave) => (
              <div key={leave._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{leave.type}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <Badge variant={
                  leave.status === 'approved' ? 'success' :
                  leave.status === 'rejected' ? 'error' : 'warning'
                }>
                  {leave.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentLeaves;