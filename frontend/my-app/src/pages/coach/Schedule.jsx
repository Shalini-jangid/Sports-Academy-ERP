// src/pages/coach/Schedule.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import { scheduleAPI } from '../../services/api';
import { Calendar, Clock, MapPin, User, Plus, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoachSchedule = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    sport: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    location: ''
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await scheduleAPI.getSchedule();
      setSchedule(response.data.data);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = () => {
    setEditingSession(null);
    setFormData({
      sport: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      location: ''
    });
    setIsModalOpen(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setFormData({
      sport: session.sport,
      day: session.day,
      startTime: session.startTime,
      endTime: session.endTime,
      location: session.location
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) {
        // Update existing session
        await scheduleAPI.createSchedule(formData);
      } else {
        // Create new session
        await scheduleAPI.createSchedule(formData);
      }
      setIsModalOpen(false);
      fetchSchedule();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      // In real app, call API to delete
      console.log('Delete session:', sessionId);
      fetchSchedule();
    }
  };

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const scheduleByDay = daysOrder.map(day => ({
    day,
    sessions: schedule.filter(session => session.day === day)
  }));

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
            <h1 className="text-2xl font-bold text-gray-900">Training Schedule</h1>
            <p className="text-gray-600 mt-2">
              Manage your weekly training schedule and sessions
            </p>
          </div>
          <button
            onClick={handleAddSession}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </button>
        </div>

        {loading ? (
          <div className="card p-12">
            <div className="flex justify-center">
              <div className="loading-spinner h-8 w-8"></div>
            </div>
            <p className="text-center text-gray-600 mt-4">Loading schedule...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {scheduleByDay.map(({ day, sessions }) => (
              <div key={day} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{day}</h2>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    {sessions.length} session(s)
                  </span>
                </div>
                
                {sessions.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((session) => (
                      <div
                        key={session._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors relative"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">{session.sport}</h3>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditSession(session)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session._id)}
                              className="text-error-600 hover:text-error-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {session.startTime} - {session.endTime}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {session.location}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            Coach: {session.coach?.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No training sessions scheduled for {day}</p>
                    <button
                      onClick={handleAddSession}
                      className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Add a session
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Schedule Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {schedule.length}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-success-600">
              {new Set(schedule.map(s => s.day)).size}
            </div>
            <div className="text-sm text-gray-600">Days with Sessions</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-warning-600">
              {new Set(schedule.map(s => s.sport)).size}
            </div>
            <div className="text-sm text-gray-600">Sports Covered</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(schedule.map(s => s.location)).size}
            </div>
            <div className="text-sm text-gray-600">Locations</div>
          </div>
        </div>

        {/* Add/Edit Session Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingSession ? 'Edit Session' : 'Add New Session'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sport *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g., Basketball, Swimming"
                value={formData.sport}
                onChange={(e) => setFormData(prev => ({ ...prev, sport: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day *
              </label>
              <select
                required
                className="input"
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
              >
                {daysOrder.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  className="input"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="time"
                  required
                  className="input"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g., Main Ground, Pool Area, Gymnasium"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
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
                {editingSession ? 'Update Session' : 'Add Session'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default CoachSchedule;