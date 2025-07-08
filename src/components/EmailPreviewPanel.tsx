'use client';

import { Email } from '@/types/email';
import { X, Calendar, User, Paperclip, Flag, Download, Forward, Reply, Archive, Trash2 } from 'lucide-react';

interface EmailPreviewPanelProps {
  email: Email | null;
  onClose: () => void;
  onAction?: (action: string, email: Email) => void;
}

export default function EmailPreviewPanel({ email, onClose, onAction }: EmailPreviewPanelProps) {
  if (!email) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, email);
    }
  };

  const handleDownloadAttachment = (attachment: { id: string; name: string; contentType: string; size: number }) => {
    // Mock download functionality
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {email.isFlagged && <Flag className="h-5 w-5 text-red-500" />}
                <h2 className="text-xl font-semibold text-gray-900 truncate max-w-md">
                  {email.subject}
                </h2>
              </div>
              <span className={`badge ${
                email.type === 'schedule' ? 'badge-primary' :
                email.type === 'update' ? 'badge-warning' :
                email.type === 'press' ? 'badge-success' :
                email.type === 'technical' ? 'badge-error' :
                'badge-gray'
              }`}>
                {email.type}
              </span>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm p-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="card-content overflow-y-auto flex-1">
          {/* Email Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">From:</span>
                <span>{email.from}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Received:</span>
                <span>{formatDate(email.receivedDateTime)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Channel:</span>
                <span>{email.channel}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Supplier:</span>
                <span>{email.supplier}</span>
              </div>
            </div>

            {email.categories.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">Categories:</span>
                <div className="flex flex-wrap gap-1">
                  {email.categories.map((category, index) => (
                    <span key={index} className="badge badge-gray">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Attachments */}
          {email.hasAttachments && email.attachments && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Paperclip className="h-4 w-4" />
                  <span>Attachments ({email.attachments.length})</span>
                </h3>
                <button
                  onClick={() => {
                    email.attachments?.forEach(attachment => {
                      handleDownloadAttachment(attachment);
                    });
                  }}
                  className="btn btn-ghost btn-sm flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {email.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">
                          {attachment.contentType} • {Math.round(attachment.size / 1024)}KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadAttachment(attachment)}
                      className="btn btn-ghost btn-sm flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Body */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Email Content</h3>
            <div className="prose prose-sm max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 border max-h-96 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {email.body || 'No email content available to preview.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="card-footer">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAction('reply')}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Reply className="h-4 w-4" />
                <span>Reply</span>
              </button>
              <button
                onClick={() => handleAction('forward')}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <Forward className="h-4 w-4" />
                <span>Forward</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAction('archive')}
                className="btn btn-ghost flex items-center space-x-2"
              >
                <Archive className="h-4 w-4" />
                <span>Archive</span>
              </button>
              <button
                onClick={() => handleAction('delete')}
                className="btn btn-ghost text-red-600 hover:text-red-700 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}