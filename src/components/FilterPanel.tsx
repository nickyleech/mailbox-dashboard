'use client';

import { useState } from 'react';
import { EmailFilter } from '@/types/email';
import { supplierConfig, typeConfig } from '@/data/mockEmails';
import { Filter, X, Calendar, Paperclip, Clock, Copy } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';

interface FilterPanelProps {
  filters: EmailFilter;
  onFiltersChange: (filters: EmailFilter) => void;
  availableChannels: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function FilterPanel({ 
  filters, 
  onFiltersChange, 
  availableChannels,
  isOpen,
  onToggle 
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<EmailFilter>(filters);

  const handleFilterChange = (key: keyof EmailFilter, value: string | boolean | { start: string; end: string } | string[] | undefined) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: EmailFilter = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length;

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="px-6 py-4 space-y-6">
          {/* Supplier Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier
            </label>
            <select
              value={localFilters.supplier || ''}
              onChange={(e) => handleFilterChange('supplier', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All suppliers</option>
              {Object.keys(supplierConfig).map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel
            </label>
            <SearchableDropdown
              options={availableChannels}
              value={localFilters.channel || ''}
              onChange={(value) => handleFilterChange('channel', value || undefined)}
              emptyText="All channels"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Type
            </label>
            <select
              value={localFilters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All types</option>
              {Object.entries(typeConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Time Range
            </label>
            <select
              value={localFilters.timeFilter || ''}
              onChange={(e) => handleFilterChange('timeFilter', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All time</option>
              <option value="last30min">Last 30 minutes</option>
              <option value="last1hour">Last 1 hour</option>
              <option value="last3hours">Last 3 hours</option>
              <option value="last6hours">Last 6 hours</option>
              <option value="last12hours">Last 12 hours</option>
              <option value="last24hours">Last 24 hours</option>
            </select>
          </div>

          {/* Attachments Filter */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.hasAttachments === true}
                onChange={(e) => handleFilterChange('hasAttachments', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Paperclip className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">Has attachments only</span>
            </label>
          </div>

          {/* Duplicates Filter */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.showDuplicatesOnly === true}
                onChange={(e) => handleFilterChange('showDuplicatesOnly', e.target.checked || undefined)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <Copy className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-gray-700">Show duplicates only</span>
            </label>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.start || ''}
                  onChange={(e) => handleFilterChange('dateRange', {
                    start: e.target.value,
                    end: localFilters.dateRange?.end || ''
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.end || ''}
                  onChange={(e) => handleFilterChange('dateRange', {
                    start: localFilters.dateRange?.start || '',
                    end: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="space-y-2">
              {['TV Schedule', 'Schedule Update', 'Press Release', 'Technical', 'Marketing', 'Sports', 'Drama', 'Reality', 'Films'].map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localFilters.categories?.includes(category) || false}
                    onChange={(e) => {
                      const currentCategories = localFilters.categories || [];
                      const newCategories = e.target.checked 
                        ? [...currentCategories, category]
                        : currentCategories.filter(c => c !== category);
                      handleFilterChange('categories', newCategories.length > 0 ? newCategories : undefined);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}