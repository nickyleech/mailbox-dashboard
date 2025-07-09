# Email Dashboard - TV Schedule Mailbox Management System

## Overview

The Email Dashboard is a specialized web application designed to manage and analyze TV schedule-related emails from the shared mailbox `TV.Schedule@pamediagroup.com`. This application provides a comprehensive interface for media industry professionals to efficiently process, filter, and analyze incoming TV schedule communications from various suppliers and channels.

**Key Value Proposition:**
- Centralized management of TV schedule emails from multiple broadcasters
- Real-time analytics and reporting for media operations teams
- Secure multi-user access with Microsoft 365 integration
- Automated email categorization and duplicate detection
- Mobile-responsive design for access from any device

## Application Features

### 📧 Email Management
- **Real-time Email Access**: Direct integration with Office 365 to access the TV.Schedule mailbox
- **Intelligent Filtering**: Advanced filtering by supplier, channel, email type, attachments, and date ranges
- **Search Functionality**: Full-text search across subject, sender, and body content with boolean operators
- **Duplicate Detection**: Automatic identification and handling of duplicate emails
- **Email Categorization**: Automatic classification of emails into types (schedule, update, press, technical, marketing)
- **Email Preview**: Full email preview with attachments and HTML rendering
- **Bulk Actions**: Select multiple emails for batch operations
- **Mobile Optimization**: Responsive design for tablet and mobile access

### 📊 Analytics & Reporting
- **Dashboard Analytics**: Visual representation of email statistics and trends
- **Supplier Distribution**: Analysis of email volume by content suppliers
- **Channel Analytics**: Breakdown of emails by TV/radio channels
- **Peak Time Analysis**: Identification of busiest email periods
- **Response Time Tracking**: Monitoring of email response patterns
- **Seasonal Patterns**: Quarterly trend analysis for business planning
- **Export Capabilities**: CSV and Excel export for external analysis
- **Real-time Statistics**: Live email counts and filtering metrics
- **Visual Charts**: Interactive charts and graphs for data visualization

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
- **Session Management**: Automatic timeout and secure token handling
- **HTTPS Enforcement**: All connections secured with SSL/TLS
- **No Data Storage**: Email content remains in Microsoft 365 environment

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

## Multi-User Deployment Guide

### Team Access Overview

The Email Dashboard is designed for multiple users to simultaneously access and manage the shared TV.Schedule mailbox. This section provides detailed guidance on setting up and managing access for your team.

#### User Types and Permissions

**Primary Users (Full Access):**
- Media operations staff
- Schedule coordinators
- Content managers
- Production assistants

**Secondary Users (Read-Only):**
- Executives and managers
- External partners (with appropriate permissions)
- Temporary contractors

**Administrator Users:**
- IT administrators
- Application maintainers
- Security personnel

### Team Management Best Practices

#### 1. User Onboarding Process
```
1. Verify user has Office 365 license
2. Grant mailbox permissions via PowerShell
3. Add user to Azure AD security group (if using)
4. Test access with demo mode first
5. Provide training on application features
6. Document user access in team registry
```

#### 2. Permission Management
**Granular Access Control:**
- Use Azure AD groups for role-based access
- Implement just-in-time access for temporary users
- Regular access reviews and cleanup
- Automated permission reporting

#### 3. Concurrent Usage Considerations
**Performance Optimization:**
- Microsoft Graph API rate limiting applies per user
- Implement smart caching for frequently accessed data
- Load balancing for high-traffic periods
- Real-time user activity monitoring

#### 4. Collaboration Features
**Multi-User Workflows:**
- Shared filtering and search configurations
- Team-based email categorization
- Collaborative response management
- Shared analytics and reporting

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

**Step-by-Step User Setup:**

1. **Verify Office 365 License**
   ```powershell
   Get-MsolUser -UserPrincipalName "user@pamediagroup.com" | Select-Object DisplayName, IsLicensed, Licenses
   ```

2. **Grant Mailbox Permissions**
   ```powershell
   # Full Access (recommended for primary users)
   Add-MailboxPermission -Identity "TV.Schedule@pamediagroup.com" -User "user@pamediagroup.com" -AccessRights FullAccess
   
   # Read-Only Access (for secondary users)
   Add-MailboxPermission -Identity "TV.Schedule@pamediagroup.com" -User "user@pamediagroup.com" -AccessRights ReadPermission
   
   # Verify permissions
   Get-MailboxPermission -Identity "TV.Schedule@pamediagroup.com" | Where-Object {$_.User -eq "user@pamediagroup.com"}
   ```

3. **Optional: Create Azure AD Security Group**
   ```powershell
   # Create group for application users
   New-AzureADGroup -DisplayName "TV Schedule Dashboard Users" -MailEnabled $false -SecurityEnabled $true -MailNickName "TVScheduleUsers"
   
   # Add users to group
   Add-AzureADGroupMember -ObjectId "group-object-id" -RefObjectId "user-object-id"
   ```

4. **Test User Access**
   - User should test with demo mode first
   - Verify authentication works correctly
   - Check mailbox access permissions
   - Validate application functionality

**Removing User Access:**
```powershell
# Remove mailbox permissions
Remove-MailboxPermission -Identity "TV.Schedule@pamediagroup.com" -User "user@pamediagroup.com" -AccessRights FullAccess -Confirm:$false

# Remove from Azure AD group (if using)
Remove-AzureADGroupMember -ObjectId "group-object-id" -MemberId "user-object-id"
```

