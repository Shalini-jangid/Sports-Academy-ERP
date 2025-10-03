// src/pages/coach/MarkAttendance.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Table from '../../components/common/Table';
import Badge from '../../components/ui/Badge';
import { userAPI, attendanceAPI } from '../../services/api';
import { UserCheck, Calendar, ArrowLeft, Save, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoachMarkAttendance = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState('training');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      fetchExistingAttendance();
    }
  }, [selectedDate, sessionType]);

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

  const fetchExistingAttendance = async () => {
    try {
      const response = await attendanceAPI.getSportAttendance({
        date: selectedDate,
        sport: 'basketball' // This would come from coach's profile
      });
      
      const attendanceMap = {};
      response.data.data.forEach(item => {
        if (item.attendance) {
          attendanceMap[item.student._id] = item.attendance.status;
        }
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Failed to fetch existing attendance:', error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        date: selectedDate,
        type: sessionType,
        status,
        notes: ''
      }));

      // Save each attendance record
      for (const record of attendanceRecords) {
        await attendanceAPI.markAttendance(record);
      }

      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Failed to save attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const headers = ['Student', 'Class', 'Enrollment ID', 'Attendance Status', 'Actions'];

  const renderRow = (student) => (
    <tr key={student._id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.sport}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {student.class}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {student.enrollmentId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {attendance[student._id] && (
          <Badge variant={
            attendance[student._id] === 'present' ? 'success' :
            attendance[student._id] === 'absent' ? 'error' : 'info'
          }>
            {attendance[student._id]}
          </Badge>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => handleAttendanceChange(student._id, 'present')}
          className={`px-3 py-1 text-xs rounded ${
            attendance[student._id] === 'present' 
              ? 'bg-success-100 text-success-800 border border-success-200' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Present
        </button>
        <button
          onClick={() => handleAttendanceChange(student._id, 'absent')}
          className={`px-3 py-1 text-xs rounded ${
            attendance[student._id] === 'absent' 
              ? 'bg-error-100 text-error-800 border border-error-200' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Absent
        </button>
        <button
          onClick={() => handleAttendanceChange(student._id, 'leave')}
          className={`px-3 py-1 text-xs rounded ${
            attendance[student._id] === 'leave' 
              ? 'bg-primary-100 text-primary-800 border border-primary-200' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          On Leave
        </button>
      </td>
    </tr>
  );

  const presentCount = Object.values(attendance).filter(status => status === 'present').length;
  const absentCount = Object.values(attendance).filter(status => status === 'absent').length;
  const leaveCount = Object.values(attendance).filter(status => status === 'leave').length;

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
            <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
            <p className="text-gray-600 mt-2">
              Record attendance for training sessions and tournaments
            </p>
          </div>
          <button
            onClick={saveAttendance}
            disabled={saving || Object.keys(attendance).length === 0}
            className="btn btn-primary flex items-center"
          >
            {saving ? (
              <div className="loading-spinner h-4 w-4 mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>

        {/* Attendance Controls */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Type
              </label>
              <select
                className="input"
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
              >
                <option value="training">Training</option>
                <option value="tournament">Tournament</option>
              </select>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{students.length}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-success-600">{presentCount}</div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-error-600">{absentCount}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{leaveCount}</div>
            <div className="text-sm text-gray-600">On Leave</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>

        {/* Students Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Student Roster</h2>
            </div>
            <div className="text-sm text-gray-600">
              {students.length} student(s)
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
      </div>
    </DashboardLayout>
  );
};

export default CoachMarkAttendance;