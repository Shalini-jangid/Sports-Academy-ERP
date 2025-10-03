// src/pages/admin/StaffManagement.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/common/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/common/Modal';
import { userAPI } from '../../services/api';
import { Users, Plus, Edit, Trash2, Shield, UserCheck, ArrowLeft, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffManagement = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'coach',
    department: '',
    sport: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await userAPI.getStaff();
      setStaff(response.data.data);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'coach',
      department: '',
      sport: ''
    });
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone || '',
      role: staffMember.role,
      department: staffMember.department || '',
      sport: staffMember.sport || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, this would call an API to add/update staff
    console.log('Staff data:', formData);
    setIsModalOpen(false);
    // Refresh the list
    fetchStaff();
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      // In a real app, this would call an API to delete staff
      console.log('Delete staff:', staffId);
      fetchStaff();
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      coach: { variant: 'info', label: 'Coach' },
      admin: { variant: 'success', label: 'Admin' }
    };
    
    const config = roleConfig[role] || { variant: 'default', label: role };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const headers = ['Name', 'Email', 'Phone', 'Role', 'Department/Sport', 'Actions'];

  const renderRow = (staffMember) => (
    <tr key={staffMember._id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-primary-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-1 text-gray-400" />
          {staffMember.email}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {staffMember.phone ? (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-1 text-gray-400" />
            {staffMember.phone}
          </div>
        ) : (
          '-'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getRoleBadge(staffMember.role)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {staffMember.department || staffMember.sport || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => handleEditStaff(staffMember)}
          className="text-primary-600 hover:text-primary-900"
        >
          <Edit className="h-4 w-4 inline" />
        </button>
        <button
          onClick={() => handleDeleteStaff(staffMember._id)}
          className="text-error-600 hover:text-error-900"
        >
          <Trash2 className="h-4 w-4 inline" />
        </button>
      </td>
    </tr>
  );

  const stats = {
    total: staff.length,
    coaches: staff.filter(s => s.role === 'coach').length,
    admins: staff.filter(s => s.role === 'admin').length
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
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-2">
              Manage coaching staff and administrators
            </p>
          </div>
          <button
            onClick={handleAddStaff}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.coaches}</div>
            <div className="text-sm text-gray-600">Coaches</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-success-600">{stats.admins}</div>
            <div className="text-sm text-gray-600">Administrators</div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Staff Members</h2>
            </div>
            <div className="text-sm text-gray-600">
              {staff.length} staff member(s) found
            </div>
          </div>
          
          <Table
            headers={headers}
            data={staff}
            loading={loading}
            emptyMessage="No staff members found"
            renderRow={renderRow}
          />
        </div>

        {/* Add/Edit Staff Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="input"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                required
                className="input"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="coach">Coach</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department/Sport *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g., Basketball, Swimming, Administration"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingStaff ? 'Update Staff' : 'Add Staff'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default StaffManagement;