**Bulk User Management:**
```powershell
# Import users from CSV
$users = Import-Csv "users.csv"
foreach ($user in $users) {
    Add-MailboxPermission -Identity "TV.Schedule@pamediagroup.com" -User $user.Email -AccessRights FullAccess
    Write-Host "Added access for: $($user.Email)"
}
```

#### 3. Monitoring and Maintenance

**Application Monitoring:**
- Set up application performance monitoring
- Configure error tracking and logging
- Monitor authentication success/failure rates
- Track API usage and rate limits

**Multi-User Monitoring:**
```powershell
# Monitor active users
Get-MailboxPermission -Identity "TV.Schedule@pamediagroup.com" | Where-Object {$_.AccessRights -eq "FullAccess" -and $_.IsInherited -eq $false}

# Check last login activity
Get-MsolUser -All | Select-Object DisplayName, UserPrincipalName, LastLogonTime | Where-Object {$_.LastLogonTime -gt (Get-Date).AddDays(-30)}

# Monitor API usage by user
# (Requires Azure AD Premium P1 or P2 for detailed logs)
```

**Regular Maintenance:**
- Update dependencies monthly
- Monitor Microsoft Graph API changes
- Review and update permissions as needed
- Backup configuration and settings
- Quarterly user access reviews
- Performance optimization based on usage patterns

### Production Deployment Checklist

#### Pre-Deployment
- [ ] Azure AD application registered and configured
- [ ] Environment variables configured in deployment platform
- [ ] SSL/TLS certificate configured
- [ ] Domain name configured and DNS updated
- [ ] User permissions tested in development environment
- [ ] Load testing completed for expected user count
- [ ] Backup and disaster recovery plan in place

#### Post-Deployment
- [ ] Application health monitoring configured
- [ ] User access tested and validated
- [ ] Error tracking and alerting configured
- [ ] Performance monitoring baseline established
- [ ] User training materials distributed
- [ ] Support procedures documented
- [ ] First-week intensive monitoring scheduled

#### Ongoing Operations
- [ ] Weekly user access reviews
- [ ] Monthly performance reports
- [ ] Quarterly security assessments
- [ ] Annual disaster recovery testing
- [ ] Continuous dependency updates
- [ ] User feedback collection and analysis

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

## Scaling and Performance for Teams

### Concurrent User Limits

**Microsoft Graph API Limits:**
- 10,000 requests per 10 minutes per application
- 4,000 requests per 10 minutes per user
- Automatic throttling and retry logic implemented

**Recommended Team Sizes:**
- **Small Team (1-5 users)**: No additional configuration needed
- **Medium Team (6-15 users)**: Consider implementing user-specific caching
- **Large Team (16+ users)**: Implement advanced caching and load balancing

### Performance Optimization

**Caching Strategy:**
```javascript
// Email data cached for 5 minutes per user
// Filter results cached for 2 minutes
// Analytics data cached for 15 minutes
// User preferences cached for 24 hours
```

**Load Balancing:**
- Deploy multiple instances behind a load balancer
- Use Redis for shared session storage
- Implement circuit breakers for API failures
- Monitor response times and error rates

**Database Considerations:**
- Consider Azure Cosmos DB for user preferences
- Implement local storage for temporary data
- Use IndexedDB for offline capabilities
- Regular cleanup of cached data

### Team Collaboration Features

**Shared Workspaces:**
- Team-specific filter configurations
- Shared email categorization rules
- Collaborative response templates
- Group analytics and reporting

**Real-Time Updates:**
- Live email count updates
- Collaborative filtering notifications
- Team activity indicators
- Shared status updates

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

#### Single User Issues
1. **Authentication Failures**: Check Azure AD permissions and user licenses
2. **Mailbox Access Denied**: Verify Full Access permissions to shared mailbox
3. **Performance Issues**: Monitor API rate limits and optimize queries
4. **Missing Emails**: Check mailbox retention policies and filters

#### Multi-User Issues
5. **Slow Performance with Multiple Users**:
   - Check concurrent user count
   - Monitor API rate limiting
   - Implement user-specific caching
   - Consider load balancing

6. **Inconsistent Data Between Users**:
   - Clear browser cache for all users
   - Check for different time zones
   - Verify synchronized permissions
   - Restart application if needed

7. **User Access Conflicts**:
   - Review mailbox permissions
   - Check Azure AD group memberships
   - Validate license assignments
   - Monitor audit logs for conflicts

8. **API Rate Limit Exceeded**:
   - Implement exponential backoff
   - Stagger user login times
   - Use cached data when possible
   - Monitor usage patterns

#### Troubleshooting Commands
```powershell
# Check user permissions
Get-MailboxPermission -Identity "TV.Schedule@pamediagroup.com" | Format-Table User, AccessRights, IsInherited

# Verify Azure AD application permissions
Get-AzureADApplication -ObjectId "your-app-id" | Get-AzureADApplicationKeyCredential

# Monitor API usage (requires Azure AD Premium)
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-1) -EndDate (Get-Date) -Operations "Microsoft Graph API"

# Check license status for multiple users
Get-MsolUser -All | Where-Object {$_.isLicensed -eq $true} | Select-Object UserPrincipalName, Licenses
```

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