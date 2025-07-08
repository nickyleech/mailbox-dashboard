# Email Dashboard - TV Schedule Mailbox Management System

## Overview

The Email Dashboard is a specialized web application designed to manage and analyze TV schedule-related emails from the shared mailbox `TV.Schedule@pamediagroup.com`. This application provides a comprehensive interface for media industry professionals to efficiently process, filter, and analyze incoming TV schedule communications from various suppliers and channels.

## Application Features

### 📧 Email Management
- **Real-time Email Access**: Direct integration with Office 365 to access the TV.Schedule mailbox
- **Intelligent Filtering**: Advanced filtering by supplier, channel, email type, attachments, and date ranges
- **Search Functionality**: Full-text search across subject, sender, and body content with boolean operators
- **Duplicate Detection**: Automatic identification and handling of duplicate emails
- **Email Categorization**: Automatic classification of emails into types (schedule, update, press, technical, marketing)

### 📊 Analytics & Reporting
- **Dashboard Analytics**: Visual representation of email statistics and trends
- **Supplier Distribution**: Analysis of email volume by content suppliers
- **Channel Analytics**: Breakdown of emails by TV/radio channels
- **Peak Time Analysis**: Identification of busiest email periods
- **Response Time Tracking**: Monitoring of email response patterns
- **Seasonal Patterns**: Quarterly trend analysis for business planning

### 🎯 Specialized Features
- **Media Industry Focus**: Tailored for TV schedule management workflows
- **Supplier Recognition**: Automatic identification of major broadcasters (BBC, ITV, Sky, Channel 4, etc.)
- **Channel Mapping**: Intelligent mapping of emails to specific TV/radio channels
- **Attachment Management**: Specialized handling of schedule documents and media files
- **Out-of-Hours Analysis**: Tracking of emails received outside business hours

### 🔐 Security & Access
- **Azure AD Integration**: Secure authentication using Microsoft 365 credentials
- **Role-Based Access**: Controlled access to the shared mailbox
- **Audit Trail**: Tracking of user access and actions
- **Data Protection**: Compliance with enterprise security standards

## Architecture

### Technology Stack
- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Authentication**: Microsoft Authentication Library (MSAL)
- **API Integration**: Microsoft Graph API for Office 365 access
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for data visualization
- **Testing**: Jest and React Testing Library

### Key Components
```
src/
├── app/                    # Next.js app router
├── components/            # React components
│   ├── Dashboard.tsx      # Main analytics dashboard
│   ├── EmailList.tsx      # Email listing interface
│   ├── FilterPanel.tsx    # Advanced filtering controls
│   ├── LoginComponent.tsx # Authentication interface
│   └── __tests__/        # Component tests
├── contexts/             # React context providers
├── services/             # API integration services
├── utils/               # Utility functions
├── types/               # TypeScript definitions
└── config/              # Application configuration
```

## Deployment Requirements

### Prerequisites

#### 1. Azure AD Application Registration
You must register the application in Azure Active Directory to enable Office 365 integration:

**Required Azure AD Permissions:**
- `Mail.Read` - Read mail in all mailboxes
- `Mail.ReadBasic` - Read basic mail information
- `User.Read` - Read user profile
- `MailboxSettings.Read` - Read mailbox settings

**Application Registration Steps:**
1. Navigate to Azure Portal → Azure Active Directory → App registrations
2. Create new registration with these settings:
   - Name: "Email Dashboard - TV Schedule"
   - Account types: "Accounts in this organizational directory only"
   - Redirect URI: `https://yourdomain.com/` (production URL)
3. Configure API permissions (listed above)
4. Generate client secret for server-side authentication
5. Note the Application (client) ID and Directory (tenant) ID

#### 2. Shared Mailbox Configuration
Configure the `TV.Schedule@pamediagroup.com` mailbox:

**Mailbox Settings:**
- Ensure mailbox is configured as a shared mailbox
- Grant appropriate users "Full Access" permissions
- Configure any required retention policies
- Set up any necessary forwarding rules

**User Permissions Required:**
- Users must have "Full Access" to the TV.Schedule mailbox
- Users must be licensed for Office 365 (Exchange Online Plan 1 or higher)
- Users must be in the same Azure AD tenant as the application

#### 3. Environment Configuration
Create production environment variables:

