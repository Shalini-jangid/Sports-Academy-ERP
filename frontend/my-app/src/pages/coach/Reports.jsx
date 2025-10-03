// src/pages/coach/Reports.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BarChart3, Download, Filter, Calendar, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoachReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  });

  // Mock report data
  const reportData = {
    attendance: {
      title: 'Attendance Report',
      description: 'Student attendance overview and trends',
      data: [
        { month: 'Jan', present: 85, absent: 10, leave: 5 },
        { month: 'Feb', present: 88, absent: 8, leave: 4 },
        { month: 'Mar', present: 82, absent: 12, leave: 6 },
        { month: 'Apr', present: 90, absent: 6, leave: 4 },
        { month: 'May', present: 87, absent: 9, leave: 4 },
        { month: 'Jun', present: 85, absent: 10, leave: 5 }
      ]
    },
    performance: {
      title: 'Performance Report',
      description: 'Student performance metrics and progress',
      data: [
        { student: 'John Doe', attendance: 92, performance: 85, improvement: 12 },
        { student: 'Jane Smith', attendance: 88, performance: 92, improvement: 8 },
        { student: 'Mike Johnson', attendance: 95, performance: 78, improvement: 15 },
        { student: 'Sarah Wilson', attendance: 82, performance: 88, improvement: 10 },
        { student: 'Tom Brown', attendance: 90, performance: 85, improvement: 7 }
      ]
    },
    leaves: {
      title: 'Leave Analysis',
      description: 'Leave patterns and trends analysis',
      data: [
        { type: 'Medical Leave', count: 15, percentage: 40 },
        { type: 'Training Leave', count: 12, percentage: 32 },
        { type: 'Tournament Leave', count: 10, percentage: 28 }
      ]
    }
  };

  const generateReport = () => {
    // In real app, this would call an API to generate the report
    console.log('Generating report:', selectedReport, dateRange);
    alert(`Report generated for ${dateRange.startDate} to ${dateRange.endDate}`);
  };

  const exportReport = () => {
    // In real app, this would export the report
    alert('Report exported successfully!');
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
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">
              Generate and analyze reports for your sports program
            </p>
          </div>
          <button
            onClick={exportReport}
            className="btn btn-primary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>

        {/* Report Controls */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                className="input"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <option value="attendance">Attendance Report</option>
                <option value="performance">Performance Report</option>
                <option value="leaves">Leave Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="input"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="input"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={generateReport}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="flex justify-center">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">24</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="card p-6 text-center">
            <div className="flex justify-center">
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">87%</div>
            <div className="text-sm text-gray-600">Avg Attendance</div>
          </div>
          <div className="card p-6 text-center">
            <div className="flex justify-center">
              <Calendar className="h-8 w-8 text-warning-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-2">42</div>
            <div className="text-sm text-gray-600">Leave Requests</div>
          </div>
        </div>

        {/* Report Content */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">
                {reportData[selectedReport].title}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {dateRange.startDate} to {dateRange.endDate}
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {reportData[selectedReport].description}
          </p>

          {/* Report Visualization */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Report visualization would appear here</p>
              <p className="text-sm mt-2">
                In a real application, this would show charts and graphs based on the selected report data.
              </p>
            </div>
          </div>

          {/* Sample Data Table */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Data</h3>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedReport === 'attendance' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Present (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Absent (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          On Leave (%)
                        </th>
                      </>
                    )}
                    {selectedReport === 'performance' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Improvement
                        </th>
                      </>
                    )}
                    {selectedReport === 'leaves' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Leave Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData[selectedReport].data.map((item, index) => (
                    <tr key={index}>
                      {selectedReport === 'attendance' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.present}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.absent}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.leave}%
                          </td>
                        </>
                      )}
                      {selectedReport === 'performance' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.student}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.attendance}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.performance}/100
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            +{item.improvement}%
                          </td>
                        </>
                      )}
                      {selectedReport === 'leaves' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.percentage}%
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Additional Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Student Roster</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Export complete student list with contact information
                </p>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Monthly Attendance</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Generate attendance report for the current month
                </p>
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report History</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Q1 2024 Attendance</p>
                  <p className="text-sm text-gray-600">Generated on Apr 1, 2024</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Annual Performance</p>
                  <p className="text-sm text-gray-600">Generated on Jan 15, 2024</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachReports;