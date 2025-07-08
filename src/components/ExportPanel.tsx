'use client';

import { useState } from 'react';
import { Email } from '@/types/email';
import { Download, FileText, Table, Calendar, Settings } from 'lucide-react';

interface ExportPanelProps {
  emails: Email[];
  filteredEmails: Email[];
}

export default function ExportPanel({ emails, filteredEmails }: ExportPanelProps) {
  const [exportType, setExportType] = useState<'csv' | 'json' | 'report'>('csv');
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [dateRange, setDateRange] = useState<'all' | 'filtered' | 'custom' | 'duplicates'>('filtered');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const exportToCSV = (dataEmails: Email[]) => {
    const headers = [
      'ID',
      'Subject',
      'From',
      'Supplier',
      'Channel',
      'Type',
      'Has Attachments',
      'Attachment Count',
      'Categories',
      'Received Date',
      'Is Read',
      'Is Flagged'
    ];

    const csvData = dataEmails.map(email => [
      email.id,
      `"${email.subject.replace(/"/g, '""')}"`,
      email.from,
      email.supplier,
      email.channel,
      email.type,
      email.hasAttachments ? 'Yes' : 'No',
      email.attachments?.length || 0,
      `"${email.categories.join(', ')}"`,
      new Date(email.receivedDateTime).toLocaleString('en-GB'),
      email.isRead ? 'Yes' : 'No',
      email.isFlagged ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `email_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (dataEmails: Email[]) => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalEmails: dataEmails.length,
        dateRange: dateRange === 'filtered' ? 'Filtered results' : dateRange === 'all' ? 'All emails' : dateRange === 'duplicates' ? 'Duplicates only' : `${customStart} to ${customEnd}`
      },
      emails: dataEmails.map(email => ({
        ...email,
        attachments: includeAttachments ? email.attachments : undefined
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `email_export_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReport = (dataEmails: Email[]) => {
    const supplierStats = dataEmails.reduce((acc, email) => {
      acc[email.supplier] = (acc[email.supplier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeStats = dataEmails.reduce((acc, email) => {
      acc[email.type] = (acc[email.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const attachmentCount = dataEmails.filter(e => e.hasAttachments).length;
    const unreadCount = dataEmails.filter(e => !e.isRead).length;
    const flaggedCount = dataEmails.filter(e => e.isFlagged).length;

    const report = `
EMAIL DASHBOARD REPORT
Generated: ${new Date().toLocaleString('en-GB')}
Date Range: ${dateRange === 'filtered' ? 'Filtered results' : dateRange === 'all' ? 'All emails' : dateRange === 'duplicates' ? 'Duplicates only' : `${customStart} to ${customEnd}`}

SUMMARY
=======
Total Emails: ${dataEmails.length}
Unread Emails: ${unreadCount} (${((unreadCount / dataEmails.length) * 100).toFixed(1)}%)
Flagged Emails: ${flaggedCount} (${((flaggedCount / dataEmails.length) * 100).toFixed(1)}%)
Emails with Attachments: ${attachmentCount} (${((attachmentCount / dataEmails.length) * 100).toFixed(1)}%)

SUPPLIER DISTRIBUTION
====================
${Object.entries(supplierStats)
  .sort(([,a], [,b]) => b - a)
  .map(([supplier, count]) => `${supplier}: ${count} (${((count / dataEmails.length) * 100).toFixed(1)}%)`)
  .join('\n')}

EMAIL TYPE DISTRIBUTION
======================
${Object.entries(typeStats)
  .sort(([,a], [,b]) => b - a)
  .map(([type, count]) => `${type.charAt(0).toUpperCase() + type.slice(1)}: ${count} (${((count / dataEmails.length) * 100).toFixed(1)}%)`)
  .join('\n')}

DETAILED EMAIL LIST
==================
${dataEmails.map(email => `
${email.subject}
From: ${email.from}
Supplier: ${email.supplier} | Channel: ${email.channel} | Type: ${email.type}
Received: ${new Date(email.receivedDateTime).toLocaleString('en-GB')}
Status: ${email.isRead ? 'Read' : 'Unread'}${email.isFlagged ? ' | Flagged' : ''}${email.hasAttachments ? ' | Has Attachments' : ''}
Categories: ${email.categories.join(', ')}
${'='.repeat(80)}
`).join('\n')}
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `email_report_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    let dataToExport: Email[] = [];

    switch (dateRange) {
      case 'all':
        dataToExport = emails;
        break;
      case 'filtered':
        dataToExport = filteredEmails;
        break;
      case 'custom':
        dataToExport = emails.filter(email => {
          const emailDate = new Date(email.receivedDateTime);
          const start = customStart ? new Date(customStart) : null;
          const end = customEnd ? new Date(customEnd) : null;
          
          if (start && emailDate < start) return false;
          if (end && emailDate > end) return false;
          return true;
        });
        break;
      case 'duplicates':
        dataToExport = emails.filter(email => 
          email.subject.includes('DUPLICATE') || email.subject.includes('Re:') || email.subject.includes('FWD:')
        );
        break;
    }

    switch (exportType) {
      case 'csv':
        exportToCSV(dataToExport);
        break;
      case 'json':
        exportToJSON(dataToExport);
        break;
      case 'report':
        generateReport(dataToExport);
        break;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Download className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-medium text-gray-900">Export Data</h2>
      </div>

      <div className="space-y-6">
        {/* Export Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setExportType('csv')}
              className={`p-4 border rounded-lg flex items-center space-x-3 ${
                exportType === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Table className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <div className="font-medium">CSV</div>
                <div className="text-sm text-gray-500">Spreadsheet format</div>
              </div>
            </button>

            <button
              onClick={() => setExportType('json')}
              className={`p-4 border rounded-lg flex items-center space-x-3 ${
                exportType === 'json' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <div className="font-medium">JSON</div>
                <div className="text-sm text-gray-500">Structured data</div>
              </div>
            </button>

            <button
              onClick={() => setExportType('report')}
              className={`p-4 border rounded-lg flex items-center space-x-3 ${
                exportType === 'report' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <div className="font-medium">Report</div>
                <div className="text-sm text-gray-500">Summary report</div>
              </div>
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Calendar className="inline h-4 w-4 mr-1" />
            Date Range
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="filtered"
                checked={dateRange === 'filtered'}
                onChange={(e) => setDateRange(e.target.value as 'all' | 'filtered' | 'custom' | 'duplicates')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Current filtered results ({filteredEmails.length} emails)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="all"
                checked={dateRange === 'all'}
                onChange={(e) => setDateRange(e.target.value as 'all' | 'filtered' | 'custom' | 'duplicates')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">All emails ({emails.length} emails)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="custom"
                checked={dateRange === 'custom'}
                onChange={(e) => setDateRange(e.target.value as 'all' | 'filtered' | 'custom')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Custom date range</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="dateRange"
                value="duplicates"
                checked={dateRange === 'duplicates'}
                onChange={(e) => setDateRange(e.target.value as 'all' | 'filtered' | 'custom' | 'duplicates')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Duplicates only ({emails.filter(email => email.subject.includes('DUPLICATE') || email.subject.includes('Re:')).length} emails)</span>
            </label>

            {dateRange === 'custom' && (
              <div className="ml-6 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Export Options
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeAttachments}
                onChange={(e) => setIncludeAttachments(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Include attachment details</span>
            </label>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
        >
          Export {exportType.toUpperCase()}
        </button>
      </div>
    </div>
  );
}