'use client';

import { useState } from 'react';
import { Email, SortField, SortOrder } from '@/types/email';
import { typeConfig } from '@/data/mockEmails';
import { ChevronDown, ChevronUp, Paperclip, Flag, Mail, MailOpen, Download, Forward, Copy, Eye, ArrowRight, ArrowLeft } from 'lucide-react';

interface EmailListProps {
  emails: Email[];
  onEmailClick?: (email: Email) => void;
  loading?: boolean;
}

type ColumnKey = 'received' | 'channel' | 'type' | 'subject' | 'from' | 'attachments';

interface Column {
  key: ColumnKey;
  label: string;
  sortField?: SortField;
  visible: boolean;
}

export default function EmailList({ emails, onEmailClick, loading = false }: EmailListProps) {
  const [sortField, setSortField] = useState<SortField>('receivedDateTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [columns, setColumns] = useState<Column[]>([
    { key: 'received', label: 'Received', sortField: 'receivedDateTime', visible: true },
    { key: 'channel', label: 'Channel', sortField: 'channel', visible: true },
    { key: 'type', label: 'Categories', visible: true },
    { key: 'subject', label: 'Subject', sortField: 'subject', visible: true },
    { key: 'from', label: 'From', sortField: 'from', visible: true },
    { key: 'attachments', label: 'Attachments', visible: true }
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleEmailRowClick = (email: Email) => {
    setSelectedEmail(email);
  };

  const handleViewEmail = (email: Email) => {
    setSelectedEmail(null);
    onEmailClick?.(email);
  };

  const toggleColumnVisibility = (key: ColumnKey) => {
    setColumns(prev => prev.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    setColumns(newColumns);
  };

  const visibleColumns = columns.filter(col => col.visible);

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

  const handleDownloadAttachment = (attachment: { id: string; name: string; contentType: string; size: number }, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([`Mock attachment: ${attachment.name}`], { type: attachment.contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleForwardEmail = (email: Email, e: React.MouseEvent) => {
    e.stopPropagation();
    const subject = encodeURIComponent(`Fwd: ${email.subject}`);
    const body = encodeURIComponent(`
---------- Forwarded message ----------
From: ${email.from}
Date: ${formatDate(email.receivedDateTime)}
Subject: ${email.subject}

${email.body || 'Email content not available'}
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors duration-150"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 text-blue-600" /> : <ChevronDown className="h-4 w-4 text-blue-600" />
        )}
      </div>
    </th>
  );

  const renderColumnHeader = (column: Column) => {
    if (column.sortField) {
      return <SortHeader field={column.sortField}>{column.label}</SortHeader>;
    }
    return (
      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {column.label}
      </th>
    );
  };

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Emails</h3>
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="btn btn-ghost btn-sm"
          >
            Configure Columns
          </button>
        </div>
        
        {showColumnSelector && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Column Visibility & Order</h4>
            <div className="space-y-3">
              {columns.map((column, index) => (
                <div key={column.key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumnVisibility(column.key)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded focus-ring"
                  />
                  <span className="text-sm text-gray-700 flex-1">{column.label}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => moveColumn(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="btn btn-ghost btn-sm p-1 disabled:opacity-50"
                      title="Move left"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveColumn(index, Math.min(columns.length - 1, index + 1))}
                      disabled={index === columns.length - 1}
                      className="btn btn-ghost btn-sm p-1 disabled:opacity-50"
                      title="Move right"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map(column => renderColumnHeader(column))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  {visibleColumns.map(column => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      <div className="skeleton h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              sortedEmails.map((email) => (
                <tr 
                  key={email.id}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${!email.isRead ? 'bg-blue-50' : ''} ${email.isDuplicate ? 'bg-orange-50 border-l-4 border-orange-400' : ''}`}
                  onClick={() => handleEmailRowClick(email)}
                >
                {visibleColumns.map(column => {
                  switch (column.key) {
                    case 'received':
                      return (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{formatDate(email.receivedDateTime)}</span>
                            <div className="flex items-center space-x-1">
                              {email.isRead ? (
                                <MailOpen className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Mail className="h-4 w-4 text-blue-600" />
                              )}
                              {email.isFlagged && (
                                <Flag className="h-4 w-4 text-red-500" />
                              )}
                              {email.isDuplicate && (
                                <div title="Duplicate email">
                                  <Copy className="h-4 w-4 text-orange-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    case 'channel':
                      return (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="text-sm font-medium text-gray-900 max-w-32 truncate" 
                            title={email.channel}
                          >
                            {email.channel}
                          </div>
                        </td>
                      );
                    case 'type':
                      return (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${
                            typeConfig[email.type]?.color || 'badge-gray'
                          }`}>
                            {typeConfig[email.type]?.label || email.type}
                          </span>
                        </td>
                      );
                    case 'subject':
                      return (
                        <td key={column.key} className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900 truncate max-w-xs" title={email.subject}>
                            {email.subject}
                          </div>
                        </td>
                      );
                    case 'from':
                      return (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">{email.from}</div>
                        </td>
                      );
                    case 'attachments':
                      return (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          {email.hasAttachments && (
                            <div className="space-y-1">
                              {email.attachments?.map((attachment) => (
                                <div key={attachment.id} className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => handleDownloadAttachment(attachment, e)}
                                    className="btn btn-ghost btn-sm flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-xs p-1"
                                    title={`Download ${attachment.name}`}
                                  >
                                    <Download className="h-3 w-3" />
                                    <span className="truncate max-w-24">{attachment.name}</span>
                                  </button>
                                  <span className="text-xs text-gray-400">
                                    ({formatFileSize(attachment.size)})
                                  </span>
                                </div>
                              )) || (
                                <div className="flex items-center space-x-1">
                                  <Paperclip className="h-4 w-4 text-gray-400" />
                                  <span className="text-xs text-gray-500">1</span>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    default:
                      return null;
                  }
                })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {!loading && sortedEmails.length === 0 && (
        <div className="text-center py-12">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No emails found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
      
      {/* Email Action Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Email Actions</h3>
            </div>
            <div className="card-content space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Subject:</strong> {selectedEmail.subject}</p>
                <p><strong>From:</strong> {selectedEmail.from}</p>
                <p><strong>Channel:</strong> {selectedEmail.channel}</p>
                <p><strong>Received:</strong> {formatDate(selectedEmail.receivedDateTime)}</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleViewEmail(selectedEmail)}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                
                <button
                  onClick={(e) => {
                    handleForwardEmail(selectedEmail, e);
                    setSelectedEmail(null);
                  }}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <Forward className="h-4 w-4" />
                  <span>Forward</span>
                </button>
                
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}