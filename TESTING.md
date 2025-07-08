# Email Dashboard Testing Guide

## Overview

This application is a comprehensive demo of an Outlook Email Dashboard designed to manage 600+ daily TV channel emails. The dashboard provides advanced filtering, search, analytics, and export capabilities specifically tailored for media industry workflows.

## Current Features (Demo Mode)

### 📧 Email Management
- **Email List View**: Sortable table displaying mock TV channel emails
- **Status Indicators**: Read/unread status, flagged emails, attachment icons
- **Supplier Badges**: Color-coded badges for BBC, ITV, Channel 4, Sky, UKTV, Discovery
- **Email Types**: Schedule, Update, Press, Technical, Marketing categorization

### 🔍 Search & Filtering
- **Advanced Search**: Boolean operators (OR, NOT, quoted phrases)
- **Multi-Field Search**: Search across subject, from, and body fields
- **Comprehensive Filters**:
  - Supplier (BBC, ITV, Channel 4, Sky, UKTV, Discovery)
  - Channel (BBC One, ITV1, Sky Sports, etc.)
  - Email Type (Schedule, Update, Press, Technical, Marketing)
  - Attachment presence
  - Date range selection
  - Category tags

### 📊 Analytics Dashboard
- **Supplier Distribution**: Pie chart showing email breakdown by network
- **Email Type Analysis**: Bar chart of content types
- **Daily Volume Trends**: Timeline of email activity
- **Summary Statistics**: Total emails, attachments, suppliers, averages

### 📤 Export Capabilities
- **CSV Export**: Spreadsheet-ready format for analysis
- **JSON Export**: Structured data with metadata
- **Detailed Reports**: Text-based summaries with statistics
- **Flexible Date Ranges**: Export all, filtered, or custom date ranges

## Testing the Application

### 1. Email List Testing
```
✅ Sort columns by clicking headers (Subject, From, Supplier, Channel, Received)
✅ View email status (read/unread, flagged)
✅ Check attachment indicators
✅ Verify supplier color coding
✅ Test email type badges
```

### 2. Search Functionality Testing
```
✅ Basic search: "BBC schedule"
✅ Boolean OR: "BBC OR ITV"
✅ Boolean NOT: "schedule NOT update"
✅ Quoted phrases: "BBC One Schedule"
✅ Field-specific search: search in subject only
✅ Recent searches functionality
```

### 3. Filter Testing
```
✅ Filter by supplier (select BBC, see only BBC emails)
✅ Filter by channel (select BBC One)
✅ Filter by type (select Schedule)
✅ Filter by attachments (toggle "has attachments")
✅ Date range filtering
✅ Category filtering
✅ Combined filters (e.g., BBC + Schedule + Has Attachments)
```

### 4. Dashboard Testing
```
✅ View supplier distribution pie chart
✅ Check email type bar chart
✅ Review daily volume trends
✅ Verify summary statistics accuracy
```

### 5. Export Testing
```
✅ Export filtered results as CSV
✅ Export all data as JSON
✅ Generate detailed text report
✅ Test custom date range exports
```

## Live Email Integration Options

### Option 1: Microsoft Graph API (Recommended)

**Setup Requirements:**
1. **Azure AD App Registration**
   ```
   - Register app in Azure Portal
   - Configure redirect URIs
   - Set required permissions (Mail.Read, Mail.ReadWrite)
   ```

2. **MSAL Integration**
   ```bash
   npm install @azure/msal-browser @microsoft/microsoft-graph-client
   ```

3. **Authentication Flow**
   ```typescript
   // Add to src/services/graphClient.ts
   import { PublicClientApplication } from '@azure/msal-browser';
   import { Client } from '@microsoft/microsoft-graph-client';
   
   const msalConfig = {
     auth: {
       clientId: "your-app-id",
       authority: "https://login.microsoftonline.com/common"
     }
   };
   ```

4. **Required Permissions**
   - `Mail.Read` (Delegated) - Read user email
   - `Mail.ReadWrite` (Delegated) - Optional: for categorization
   - `User.Read` (Delegated) - Basic user profile

