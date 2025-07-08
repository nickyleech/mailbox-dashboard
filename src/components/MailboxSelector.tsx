'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, ChevronDown, User, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Mailbox {
  id: string;
  displayName: string;
  emailAddress: string;
  type: 'primary' | 'shared' | 'delegated';
}

interface MailboxSelectorProps {
  selectedMailbox: string;
  onMailboxChange: (mailboxId: string) => void;
}

export default function MailboxSelector({ selectedMailbox, onMailboxChange }: MailboxSelectorProps) {
  const { graphService, user } = useAuth();
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMailboxes = useCallback(async () => {
    if (!graphService) return;

    try {
      setLoading(true);
      setError(null);

      // Get primary mailbox
      const primaryMailbox: Mailbox = {
        id: 'me',
        displayName: user?.name || 'My Mailbox',
        emailAddress: user?.username || '',
        type: 'primary'
      };

      // Get shared mailboxes (if user has permissions)
      let sharedMailboxes: Mailbox[] = [];
      try {
        const sharedResponse = await graphService.getSharedMailboxes();
        sharedMailboxes = sharedResponse.map((mailbox: { id: string; displayName?: string; userPrincipalName: string }) => ({
          id: mailbox.id,
          displayName: mailbox.displayName || mailbox.userPrincipalName,
          emailAddress: mailbox.userPrincipalName,
          type: 'shared' as const
        }));
      } catch {
        console.log('No shared mailboxes accessible or permission denied');
      }

      // Get delegated mailboxes (if user has permissions)
      let delegatedMailboxes: Mailbox[] = [];
      try {
        const delegatedResponse = await graphService.getDelegatedMailboxes();
        delegatedMailboxes = delegatedResponse.map((mailbox: { id: string; displayName?: string; userPrincipalName: string }) => ({
          id: mailbox.id,
          displayName: mailbox.displayName || mailbox.userPrincipalName,
          emailAddress: mailbox.userPrincipalName,
          type: 'delegated' as const
        }));
      } catch {
        console.log('No delegated mailboxes accessible or permission denied');
      }

      const allMailboxes = [primaryMailbox, ...sharedMailboxes, ...delegatedMailboxes];
      setMailboxes(allMailboxes);

    } catch (err) {
      console.error('Error fetching mailboxes:', err);
      setError('Failed to load mailboxes');
    } finally {
      setLoading(false);
    }
  }, [graphService, user]);

  useEffect(() => {
    fetchMailboxes();
  }, [fetchMailboxes]);

  const selectedMailboxData = mailboxes.find(mb => mb.id === selectedMailbox) || mailboxes[0];

  const getMailboxIcon = (type: string) => {
    switch (type) {
      case 'shared':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'delegated':
        return <User className="h-4 w-4 text-green-600" />;
      default:
        return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMailboxTypeLabel = (type: string) => {
    switch (type) {
      case 'shared':
        return 'Shared';
      case 'delegated':
        return 'Delegated';
      default:
        return 'Primary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Loading mailboxes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 p-2 bg-red-100 rounded-lg">
        <Mail className="h-4 w-4 text-red-600" />
        <span className="text-sm text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[240px]"
      >
        {selectedMailboxData && getMailboxIcon(selectedMailboxData.type)}
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900">
            {selectedMailboxData?.displayName || 'Select Mailbox'}
          </div>
          <div className="text-xs text-gray-500">
            {selectedMailboxData?.emailAddress} • {getMailboxTypeLabel(selectedMailboxData?.type || 'primary')}
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {mailboxes.map((mailbox) => (
            <button
              key={mailbox.id}
              onClick={() => {
                onMailboxChange(mailbox.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-2 p-3 hover:bg-gray-50 ${
                selectedMailbox === mailbox.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              {getMailboxIcon(mailbox.type)}
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900">
                  {mailbox.displayName}
                </div>
                <div className="text-xs text-gray-500">
                  {mailbox.emailAddress} • {getMailboxTypeLabel(mailbox.type)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}