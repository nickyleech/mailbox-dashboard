'use client';

import { useState } from 'react';
import { EmailFilter } from '@/types/email';
import { supplierConfig } from '@/data/mockEmails';
import { Filter, X, Paperclip, Clock, Copy, Star, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import SearchableDropdown from './SearchableDropdown';
import GroupedChannelDropdown from './GroupedChannelDropdown';

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
  const [favouriteChannels, setFavouriteChannels] = useState<string[]>([
    'BBC One', 'BBC Two', 'ITV', 'Channel 4', 'Channel 5'
  ]);
  const [showFavouriteChannels, setShowFavouriteChannels] = useState(false);
  const [newFavouriteChannel, setNewFavouriteChannel] = useState('');

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

  const addFavouriteChannel = () => {
    if (newFavouriteChannel.trim() && !favouriteChannels.includes(newFavouriteChannel.trim())) {
      setFavouriteChannels([...favouriteChannels, newFavouriteChannel.trim()]);
      setNewFavouriteChannel('');
    }
  };

  const removeFavouriteChannel = (channel: string) => {
    setFavouriteChannels(favouriteChannels.filter(c => c !== channel));
  };

  const moveFavouriteChannel = (fromIndex: number, toIndex: number) => {
    const newFavourites = [...favouriteChannels];
    const [movedChannel] = newFavourites.splice(fromIndex, 1);
    newFavourites.splice(toIndex, 0, movedChannel);
    setFavouriteChannels(newFavourites);
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
          {/* Time Range Filter - Move to top */}
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

          {/* Channel Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel
              {availableChannels.length > 20 && (
                <span className="ml-1 text-xs text-gray-500">
                  ({availableChannels.length} channels)
                </span>
              )}
            </label>
            {availableChannels.length > 20 ? (
              <GroupedChannelDropdown
                channels={availableChannels}
                value={localFilters.channel || ''}
                onChange={(value) => handleFilterChange('channel', value || undefined)}
                emptyText="All channels"
              />
            ) : (
              <SearchableDropdown
                options={availableChannels}
                value={localFilters.channel || ''}
                onChange={(value) => handleFilterChange('channel', value || undefined)}
                emptyText="All channels"
              />
            )}
          </div>

          {/* Favourite Channels */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <Star className="inline h-4 w-4 mr-1 text-yellow-500" />
                Favourite Channels
              </label>
              <button
                onClick={() => setShowFavouriteChannels(!showFavouriteChannels)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showFavouriteChannels ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showFavouriteChannels && (
              <div className="space-y-2">
                {/* Quick access buttons for favourite channels */}
                <div className="flex flex-wrap gap-2">
                  {favouriteChannels.map((channel) => (
                    <button
                      key={channel}
                      onClick={() => handleFilterChange('channel', channel)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        localFilters.channel === channel
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
                
                {/* Add new favourite channel */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFavouriteChannel}
                    onChange={(e) => setNewFavouriteChannel(e.target.value)}
                    placeholder="Add favourite channel"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addFavouriteChannel()}
                  />
                  <button
                    onClick={addFavouriteChannel}
                    className="px-2 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Manage favourite channels */}
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manage Favourites</h4>
                  {favouriteChannels.map((channel, index) => (
                    <div key={channel} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <span className="flex-1 text-sm text-gray-700">{channel}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => moveFavouriteChannel(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Move up"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => moveFavouriteChannel(index, Math.min(favouriteChannels.length - 1, index + 1))}
                          disabled={index === favouriteChannels.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          title="Move down"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFavouriteChannel(channel)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Remove"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="space-y-2">
              {['TV Schedule', 'Update', 'Press Release', 'Other'].map((category) => (
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

          {/* Attachments Filter - Reworded */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localFilters.hasAttachments === true}
                onChange={(e) => handleFilterChange('hasAttachments', e.target.checked || undefined)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Paperclip className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">Has attachments</span>
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
              <span className="text-sm text-gray-700">Show Duplicates</span>
            </label>
          </div>

          {/* Supplier Filter - Move to bottom */}
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
        </div>
      )}
    </div>
  );
}