**Implementation Steps:**
1. Replace mock data with Graph API calls
2. Implement OAuth authentication flow
3. Add real-time email categorization
4. Set up automatic sync scheduling

### Option 2: IMAP/POP3 Integration

**Setup Requirements:**
```bash
npm install imap emailjs-imap-client
```

**Configuration:**
- Enable IMAP/POP3 in Outlook settings
- Use app-specific passwords for authentication
- Implement email parsing for TV channel identification

### Option 3: Exchange Web Services (EWS)

**Setup Requirements:**
```bash
npm install ews-javascript-api
```

**Benefits:**
- Direct Exchange server integration
- Rich metadata access
- Real-time notifications

## Deployment Options

### Option 1: Vercel (Recommended for Demo)

**Quick Deploy:**
```bash
npm install -g vercel
vercel
```

**Features:**
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy custom domains
- ✅ Environment variables for API keys
- ✅ Preview deployments for testing

**Environment Variables:**
```
NEXT_PUBLIC_CLIENT_ID=your-azure-app-id
NEXT_PUBLIC_TENANT_ID=your-tenant-id
GRAPH_CLIENT_SECRET=your-client-secret
```

### Option 2: Netlify

**Deploy Steps:**
```bash
npm run build
# Upload build folder to Netlify
```

**Features:**
- ✅ Static site hosting
- ✅ Form handling
- ✅ Serverless functions
- ✅ Branch previews

### Option 3: Azure Static Web Apps

**Benefits:**
- ✅ Native Azure integration
- ✅ Built-in authentication
- ✅ Serverless API support
- ✅ Custom domains

### Option 4: Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Deploy:**
```bash
docker build -t email-dashboard .
docker run -p 3000:3000 email-dashboard
```

### Option 5: Traditional Hosting

**Build for Production:**
```bash
npm run build
npm run export  # For static export
```

Upload the generated files to any web hosting service.

## Security Considerations

### Authentication
- ✅ OAuth 2.0 implementation for production
- ✅ Secure token storage
- ✅ Automatic token refresh
- ✅ PKCE for public clients

### Data Protection
- ✅ HTTPS enforcement
- ✅ Environment variable management
- ✅ Input sanitization
- ✅ Rate limiting for API calls

### Access Control
- ✅ Role-based permissions
- ✅ Tenant isolation
- ✅ Audit logging
- ✅ Data retention policies

## Performance Optimization

### Current Implementation
- ✅ Client-side filtering and search
- ✅ Memoized calculations
- ✅ Responsive design
- ✅ Optimized bundle size

### Production Enhancements
- 🔄 Server-side pagination
- 🔄 Email content caching
- 🔄 Background sync workers
- 🔄 CDN for static assets

## Monitoring & Analytics

### Recommended Tools
- **Application Insights** (Azure)
- **Google Analytics** (User behavior)
- **Sentry** (Error tracking)
- **LogRocket** (Session replay)

### Key Metrics
- Email processing time
- Search response time
- Filter application speed
- Export completion rate
- User engagement metrics

## Next Steps for Production

### Phase 1: Authentication (Week 1-2)
1. Set up Azure AD app registration
2. Implement MSAL authentication
3. Test with real Office 365 account

### Phase 2: Live Data Integration (Week 3-4)
1. Replace mock data with Graph API calls
2. Implement email categorization logic
3. Add real-time sync capabilities

### Phase 3: Advanced Features (Week 5-6)
1. Email content analysis
2. Automated categorization
3. Custom notification rules
4. Advanced reporting

### Phase 4: Production Deployment (Week 7-8)
1. Security hardening
2. Performance optimization
3. Monitoring setup
4. User training and documentation

## Support & Maintenance

### Documentation
- API documentation
- User guides
- Troubleshooting guides
- Development setup instructions

### Maintenance Schedule
- Weekly dependency updates
- Monthly security patches
- Quarterly feature reviews
- Annual architecture assessments

---

**Demo URL:** Currently running locally at http://localhost:3000
**Repository:** https://github.com/nickyleech/mailbox-dashboard
**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Recharts

For questions or support, please refer to the repository issues or contact the development team.