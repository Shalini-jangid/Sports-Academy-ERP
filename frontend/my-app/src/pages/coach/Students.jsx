// src/pages/coach/Students.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/common/Table';
import { userAPI } from '../../services/api';
import { Users, Mail, Phone, Book, Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoachStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await userAPI.getStudents();
      setStudents(response.data.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const headers = ['Student', 'Contact', 'Class', 'Sport', 'Enrollment ID', 'Leave Balance'];

  const renderRow = (student) => (
    <tr key={student._id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Mail className="h-3 w-3 mr-1 text-gray-400" />
            {student.email}
          </div>
          {student.phone && (
            <div className="flex items-center mt-1">
              <Phone className="h-3 w-3 mr-1 text-gray-400" />
              {student.phone}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <Book className="h-4 w-4 mr-1 text-gray-400" />
          {student.class}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <Trophy className="h-4 w-4 mr-1 text-gray-400" />
          {student.sport}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {student.enrollmentId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          student.leaveBalance > 10 
            ? 'bg-success-100 text-success-800'
            : student.leaveBalance > 5
            ? 'bg-warning-100 text-warning-800'
            : 'bg-error-100 text-error-800'
        }`}>
          {student.leaveBalance} days
        </span>
      </td>
    </tr>
  );

  const sportStats = students.reduce((acc, student) => {
    acc[student.sport] = (acc[student.sport] || 0) + 1;
    return acc;
  }, {});

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
            <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-2">
              View and manage students in your sports program
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{students.length}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          {Object.entries(sportStats).map(([sport, count], index) => (
            <div key={sport} className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{count}</div>
              <div className="text-sm text-gray-600">{sport}</div>
            </div>
          ))}
        </div>

        {/* Students Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Student Roster</h2>
            </div>
            <div className="text-sm text-gray-600">
              {students.length} student(s) found
            </div>
          </div>
          
          <Table
            headers={headers}
            data={students}
            loading={loading}
            emptyMessage="No students found"
            renderRow={renderRow}
          />
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sport Distribution</h3>
            <div className="space-y-3">
              {Object.entries(sportStats).map(([sport, count]) => (
                <div key={sport} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{sport}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(count / students.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Export Student List</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Download student information as CSV
                </p>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Send Group Message</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Message all students in your program
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachStudents;