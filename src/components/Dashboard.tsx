'use client';

import { Email, EmailStats } from '@/types/email';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, Paperclip, TrendingUp, Users, Clock, Settings } from 'lucide-react';
import { useState } from 'react';
import ChannelStatsPanel from './ChannelStatsPanel';

interface DashboardProps {
  emails: Email[];
  stats: EmailStats;
}

export default function Dashboard({ emails, stats }: DashboardProps) {
  const [outOfHoursStart, setOutOfHoursStart] = useState('17:00');
  const [outOfHoursEnd, setOutOfHoursEnd] = useState('07:00');
  const [showTimeSettings, setShowTimeSettings] = useState(false);

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

  const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => {
    const count = outOfHoursEmails.filter(email => {
      const emailHour = new Date(email.receivedDateTime).getHours();
      return emailHour === hour;
    }).length;
    
    return {
      hour: hour.toString().padStart(2, '0') + ':00',
      count,
      isOutOfHours: isOutOfHours(`2024-01-01T${hour.toString().padStart(2, '0')}:00:00`)
    };
  });

  const dailyVolumeData = stats.dailyVolume.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-GB', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }),
    emails: item.count
  }));


  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Emails</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmails}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Paperclip className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">With Attachments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.attachmentCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.supplierDistribution).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Daily</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(stats.totalEmails / Math.max(stats.dailyVolume.length, 1))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Out of Hours Email Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Out of Hours Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Out of Hours Email Analysis</h3>
            <button
              onClick={() => setShowTimeSettings(!showTimeSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
          
          {showTimeSettings && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Out of Hours Start
                  </label>
                  <input
                    type="time"
                    value={outOfHoursStart}
                    onChange={(e) => setOutOfHoursStart(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Out of Hours End
                  </label>
                  <input
                    type="time"
                    value={outOfHoursEnd}
                    onChange={(e) => setOutOfHoursEnd(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>
        </div>

        {/* Hourly Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hourly Email Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="count" 
                fill="#3B82F6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Volume Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Email Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyVolumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="emails" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Out of Hours Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Out of Hours Email Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{outOfHoursEmails.length}</div>
            <div className="text-sm text-gray-600">Total Out of Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {outOfHoursEmails.length > 0 ? Math.round((outOfHoursEmails.length / stats.totalEmails) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Percentage of Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {outOfHoursEmails.length > 0 ? Math.round(outOfHoursEmails.length / Math.max(stats.dailyVolume.length, 1)) : 0}
            </div>
            <div className="text-sm text-gray-600">Average per Day</div>
          </div>
        </div>
      </div>

      {/* Channel Statistics Panel */}
      <ChannelStatsPanel emails={emails} />
    </div>
  );
}