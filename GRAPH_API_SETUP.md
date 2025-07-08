# Microsoft Graph API Integration Setup

This guide explains how to set up Microsoft Graph API integration for the Mailbox Dashboard.

## Azure App Registration

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: `Mailbox Dashboard`
   - **Supported account types**: `Accounts in any organizational directory (Any Azure AD directory - Multitenant)`
   - **Redirect URI**: `Single-page application (SPA)` - `http://localhost:3000`

5. Click **Register**

## Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Choose **Microsoft Graph** > **Delegated permissions**
4. Add these permissions:
   - `User.Read` (Basic user profile)
   - `Mail.Read` (Read user mail)
   - `Mail.ReadWrite` (Read and write user mail - for categories)

5. Click **Add permissions**
6. Click **Grant admin consent** (if you're an admin)

## Configure Authentication

1. Go to **Authentication** in your app registration
2. Under **Platform configurations**, ensure you have:
   - **Single-page application** with redirect URI `http://localhost:3000`
3. Under **Implicit grant and hybrid flows**, ensure:
   - **Access tokens** is checked
   - **ID tokens** is checked

## Environment Configuration

1. Copy `.env.local.example` to `.env.local`
2. Set your Azure client ID:
   ```
   NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-from-azure-portal
   ```

## Features Implemented

### Authentication
- MSAL (Microsoft Authentication Library) integration
- Popup-based authentication flow
- Automatic token refresh
- Secure token storage

### Email Fetching
- Fetch emails from Microsoft Graph API
- Real-time email updates
- Pagination support
- Advanced filtering and search

### Email Processing
- Automatic supplier identification from email domains
- Channel identification from email subjects
- Email type classification (schedule, update, press, technical, marketing)
- Duplicate detection

### UI Features
- Login/logout functionality
- Toggle between live and mock data
- Real-time email refresh
- Error handling and loading states

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click **Sign in with Microsoft**
4. Grant the required permissions
5. The dashboard will load with your real Outlook emails

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure your redirect URI is correctly configured in Azure
- Check that you're using the right client ID

**2. Permission Errors**
- Verify all required permissions are granted
- Check if admin consent is required for your organization

**3. Token Refresh Issues**
- Clear browser cache and cookies
- Check if the app registration is still active

**4. No Emails Loading**
- Verify the user has emails in their mailbox
- Check browser console for API errors
- Ensure the user has the required permissions

### Debug Mode

To enable debug mode, add this to your `.env.local`:
```
NEXT_PUBLIC_DEBUG=true
```

This will show additional logging information in the browser console.

## Production Deployment

Before deploying to production:

1. Update redirect URIs in Azure to include your production domain
2. Configure appropriate environment variables
3. Set up proper error monitoring
4. Consider implementing refresh token rotation
5. Add rate limiting to prevent API quota exhaustion

## Security Considerations

- Never commit your client ID or secrets to version control
- Use environment variables for all sensitive configuration
- Implement proper error handling to avoid exposing sensitive information
- Consider implementing additional security measures like PKCE flow
- Monitor API usage to detect unusual patterns

## Support

For issues with the Graph API integration:
1. Check the browser console for error messages
2. Verify your Azure app registration configuration
3. Review the Microsoft Graph API documentation
4. Check the MSAL.js documentation for authentication issues