```bash
# Azure AD Configuration
AZURE_CLIENT_ID=your-application-client-id
AZURE_CLIENT_SECRET=your-application-secret
AZURE_TENANT_ID=your-tenant-id

# Application Configuration
NEXT_PUBLIC_AZURE_CLIENT_ID=your-application-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_REDIRECT_URI=https://yourdomain.com/

# Mailbox Configuration
SHARED_MAILBOX_ADDRESS=TV.Schedule@pamediagroup.com
```

### Deployment Options

#### Option 1: Vercel Deployment (Recommended)
Vercel provides seamless Next.js deployment with automatic scaling:

**Deployment Steps:**
1. Push code to GitHub repository
2. Connect GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on code changes

**Vercel Configuration:**
```json
{
  "name": "email-dashboard",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "AZURE_CLIENT_ID": "@azure-client-id",
    "AZURE_CLIENT_SECRET": "@azure-client-secret",
    "AZURE_TENANT_ID": "@azure-tenant-id"
  }
}
```

#### Option 2: Azure App Service
Deploy directly to Microsoft Azure for tighter integration:

**Benefits:**
- Native Azure integration
- Built-in SSL certificates
- Automatic scaling
- Integrated monitoring

**Deployment Process:**
1. Create Azure App Service (Node.js runtime)
2. Configure application settings with environment variables
3. Set up deployment from GitHub
4. Configure custom domain if required

#### Option 3: Docker Deployment
For containerized deployment on any cloud platform:

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

### Post-Deployment Configuration

#### 1. DNS and SSL
- Configure custom domain pointing to deployment
- Ensure SSL/TLS certificate is properly configured
- Update Azure AD redirect URIs with production domain

#### 2. User Access Management
**Adding Users:**
1. Ensure users have Office 365 licenses
2. Grant "Full Access" to TV.Schedule mailbox:
   ```powershell
   Add-MailboxPermission -Identity "TV.Schedule@pamediagroup.com" -User "user@pamediagroup.com" -AccessRights FullAccess
   ```
3. Users can then access the application with their Office 365 credentials

#### 3. Monitoring and Maintenance
**Application Monitoring:**
- Set up application performance monitoring
- Configure error tracking and logging
- Monitor authentication success/failure rates
- Track API usage and rate limits

**Regular Maintenance:**
- Update dependencies monthly
- Monitor Microsoft Graph API changes
- Review and update permissions as needed
- Backup configuration and settings

### Security Considerations

#### Data Protection
- All email data remains within Microsoft 365 environment
- No sensitive email content is stored locally
- Authentication tokens are securely managed
- HTTPS enforced for all connections

#### Access Control
- Authentication required for all features
- Role-based access through Azure AD
- Audit logging of user actions
- Automatic session timeout

#### Compliance
- GDPR compliance through Microsoft 365
- Industry-standard encryption
- Regular security updates
- Compliance with enterprise policies

## User Guide

### Getting Started
1. Navigate to the application URL
2. Click "Sign in with Microsoft"
3. Authenticate with your Office 365 credentials
4. Access will be granted if you have permissions to the TV.Schedule mailbox

### Daily Workflow
1. **Review Dashboard**: Check email volume and trends
2. **Filter Content**: Use filters to focus on specific suppliers or channels
3. **Process Emails**: Review, categorize, and respond to schedule updates
4. **Monitor Analytics**: Track patterns and identify issues
5. **Generate Reports**: Export data for business analysis

### Advanced Features
- **Search Queries**: Use boolean operators for complex searches
- **Time Filters**: Focus on recent or specific time periods
- **Duplicate Management**: Identify and handle duplicate communications
- **Export Functions**: Generate reports for external analysis

## Support and Troubleshooting

### Common Issues
1. **Authentication Failures**: Check Azure AD permissions and user licenses
2. **Mailbox Access Denied**: Verify Full Access permissions to shared mailbox
3. **Performance Issues**: Monitor API rate limits and optimize queries
4. **Missing Emails**: Check mailbox retention policies and filters

### Support Contacts
- **Technical Support**: Contact your IT administrator
- **Application Issues**: Reference deployment logs and error tracking
- **Permission Issues**: Contact Office 365 administrator

## Development and Testing

### Local Development
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Code Quality
- TypeScript for type safety
- ESLint for code standards
- Prettier for code formatting
- Comprehensive test coverage

## Conclusion

The Email Dashboard provides a robust, secure, and efficient solution for managing TV schedule communications. With proper deployment and configuration, it enables multiple Office 365 users to collaboratively manage the TV.Schedule mailbox while maintaining security and providing valuable analytics for business operations.

The application is designed to scale with your organization's needs and can be easily maintained and updated as requirements evolve.