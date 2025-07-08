'use client';

import { useState } from 'react';
import { Email, SortField, SortOrder } from '@/types/email';
import { supplierConfig, typeConfig } from '@/data/mockEmails';
import { ChevronDown, ChevronUp, Paperclip, Flag, Mail, MailOpen } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  onEmailClick?: (email: Email) => void;
}

export default function EmailList({ emails, onEmailClick }: EmailListProps) {
  const [sortField, setSortField] = useState<SortField>('receivedDateTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedEmails = [...emails].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'receivedDateTime':
        aValue = new Date(a.receivedDateTime).getTime();
        bValue = new Date(b.receivedDateTime).getTime();
        break;
      case 'subject':
        aValue = a.subject.toLowerCase();
        bValue = b.subject.toLowerCase();
        break;
      case 'from':
        aValue = a.from.toLowerCase();
        bValue = b.from.toLowerCase();
        break;
      case 'supplier':
        aValue = a.supplier.toLowerCase();
        bValue = b.supplier.toLowerCase();
        break;
      case 'channel':
        aValue = a.channel.toLowerCase();
        bValue = b.channel.toLowerCase();
        break;
      default:
        aValue = a.receivedDateTime;
        bValue = b.receivedDateTime;
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <SortHeader field="subject">Subject</SortHeader>
              <SortHeader field="from">From</SortHeader>
              <SortHeader field="supplier">Supplier</SortHeader>
              <SortHeader field="channel">Channel</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attachments
              </th>
              <SortHeader field="receivedDateTime">Received</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEmails.map((email) => (
              <tr 
                key={email.id}
                className={`hover:bg-gray-50 cursor-pointer ${!email.isRead ? 'bg-blue-50' : ''}`}
                onClick={() => onEmailClick?.(email)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {email.isRead ? (
                      <MailOpen className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Mail className="h-4 w-4 text-blue-600" />
                    )}
                    {email.isFlagged && (
                      <Flag className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {email.subject}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{email.from}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    supplierConfig[email.supplier as keyof typeof supplierConfig]?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {email.supplier}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{email.channel}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    typeConfig[email.type]?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {typeConfig[email.type]?.label || email.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {email.hasAttachments && (
                    <div className="flex items-center space-x-1">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {email.attachments?.length || 1}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(email.receivedDateTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedEmails.length === 0 && (
        <div className="text-center py-12">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No emails found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}