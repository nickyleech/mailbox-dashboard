# Microsoft Graph API Integration Setup

This guide explains how to set up Microsoft Graph API integration for the Mailbox Dashboard.

## 🔑 **Who Can Do This Setup?**

### **Individual Users (Personal/Small Business)**
- ✅ **Anyone with a Microsoft 365 personal account** can create their own app registration
- ✅ **Small business owners** with admin rights to their own tenant
- ✅ **Developers** with personal Microsoft accounts

### **Corporate/Enterprise Users**
- ❌ **Regular employees** typically CANNOT create app registrations
- ❌ **Standard users** don't have permission to register apps in corporate tenants
- ✅ **IT Administrators** or **Global Admins** can create app registrations
- ✅ **Application Developers** with delegated permissions from IT

### **Alternative for Corporate Users**
If you're a corporate user without admin rights:
1. **Request IT Support**: Ask your IT department to create the app registration
2. **Use Personal Account**: Test with your personal Microsoft account
3. **Demo Mode**: Use the built-in mock data for demonstration

---

## 📋 **Prerequisites**

### **For Individual Setup:**
- Microsoft 365 personal account OR
- Azure subscription (free tier available)
- Basic understanding of web applications

### **For Corporate Setup:**
- Azure Active Directory admin permissions
- Approval from IT security team
- Understanding of your organization's policies

---

## 🚀 **Step-by-Step Setup Guide**

### **Step 1: Access Azure Portal**

