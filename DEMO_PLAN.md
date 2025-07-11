# Outlook Email Dashboard Demo Plan

## Executive Summary

This document outlines a comprehensive demonstration plan for an Outlook email dashboard designed to manage 600+ daily TV channel emails. The demo showcases technical feasibility, user experience, and business benefits without requiring admin access to organizational mailboxes.

## Problem Statement

- **Volume**: 600+ TV channel emails daily
- **Complexity**: Mixed content types (schedules, updates, press info)
- **Sources**: Multiple suppliers (BBC, ITV, Channel 4, etc.)
- **Challenges**: Manual categorization, attachment management, information overload

## Solution Overview

A Next.js dashboard connected to Microsoft Outlook via Graph API that automatically:
- Categorizes emails by supplier (BBC, ITV, Channel 4, etc.)
- Organizes by channel name
- Identifies attachments (schedules vs. updates)
- Provides advanced filtering and search capabilities

## Technical Architecture

### Core Stack
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Authentication**: Microsoft MSAL (Microsoft Authentication Library)
- **API**: Microsoft Graph API for Outlook integration
- **Database**: Client-side caching with localStorage
- **Deployment**: Vercel or similar platform

### Key Components
```
├── Authentication Layer (MSAL)
├── Graph API Client
├── Email Processing Engine
├── Categorization Logic
├── Dashboard UI Components
└── Export/Reporting Features
```

## Demo Approach

### Phase 1: Microsoft Graph Explorer Demo (No Admin Required)

#### Setup
1. Visit https://developer.microsoft.com/en-us/graph/graph-explorer
2. Sign in with any Office 365 account
3. Use delegated permissions (user consent only)

#### Key API Demonstrations

**1. Fetch Recent Emails**
```http
GET /me/messages?$top=50&$select=subject,from,receivedDateTime,hasAttachments
```

**2. Filter by Supplier Domain**
```http
GET /me/messages?$filter=from/emailAddress/address eq 'noreply@bbc.co.uk'
```

**3. Search for TV Schedule Keywords**
```http
GET /me/messages?$search="TV schedule" OR "programme guide"
```

**4. Filter Emails with Attachments**
```http
GET /me/messages?$filter=hasAttachments eq true
```

**5. Get Email Categories**
```http
GET /me/messages?$select=subject,categories,from&$filter=categories/any(c:c eq 'TV Schedule')
```

#### Expected Results
- Live demonstration of email filtering capabilities
- Proof of concept for attachment detection
- Validation of supplier identification logic
- Performance metrics for large email volumes

### Phase 2: Mock Data Dashboard

#### Sample Data Structure
```json
{
  "emails": [
    {
      "id": "msg_001",
      "subject": "BBC One Schedule - Week 28",
      "from": "schedules@bbc.co.uk",
      "supplier": "BBC",
      "channel": "BBC One",
      "type": "schedule",
      "hasAttachments": true,
      "receivedDateTime": "2025-07-08T09:00:00Z",
      "categories": ["TV Schedule", "BBC"]
    },
    {
      "id": "msg_002", 
      "subject": "ITV Schedule Update - Tonight's Programming",
      "from": "updates@itv.com",
      "supplier": "ITV",
      "channel": "ITV1",
      "type": "update",
      "hasAttachments": false,
      "receivedDateTime": "2025-07-08T14:30:00Z",
      "categories": ["Schedule Update", "ITV"]
    }
  ]
}
```

#### Dashboard Features to Demonstrate

**1. Email List View**
- Responsive table with sortable columns
- Visual indicators for attachments
- Color-coded supplier badges
- Quick action buttons (mark as read, flag, etc.)

**2. Filtering System**
- Supplier filter (BBC, ITV, Channel 4, Sky, etc.)
- Channel-specific filtering
- Attachment presence toggle
- Date range selection
- Email type classification

**3. Search Functionality**
- Full-text search across subject and content
- Advanced search with boolean operators
- Saved search queries
- Recent searches history

**4. Categorization Dashboard**
- Supplier distribution pie chart
- Daily email volume trends
- Attachment statistics
- Channel activity heatmap

**5. Export Features**
- CSV export for reporting
- Filtered data export
- Email summary reports
- Scheduled report generation

### Phase 3: Technical Implementation Guide

#### Authentication Flow
1. **Azure AD App Registration**
   - Application ID configuration
   - Redirect URI setup
   - Permission scopes definition

