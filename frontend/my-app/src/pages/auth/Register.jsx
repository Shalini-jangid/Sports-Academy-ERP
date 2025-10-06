// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, User, Mail, Phone, Book, Trophy, IdCard, Users } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    class: '',
    sport: '',
    enrollmentId: '',
    linkedStudent: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Remove empty fields
    const submitData = { ...formData };
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === '') {
        delete submitData[key];
      }
    });

    const result = await register(submitData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Trophy  className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-sky-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Sports Academy ERP System
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-error-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-error-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-error-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-sky-900">
                  Full Name *
                </label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="input pl-10"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-sky-900">
                  Email Address *
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input pl-10"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-sky-900">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  className="input"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-sky-900">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="input"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-sky-900">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="input pl-10"
                    placeholder="Phone number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Role-specific Fields */}
            <div className="space-y-4">
              {formData.role === 'student' && (
                <>
                  <div>
                    <label htmlFor="class" className="block text-sm font-medium text-sky-900">
                      Class *
                    </label>
                    <div className="mt-1 relative">
                      <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="class"
                        name="class"
                        type="text"
                        required
                        className="input pl-10"
                        placeholder="Class/Grade"
                        value={formData.class}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sport" className="block text-sm font-medium text-sky-900">
                      Sport *
                    </label>
                    <div className="mt-1 relative">
                      <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="sport"
                        name="sport"
                        type="text"
                        required
                        className="input pl-10"
                        placeholder="Sport"
                        value={formData.sport}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="enrollmentId" className="block text-sm font-medium text-sky-900">
                      Enrollment ID *
                    </label>
                    <div className="mt-1 relative">
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="enrollmentId"
                        name="enrollmentId"
                        type="text"
                        required
                        className="input pl-10"
                        placeholder="Enrollment ID"
                        value={formData.enrollmentId}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.role === 'parent' && (
                <div>
                  <label htmlFor="linkedStudent" className="block text-sm font-medium text-gray-700">
                    Linked Student ID *
                  </label>
                  <div className="mt-1 relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="linkedStudent"
                      name="linkedStudent"
                      type="text"
                      required
                      className="input pl-10"
                      placeholder="Student's Enrollment ID"
                      value={formData.linkedStudent}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {(formData.role === 'coach' || formData.role === 'admin') && (
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department/Sport *
                  </label>
                  <div className="mt-1 relative">
                    <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="department"
                      name="department"
                      type="text"
                      required
                      className="input pl-10"
                      placeholder="Department or Sport"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-400 w-full py-3"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;