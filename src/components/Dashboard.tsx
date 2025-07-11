'use client';

import { Email, EmailStats } from '@/types/email';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { Mail, Paperclip, TrendingUp, Users, Clock, Settings, Activity, Globe, BarChart3, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import ChannelStatsPanel from './ChannelStatsPanel';

interface DashboardProps {
  emails: Email[];
  stats: EmailStats;
}

export default function Dashboard({ emails, stats }: DashboardProps) {
  // Dashboard component for email analytics and reporting
  const [outOfHoursStart, setOutOfHoursStart] = useState('17:00');
  const [outOfHoursEnd, setOutOfHoursEnd] = useState('07:00');
  const [showTimeSettings, setShowTimeSettings] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showOutOfHoursDetails, setShowOutOfHoursDetails] = useState(false);
  const [showDuplicatesDetails, setShowDuplicatesDetails] = useState(false);

  const isOutOfHours = (dateTime: string) => {
    const date = new Date(dateTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeValue = hours * 100 + minutes;
    
    const [startHour, startMin] = outOfHoursStart.split(':').map(Number);
    const [endHour, endMin] = outOfHoursEnd.split(':').map(Number);
    const startTime = startHour * 100 + startMin;
    const endTime = endHour * 100 + endMin;
    
    if (startTime > endTime) {
      return timeValue >= startTime || timeValue <= endTime;
    }
    return timeValue >= startTime && timeValue <= endTime;
  };

  const outOfHoursEmails = emails.filter(email => isOutOfHours(email.receivedDateTime));
  const businessHoursEmails = emails.filter(email => !isOutOfHours(email.receivedDateTime));

  // Calculate supplier email counts
  const supplierCounts = emails.reduce((acc, email) => {
    if (email.supplier) {
      acc[email.supplier] = (acc[email.supplier] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const supplierData = Object.entries(supplierCounts)
    .map(([supplier, count]) => ({ supplier, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 suppliers

  const outOfHoursData = [
    {
      name: 'Business Hours',
      value: businessHoursEmails.length,
      percentage: ((businessHoursEmails.length / stats.totalEmails) * 100).toFixed(1)
    },
    {
      name: 'Out of Hours',
      value: outOfHoursEmails.length,
      percentage: ((outOfHoursEmails.length / stats.totalEmails) * 100).toFixed(1)
    }
  ];

  const dailyVolumeData = stats.dailyVolume.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-GB', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }),
    emails: item.count
  }));

  const weeklyVolumeData = stats.weeklyVolume.map(item => ({
    week: item.week,
    emails: item.count
  }));

  const monthlyVolumeData = stats.monthlyVolume.map(item => ({
    month: item.month,
    emails: item.count
  }));

  const peakTimesData = stats.peakTimes.map(item => ({
    hour: `${item.hour.toString().padStart(2, '0')}:00`,
    count: item.count
  }));


  const getVolumeData = () => {
    switch (activeTimeRange) {
      case 'weekly':
        return weeklyVolumeData;
      case 'monthly':
        return monthlyVolumeData;
      default:
        return dailyVolumeData;
    }
  };

  const getVolumeDataKey = () => {
    switch (activeTimeRange) {
      case 'weekly':
        return 'week';
      case 'monthly':
        return 'month';
      default:
        return 'date';
    }
  };


  return (
    <div className="space-y-8">
      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Emails</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmails.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Paperclip className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">With Attachments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.attachmentCount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">
                  {((stats.attachmentCount / stats.totalEmails) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Suppliers</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.supplierDistribution).length}</p>
                <p className="text-xs text-gray-400">Active sources</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Daily</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.totalEmails / Math.max(stats.dailyVolume.length, 1))}
                </p>
                <p className="text-xs text-gray-400">Last 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Peak Hour</p>
                <p className="text-2xl font-bold text-gray-900">
                  {peakTimesData.reduce((max, curr) => curr.count > max.count ? curr : max, peakTimesData[0])?.hour || '00:00'}
                </p>
                <p className="text-xs text-gray-400">
                  {peakTimesData.reduce((max, curr) => curr.count > max.count ? curr : max, peakTimesData[0])?.count || 0} emails
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Internal Ratio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEmails > 0 ? ((stats.internalVsExternalRatio.internal / stats.totalEmails) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-400">
                  {stats.internalVsExternalRatio.internal} internal emails
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">External Ratio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEmails > 0 ? ((stats.internalVsExternalRatio.external / stats.totalEmails) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-400">
                  {stats.internalVsExternalRatio.external} external emails
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Trend</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyVolumeData[monthlyVolumeData.length - 1]?.emails || 0}
                  </p>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-400">This month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Times Heatmap - Full Width */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Peak Traffic Times</h3>
        </div>
        <div className="card-content">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={peakTimesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Out of Hours Email Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Out of Hours Overview */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Out of Hours Email Analysis</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTimeSettings(!showTimeSettings)}
                  className="btn btn-ghost btn-sm p-2"
                >
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowOutOfHoursDetails(!showOutOfHoursDetails)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <span className="text-sm">Details</span>
                  {showOutOfHoursDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="card-content">
            {showTimeSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Out of Hours Start
                  </label>
                  <input
                    type="time"
                    value={outOfHoursStart}
                    onChange={(e) => setOutOfHoursStart(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Out of Hours End
                  </label>
                  <input
                    type="time"
                    value={outOfHoursEnd}
                    onChange={(e) => setOutOfHoursEnd(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Hours</p>
                  <p className="text-xs text-gray-500">{outOfHoursEnd} - {outOfHoursStart}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{businessHoursEmails.length}</p>
                <p className="text-sm text-gray-600">{outOfHoursData[0].percentage}%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Out of Hours</p>
                  <p className="text-xs text-gray-500">{outOfHoursStart} - {outOfHoursEnd}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{outOfHoursEmails.length}</p>
                <p className="text-sm text-gray-600">{outOfHoursData[1].percentage}%</p>
              </div>
            </div>

            {showOutOfHoursDetails && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Channels That Arrived Out of Hours</h4>
                <div className="space-y-3">
                  {outOfHoursEmails.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {outOfHoursEmails.map((email, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{email.channel}</p>
                                <p className="text-xs text-gray-600">{email.supplier}</p>
                                <p className="text-xs text-gray-500 mt-1">{email.subject}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-medium text-gray-900">
                                  {new Date(email.receivedDateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(email.receivedDateTime).toLocaleDateString('en-GB')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No emails received out of hours</p>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-3">
                    Analysis based on current time settings: {outOfHoursStart} - {outOfHoursEnd}
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Supplier Email Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Supplier Email Distribution</h3>
          </div>
          <div className="card-content">
            {supplierData.length > 0 ? (
              <div className="space-y-3">
                {supplierData.map((supplier, index) => (
                  <div key={supplier.supplier} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{supplier.supplier}</p>
                        <p className="text-xs text-gray-500">
                          {((supplier.count / emails.length) * 100).toFixed(1)}% of total emails
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{supplier.count}</p>
                      <p className="text-xs text-gray-500">emails</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No supplier data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Volume Chart with Time Range Selector */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Email Volume Trends</h3>
            <div className="flex space-x-2">
              {(['daily', 'weekly', 'monthly'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveTimeRange(range)}
                  className={`btn btn-sm ${
                    activeTimeRange === range ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-content">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={getVolumeData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={getVolumeDataKey()} />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="emails"
                fill="#3b82f6"
                fillOpacity={0.1}
                stroke="#3b82f6"
              />
              <Bar dataKey="emails" fill="#3b82f6" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Seasonal Patterns</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.seasonalPatterns.map((pattern, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{pattern.quarter}</h4>
                  <div className="flex items-center space-x-1">
                    {pattern.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : pattern.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <div className="h-4 w-4 bg-gray-400 rounded-full" />
                    )}
                    <span className={`text-sm font-medium ${
                      pattern.trend === 'up' ? 'text-green-600' : 
                      pattern.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {pattern.trend}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {pattern.averageDaily}
                </p>
                <p className="text-sm text-gray-600">Avg daily emails</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Duplicates Analysis */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Duplicates Analysis</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDuplicatesDetails(!showDuplicatesDetails)}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
              >
                <span className="text-sm">Details</span>
                {showDuplicatesDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {emails.filter(email => email.subject.includes('DUPLICATE') || email.subject.includes('Re:')).length}
              </div>
              <div className="text-sm text-gray-600">Potential Duplicates</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {((emails.filter(email => email.subject.includes('DUPLICATE') || email.subject.includes('Re:')).length / emails.length) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Duplicate Rate</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {emails.filter(email => email.subject.includes('URGENT')).length}
              </div>
              <div className="text-sm text-gray-600">Urgent Duplicates</div>
            </div>
          </div>

          {showDuplicatesDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Duplicate Emails List</h4>
              <div className="space-y-3">
                {(() => {
                  const duplicateEmails = emails.filter(email => 
                    email.isDuplicate || 
                    email.subject.startsWith('Re:') || 
                    email.subject.includes('Fwd:') || 
                    email.subject.includes('FWD:')
                  );
                  
                  return duplicateEmails.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {duplicateEmails.map((email, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                                <p className="text-xs text-gray-600 mt-1">{email.from}</p>
                                <p className="text-xs text-gray-500">{email.channel} • {email.supplier}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-xs font-medium text-gray-900">
                                  {new Date(email.receivedDateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(email.receivedDateTime).toLocaleDateString('en-GB')}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                  {email.isDuplicate && (
                                    <span className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">Auto-Detected</span>
                                  )}
                                  {email.subject.startsWith('Re:') && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">Reply</span>
                                  )}
                                  {(email.subject.includes('Fwd:') || email.subject.includes('FWD:')) && (
                                    <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">Forward</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No duplicate emails detected</p>
                    </div>
                  );
                })()}
                <div className="text-xs text-gray-500 mt-3">
                  Duplicates are detected based on subject similarity and sender patterns. Use the &ldquo;Show Duplicates&rdquo; filter to view them.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Channel Statistics Panel */}
      <ChannelStatsPanel emails={emails} />
    </div>
  );
}