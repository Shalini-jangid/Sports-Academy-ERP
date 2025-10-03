// src/pages/student/Schedule.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { scheduleAPI } from '../../services/api';
import { Calendar, Clock, MapPin, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const scheduleByDay = daysOrder.map(day => ({
    day,
    sessions: schedule.filter(session => session.day === day)
  }));

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
          <h1 className="text-2xl font-bold text-gray-900">Training Schedule</h1>
          <p className="text-gray-600 mt-2">
            View your weekly training schedule and session details
          </p>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{day}</h2>
                
                {sessions.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((session) => (
                      <div
                        key={session._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">{session.sport}</h3>
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                            {session.coach?.name}
                          </span>
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {schedule.length}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-success-600">
              {new Set(schedule.map(s => s.coach?.name)).size}
            </div>
            <div className="text-sm text-gray-600">Coaches</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-2xl font-bold text-warning-600">
              {new Set(schedule.map(s => s.location)).size}
            </div>
            <div className="text-sm text-gray-600">Locations</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;