1. **Go to**: [Azure Portal](https://portal.azure.com)
2. **Sign in** with your Microsoft account
3. **Verify access**: You should see the Azure dashboard

**❗ If you see "Access Denied"**: You don't have permission to create app registrations. Contact your IT administrator.

### **Step 2: Navigate to App Registrations**

1. **Click**: "Azure Active Directory" (or search for it)
2. **Left sidebar**: Click "App registrations"
3. **Check permissions**: If you can't see "New registration" button, you need admin permissions

### **Step 3: Create New App Registration**

1. **Click**: "New registration"
2. **Fill in details**:
   ```
   Name: Mailbox Dashboard
   Supported account types: 
   - For personal use: "Accounts in this organizational directory only"
   - For broader access: "Accounts in any organizational directory (Any Azure AD directory - Multitenant)"
   
   Redirect URI: 
   - Type: Single-page application (SPA)
   - URL: http://localhost:3000
   ```
3. **Click**: "Register"

### **Step 4: Configure API Permissions**

1. **In your app**: Go to "API permissions"
2. **Click**: "Add a permission"
3. **Choose**: "Microsoft Graph"
4. **Select**: "Delegated permissions"
5. **Add these permissions**:
   - `User.Read` - Basic user profile information
   - `Mail.Read` - Read user email messages
   - `Mail.ReadWrite` - Read and write user mail (for categories)

6. **Click**: "Add permissions"

### **Step 5: Grant Consent**

**For Personal/Small Business:**
- **Click**: "Grant admin consent for [Your Directory]"
- **Confirm**: Click "Yes"

**For Corporate Users:**
- **Admin consent required**: Your IT admin must approve these permissions
- **Alternative**: Users can consent individually when they first use the app

### **Step 6: Configure Authentication**

1. **Go to**: "Authentication"
2. **Under "Platform configurations"**:
   - Ensure "Single-page application" is listed
   - Redirect URI should be: `http://localhost:3000`
3. **Under "Implicit grant and hybrid flows"**:
   - ✅ Check "Access tokens (used for implicit flows)"
   - ✅ Check "ID tokens (used for implicit and hybrid flows)"

### **Step 7: Get Your Client ID**

1. **Go to**: "Overview" tab
2. **Copy**: "Application (client) ID"
3. **Save this**: You'll need it for the next step

---

## 🔧 **Environment Configuration**

### **Step 1: Create Environment File**

```bash
# In your project root
cp .env.local.example .env.local
```

### **Step 2: Add Your Client ID**

```bash
# .env.local
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-from-azure-portal
NEXT_PUBLIC_AZURE_TENANT_ID=common
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
```

**⚠️ Important**: 
- Replace `your-client-id-from-azure-portal` with your actual client ID
- Use `common` for multi-tenant, or your specific tenant ID for single-tenant
- Never commit `.env.local` to version control

---

## 🧪 **Testing the Setup**

### **Step 1: Start Development Server**

```bash
npm run dev
```

### **Step 2: Test Authentication**

1. **Open**: `http://localhost:3000`
2. **Click**: "Sign in with Microsoft"
3. **Expected flow**:
   - Popup window opens
   - Microsoft login page appears
   - You sign in with your credentials
   - Permission consent screen (if not pre-approved)
   - Dashboard loads with your real emails

### **Step 3: Verify Functionality**

- ✅ You should see your actual Outlook emails
- ✅ Supplier categorization should work
- ✅ Search and filtering should work
- ✅ Toggle between "Live Data" and "Mock Data"

---

## 🚨 **Common Issues & Solutions**

### **"Access Denied" When Creating App Registration**

**Problem**: You don't have permission to register applications
**Solutions**:
1. **Contact IT**: Ask your IT administrator to create the app registration
2. **Use Personal Account**: Sign up for a free Microsoft 365 personal account
3. **Request Permission**: Ask for "Application Developer" role in your organization

### **"Admin Consent Required" Error**

**Problem**: Your organization requires admin approval for app permissions
**Solutions**:
1. **Contact IT**: Ask your IT admin to pre-approve the permissions
2. **Use Personal Account**: Test with a personal Microsoft account
3. **Individual Consent**: Some organizations allow individual user consent

### **"CORS Error" or "Redirect URI Mismatch"**

**Problem**: Authentication fails due to redirect URI issues
**Solutions**:
1. **Check Redirect URI**: Ensure it's exactly `http://localhost:3000`
2. **Check Platform Type**: Must be "Single-page application (SPA)"
3. **Check Port**: Ensure your dev server is running on port 3000

### **"No Emails Loading"**

**Problem**: Authentication succeeds but no emails appear
**Solutions**:
1. **Check Permissions**: Ensure `Mail.Read` permission is granted
2. **Check Mailbox**: Verify you have emails in your Outlook
3. **Check Console**: Look for API errors in browser developer tools
4. **Try Mock Data**: Toggle to "Mock Data" to test the UI

### **"Token Refresh Failed"**

**Problem**: App works initially but fails after some time
**Solutions**:
1. **Clear Cache**: Clear browser cache and cookies
2. **Re-authenticate**: Log out and log back in
3. **Check App Status**: Verify the app registration is still active

---

## 🏢 **Corporate Deployment Considerations**

### **For IT Administrators**

**Security Review Checklist**:
- ✅ Review requested permissions (`User.Read`, `Mail.Read`, `Mail.ReadWrite`)
- ✅ Verify application publisher and purpose
- ✅ Check redirect URIs are appropriate
- ✅ Review data handling and privacy policies
- ✅ Consider organizational policies for third-party app access

**Deployment Options**:
1. **Enterprise App Gallery**: Add to your organization's app gallery
2. **Conditional Access**: Apply conditional access policies
3. **User Assignment**: Restrict to specific users/groups
4. **Monitoring**: Enable sign-in and usage monitoring

### **For Developers**

**Enterprise Integration**:
- Use organization-specific tenant ID instead of "common"
- Implement proper error handling for corporate policies
- Consider single sign-on (SSO) integration
- Add audit logging for compliance

---

## 🌐 **Production Deployment**

### **Step 1: Update Redirect URIs**

1. **Go to**: Azure Portal > Your App Registration > Authentication
2. **Add production URIs**:
   ```
   https://your-production-domain.com
   https://your-production-domain.com/callback
   ```
3. **Update environment variables**:
   ```
   NEXT_PUBLIC_AZURE_REDIRECT_URI=https://your-production-domain.com
   ```

### **Step 2: Security Hardening**

- **Enable HTTPS**: Ensure all communication is encrypted
- **Content Security Policy**: Implement CSP headers
- **Rate Limiting**: Prevent API abuse
- **Error Handling**: Don't expose sensitive information in errors
- **Logging**: Implement comprehensive logging for security monitoring

### **Step 3: Monitoring & Maintenance**

- **API Quotas**: Monitor Microsoft Graph API usage
- **Token Rotation**: Implement proper token refresh handling
- **Health Checks**: Monitor authentication endpoints
- **User Feedback**: Implement feedback mechanism for auth issues

---

## 🎯 **Quick Start for Different User Types**

### **Personal/Small Business Users**
1. Sign up for free Azure account
2. Follow full setup guide above
3. Use personal Microsoft 365 account
4. Test with your own emails

### **Corporate Users (No Admin Rights)**
1. **Option A**: Ask IT to create app registration
2. **Option B**: Use personal Microsoft account for testing
3. **Option C**: Use demo mode with mock data

### **IT Administrators**
1. Review security implications
2. Create app registration in corporate tenant
3. Configure appropriate permissions and policies
4. Deploy to users with proper documentation

### **Developers**
1. Create personal development app registration
2. Test with personal account
3. Prepare enterprise deployment package
4. Provide documentation for IT approval

---

## 📚 **Additional Resources**

### **Microsoft Documentation**
- [Microsoft Graph API Overview](https://docs.microsoft.com/en-us/graph/overview)
- [MSAL.js Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications)
- [App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

### **Troubleshooting Resources**
- [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) - Test API calls
- [Azure AD App Registration Troubleshooting](https://docs.microsoft.com/en-us/azure/active-directory/develop/troubleshoot-app-registration)
- [MSAL.js Error Handling](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-handling-exceptions)

### **Security Best Practices**
- [Microsoft Identity Platform Security](https://docs.microsoft.com/en-us/azure/active-directory/develop/security-best-practices)
- [OAuth 2.0 and OpenID Connect](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols)

---

## 🔍 **FAQ**

**Q: Do I need to pay for Azure to use this?**
A: No, app registrations are free. You only pay for Azure resources if you use them.

**Q: Can I use this with Gmail or other email providers?**
A: No, this is specifically for Microsoft 365/Outlook emails via Microsoft Graph API.

**Q: What if my organization blocks app registrations?**
A: Contact your IT administrator. They can create the registration or grant you permissions.

**Q: Is my email data secure?**
A: Yes, authentication is handled by Microsoft's secure infrastructure. The app only accesses what you explicitly permit.

**Q: Can I use this for multiple users?**
A: Yes, but each user needs to authenticate individually. Consider enterprise deployment for multiple users.

---

## 📞 **Support**

For issues with the Graph API integration:

1. **Check browser console** for error messages
2. **Verify Azure app registration** configuration
3. **Review Microsoft Graph API documentation**
4. **Check MSAL.js documentation** for authentication issues
5. **Contact your IT administrator** for corporate deployment issues

**Remember**: Most authentication issues are related to app registration configuration or permissions!