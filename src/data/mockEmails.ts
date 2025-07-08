import { Email } from '@/types/email';
import { realMockEmails } from './realMockEmails';

// Use realistic mock data based on actual TV schedule emails
export const mockEmails: Email[] = realMockEmails;

export const supplierConfig = {
  'BBC': {
    color: 'bg-red-100 text-red-800',
    domains: ['bbc.co.uk', 'bbc.com']
  },
  'ITV': {
    color: 'bg-blue-100 text-blue-800',
    domains: ['itv.com', 'itv.co.uk']
  },
  'Channel 4': {
    color: 'bg-purple-100 text-purple-800',
    domains: ['channel4.com', 'c4.co.uk']
  },
  'Sky': {
    color: 'bg-gray-100 text-gray-800',
    domains: ['sky.com', 'sky.uk']
  },
  'UKTV': {
    color: 'bg-green-100 text-green-800',
    domains: ['uktv.co.uk']
  },
  'Discovery': {
    color: 'bg-yellow-100 text-yellow-800',
    domains: ['discovery.com', 'discovery.co.uk']
  },
  'Colors': {
    color: 'bg-pink-100 text-pink-800',
    domains: ['whatsonindia.com', 'colorstv.com']
  },
  'Bauer Media': {
    color: 'bg-teal-100 text-teal-800',
    domains: ['bauermedia.co.uk', 'absoluteradio.co.uk']
  },
  'MG ALBA': {
    color: 'bg-indigo-100 text-indigo-800',
    domains: ['mgalba.com', 'bbc.co.uk']
  },
  'PA Media': {
    color: 'bg-cyan-100 text-cyan-800',
    domains: ['pa.media', 'pamediagroup.com']
  },
  'MTV': {
    color: 'bg-violet-100 text-violet-800',
    domains: ['mtv.com', 'viacom.com']
  }
};

export const typeConfig = {
  'schedule': {
    color: 'bg-blue-100 text-blue-800',
    label: 'Schedule'
  },
  'update': {
    color: 'bg-orange-100 text-orange-800',
    label: 'Update'
  },
  'press': {
    color: 'bg-green-100 text-green-800',
    label: 'Press'
  },
  'technical': {
    color: 'bg-gray-100 text-gray-800',
    label: 'Technical'
  },
  'marketing': {
    color: 'bg-purple-100 text-purple-800',
    label: 'Marketing'
  }
};