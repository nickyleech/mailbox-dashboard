'use client';

import { useMemo, useState } from 'react';
import { Email } from '@/types/email';
import { supplierConfig } from '@/data/mockEmails';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface ChannelStatsPanelProps {
  emails: Email[];
}

interface ChannelStat {
  channel: string;
  supplier: string;
  count: number;
  percentage: number;
  lastReceived: string;
}

export default function ChannelStatsPanel({ emails }: ChannelStatsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'count' | 'name' | 'supplier'>('count');
  const [showTop, setShowTop] = useState(10);

  const channelStats = useMemo(() => {
    const stats: Record<string, ChannelStat> = {};
    
    emails.forEach(email => {
      if (!stats[email.channel]) {
        stats[email.channel] = {
          channel: email.channel,
          supplier: email.supplier,
          count: 0,
          percentage: 0,
          lastReceived: email.receivedDateTime
        };
      }
      
      stats[email.channel].count++;
      
      // Update last received if this email is more recent
      if (new Date(email.receivedDateTime) > new Date(stats[email.channel].lastReceived)) {
        stats[email.channel].lastReceived = email.receivedDateTime;
      }
    });

    // Calculate percentages
    Object.values(stats).forEach(stat => {
      stat.percentage = (stat.count / emails.length) * 100;
    });

    return Object.values(stats);
  }, [emails]);

  const filteredAndSortedStats = useMemo(() => {
    let filtered = channelStats;

    // Filter by search term
    if (searchTerm) {
      filtered = channelStats.filter(stat =>
        stat.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stat.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'count':
          return b.count - a.count;
        case 'name':
          return a.channel.localeCompare(b.channel);
        case 'supplier':
          return a.supplier.localeCompare(b.supplier) || b.count - a.count;
        default:
          return b.count - a.count;
      }
    });

    return filtered.slice(0, showTop);
  }, [channelStats, searchTerm, sortBy, showTop]);

  const totalChannels = channelStats.length;
  const topChannelCount = filteredAndSortedStats.reduce((sum, stat) => sum + stat.count, 0);
  const topChannelPercentage = emails.length > 0 ? (topChannelCount / emails.length) * 100 : 0;

  if (totalChannels === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Channel Distribution</h3>
          <p className="text-sm text-gray-500">
            {totalChannels} channel{totalChannels !== 1 ? 's' : ''} • Top {showTop} shown ({topChannelPercentage.toFixed(1)}% of emails)
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
        >
          <span className="text-sm">Details</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalChannels}</div>
          <div className="text-sm text-blue-800">Total Channels</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {filteredAndSortedStats[0]?.count || 0}
          </div>
          <div className="text-sm text-green-800">Most Active Channel</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(supplierConfig).length}
          </div>
          <div className="text-sm text-purple-800">Suppliers</div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search channels or suppliers..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'count' | 'name' | 'supplier')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="count">Sort by Count</option>
                <option value="name">Sort by Name</option>
                <option value="supplier">Sort by Supplier</option>
              </select>
              <select
                value={showTop}
                onChange={(e) => setShowTop(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>Top 10</option>
                <option value={25}>Top 25</option>
                <option value={50}>Top 50</option>
                <option value={100}>Top 100</option>
              </select>
            </div>
          </div>

          {/* Channel list */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAndSortedStats.map((stat) => (
              <div key={stat.channel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      supplierConfig[stat.supplier as keyof typeof supplierConfig]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {stat.supplier}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate" title={stat.channel}>
                      {stat.channel}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last received: {new Date(stat.lastReceived).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-semibold text-gray-900">{stat.count}</div>
                  <div className="text-xs text-gray-500">{stat.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>

          {searchTerm && filteredAndSortedStats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No channels found matching &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}