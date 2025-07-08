'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { supplierConfig } from '@/data/mockEmails';

interface GroupedChannelDropdownProps {
  channels: string[];
  value: string;
  onChange: (value: string) => void;
  emptyText?: string;
  className?: string;
}

interface ChannelGroup {
  supplier: string;
  channels: string[];
  color: string;
}

export default function GroupedChannelDropdown({
  channels,
  value,
  onChange,
  emptyText = 'All channels',
  className = ''
}: GroupedChannelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Group channels by supplier
  const groupedChannels = useMemo(() => {
    const groups: ChannelGroup[] = [];
    const ungrouped: string[] = [];

    // Create supplier groups
    Object.keys(supplierConfig).forEach(supplier => {
      const supplierChannels = channels.filter(channel => 
        channel.toLowerCase().includes(supplier.toLowerCase()) ||
        channel.toLowerCase().includes('bbc') && supplier === 'BBC' ||
        channel.toLowerCase().includes('itv') && supplier === 'ITV' ||
        channel.toLowerCase().includes('channel 4') && supplier === 'Channel 4' ||
        channel.toLowerCase().includes('sky') && supplier === 'Sky'
      );
      
      if (supplierChannels.length > 0) {
        groups.push({
          supplier,
          channels: supplierChannels.sort(),
          color: supplierConfig[supplier as keyof typeof supplierConfig]?.color || 'bg-gray-100 text-gray-800'
        });
      }
    });

    // Add channels that don't match any supplier to ungrouped
    channels.forEach(channel => {
      const isGrouped = groups.some(group => 
        group.channels.includes(channel)
      );
      if (!isGrouped) {
        ungrouped.push(channel);
      }
    });

    if (ungrouped.length > 0) {
      groups.push({
        supplier: 'Other',
        channels: ungrouped.sort(),
        color: 'bg-gray-100 text-gray-800'
      });
    }

    return groups;
  }, [channels]);

  // Filter groups based on search term
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedChannels;

    return groupedChannels.map(group => ({
      ...group,
      channels: group.channels.filter(channel =>
        channel.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(group => group.channels.length > 0);
  }, [groupedChannels, searchTerm]);

  // Flatten filtered options for keyboard navigation
  const flatOptions = useMemo(() => {
    const options: string[] = [];
    filteredGroups.forEach(group => {
      group.channels.forEach(channel => {
        options.push(channel);
      });
    });
    return options;
  }, [filteredGroups]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < flatOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : flatOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < flatOptions.length) {
          onChange(flatOptions[focusedIndex]);
          setIsOpen(false);
          setSearchTerm('');
          setFocusedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
    }
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const displayValue = value || emptyText;
  const resultsCount = flatOptions.length;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue}
        </span>
        <div className="flex items-center space-x-1">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFocusedIndex(-1);
                }}
                placeholder="Search channels..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            {searchTerm && (
              <div className="mt-1 text-xs text-gray-500">
                {resultsCount} channel{resultsCount !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {emptyText && (
              <button
                type="button"
                onClick={() => handleOptionClick('')}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                  !value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                {emptyText}
              </button>
            )}
            
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div key={group.supplier}>
                  {/* Group Header */}
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${group.color}`}>
                        {group.supplier}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({group.channels.length} channel{group.channels.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                  
                  {/* Group Channels */}
                  {group.channels.map((channel) => {
                    const flatIndex = flatOptions.indexOf(channel);
                    return (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => handleOptionClick(channel)}
                        className={`w-full px-6 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm ${
                          flatIndex === focusedIndex ? 'bg-gray-100' : ''
                        } ${
                          value === channel ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                        }`}
                      >
                        <div className="truncate" title={channel}>
                          {channel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No channels found matching &ldquo;{searchTerm}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}