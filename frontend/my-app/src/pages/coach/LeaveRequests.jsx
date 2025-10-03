// src/pages/coach/LeaveRequests.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/common/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/common/Modal';
import { leaveAPI } from '../../services/api';
import { format } from 'date-fns';
import { Calendar, ArrowLeft, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoachLeaveRequests = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getAllLeaves();
      setLeaves(response.data.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    setActionLoading(leaveId);
    try {
      await leaveAPI.updateLeaveStatus(leaveId, status);
      await fetchLeaves(); // Refresh the list
    } catch (error) {
      console.error('Failed to update leave status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const viewLeaveDetails = (leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
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

  const headers = ['Student', 'Leave Type', 'Date Range', 'Duration', 'Status', 'Applied On', 'Actions'];

  const renderRow = (leave) => (
    <tr key={leave._id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {leave.student?.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {leave.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(leave.startDate), 'MMM dd, yyyy')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(leave.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(leave.createdAt), 'MMM dd, yyyy')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => viewLeaveDetails(leave)}
          className="text-primary-600 hover:text-primary-900"
        >
          <Eye className="h-4 w-4 inline" />
        </button>
        {leave.status === 'pending' && (
          <>
            <button
              onClick={() => handleStatusUpdate(leave._id, 'approved')}
              disabled={actionLoading === leave._id}
              className="text-success-600 hover:text-success-900 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4 inline" />
            </button>
            <button
              onClick={() => handleStatusUpdate(leave._id, 'rejected')}
              disabled={actionLoading === leave._id}
              className="text-error-600 hover:text-error-900 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4 inline" />
            </button>
          </>
        )}
      </td>
    </tr>
  );

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/coach')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
            <p className="text-gray-600 mt-2">
              Manage and approve student leave applications
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-warning-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-success-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-error-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
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

        {/* Leave Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Leave Application Details"
          size="lg"
        >
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Student</label>
                  <p className="text-sm text-gray-900">{selectedLeave.student?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Leave Type</label>
                  <p className="text-sm text-gray-900">{selectedLeave.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <p className="text-sm text-gray-900">
                    {format(new Date(selectedLeave.startDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <p className="text-sm text-gray-900">
                    {format(new Date(selectedLeave.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-sm text-gray-900">
                    {Math.ceil((new Date(selectedLeave.endDate) - new Date(selectedLeave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedLeave.status)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Reason</label>
                <p className="text-sm text-gray-900 mt-1">{selectedLeave.reason}</p>
              </div>

              {selectedLeave.attachment && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Attachment</label>
                  <a
                    href={`http://localhost:5000/${selectedLeave.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-900 text-sm"
                  >
                    View Attachment
                  </a>
                </div>
              )}

              {selectedLeave.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => handleStatusUpdate(selectedLeave._id, 'rejected')}
                    disabled={actionLoading === selectedLeave._id}
                    className="btn btn-error"
                  >
                    {actionLoading === selectedLeave._id ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedLeave._id, 'approved')}
                    disabled={actionLoading === selectedLeave._id}
                    className="btn btn-success"
                  >
                    {actionLoading === selectedLeave._id ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default CoachLeaveRequests;