2. **MSAL Integration**
   ```javascript
   const msalConfig = {
     auth: {
       clientId: "your-app-id",
       authority: "https://login.microsoftonline.com/common"
     }
   };
   ```

3. **Graph API Client Setup**
   ```javascript
   const graphClient = Client.init({
     authProvider: tokenProvider
   });
   ```

#### Required Permissions
- `Mail.Read` (Delegated) - Read user email
- `Mail.ReadWrite` (Delegated) - Optional: for categorization
- `User.Read` (Delegated) - Basic user profile

#### Code Structure
```
src/
├── components/
│   ├── EmailList.tsx
│   ├── FilterPanel.tsx
│   ├── SearchBar.tsx
│   └── Dashboard.tsx
├── services/
│   ├── graphClient.ts
│   ├── emailProcessor.ts
│   └── categorizer.ts
├── utils/
│   ├── emailParser.ts
│   └── dateHelpers.ts
└── types/
    └── email.ts
```

### Phase 4: Business Case Documentation

#### Quantified Benefits

**Time Savings**
- Current: 2 hours/day manual email processing
- Proposed: 30 minutes/day with dashboard
- **Savings**: 7.5 hours/week per user

**Improved Accuracy**
- Automated categorization reduces human error
- Consistent supplier identification
- No missed schedules or updates

**Enhanced Productivity**
- Quick filtering saves search time
- Attachment preview reduces clicks
- Export features enable reporting

#### Cost Analysis
- Development: 4-6 weeks (1 developer)
- Infrastructure: Minimal (Microsoft 365 existing)
- Maintenance: 2-4 hours/month
- **ROI**: 300% within 6 months

#### Risk Mitigation
- **Security**: Microsoft Graph API compliance
- **Reliability**: Built-in error handling and retry logic
- **Scalability**: Designed for 1000+ emails/day
- **Maintenance**: Standard React/Next.js stack

## Demo Script

### Opening (5 minutes)
1. Problem statement with current email volume
2. Show sample inbox with 600+ emails
3. Demonstrate manual categorization challenges

### Graph Explorer Demo (10 minutes)
1. Live API testing with real Office 365 account
2. Show email filtering capabilities
3. Demonstrate attachment detection
4. Prove supplier identification logic

### Dashboard Walkthrough (15 minutes)
1. Overview of categorized email dashboard
2. Filtering by supplier, channel, and attachment
3. Search functionality demonstration
4. Export and reporting features
5. Mobile responsive design

### Technical Deep Dive (10 minutes)
1. Authentication flow explanation
2. Graph API integration details
3. Security and permission model
4. Deployment and scaling considerations

### Business Case (5 minutes)
1. Time savings quantification
2. Cost-benefit analysis
3. Implementation timeline
4. Next steps for approval

## Next Steps

### Immediate Actions
1. **Stakeholder Review**: Present demo to decision makers
2. **Technical Validation**: IT team reviews architecture
3. **Security Assessment**: Information security approval
4. **Budget Approval**: Resource allocation confirmation

### Implementation Timeline
- **Week 1-2**: Azure AD setup and permissions
- **Week 3-4**: Core dashboard development
- **Week 5**: Email processing and categorization
- **Week 6**: Testing and deployment

### Success Metrics
- Email processing time reduction: >75%
- User satisfaction score: >4.5/5
- System uptime: >99.9%
- Categorization accuracy: >95%

## Appendices

### A. Supported TV Suppliers
- BBC (bbc.co.uk, bbc.com)
- ITV (itv.com, itv.co.uk)
- Channel 4 (channel4.com, c4.co.uk)
- Sky (sky.com, sky.uk)
- UKTV (uktv.co.uk)
- Discovery (discovery.com, discovery.co.uk)

### B. Email Types Classification
- **Schedules**: Weekly/daily programming guides
- **Updates**: Last-minute programming changes
- **Press**: PR materials and press releases
- **Technical**: Broadcast technical information
- **Marketing**: Promotional content and trailers

### C. Technical Requirements
- **Browser**: Chrome 90+, Edge 90+, Firefox 88+
- **Network**: HTTPS required for Graph API
- **Storage**: 10MB local storage for caching
- **Performance**: <2s page load time

---

*This document serves as a comprehensive guide for demonstrating the Outlook email dashboard concept without requiring admin access to organizational systems.*