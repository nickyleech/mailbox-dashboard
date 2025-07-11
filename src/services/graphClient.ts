import { Client } from '@microsoft/microsoft-graph-client';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
// Remove unused import

export class MSALAuthenticationProvider implements AuthenticationProvider {
  private getTokenSilently: () => Promise<string>;

  constructor(getTokenSilently: () => Promise<string>) {
    this.getTokenSilently = getTokenSilently;
  }

  async getAccessToken(): Promise<string> {
    try {
      const token = await this.getTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }
}

export class GraphService {
  private graphClient: Client;

  constructor(authProvider: AuthenticationProvider) {
    this.graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }

  async getMe() {
    try {
      const user = await this.graphClient.api('/me').get();
      return user;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  async getMessages(options: {
    top?: number;
    skip?: number;
    search?: string;
    filter?: string;
    select?: string[];
    orderBy?: string;
    mailboxId?: string;
  } = {}) {
    try {
      // Default to shared mailbox if no mailboxId is specified
      const defaultMailboxId = 'TV.Schedule@pamediagroup.com';
      const mailboxId = options.mailboxId || defaultMailboxId;
      
      // Build the API endpoint based on mailbox
      const endpoint = mailboxId && mailboxId !== 'me' 
        ? `/users/${mailboxId}/messages`
        : '/me/messages';
      
      let request = this.graphClient.api(endpoint);

      if (options.top) {
        request = request.top(options.top);
      }

      if (options.skip) {
        request = request.skip(options.skip);
      }

      if (options.search) {
        request = request.search(options.search);
      }

      if (options.filter) {
        request = request.filter(options.filter);
      }

      if (options.select) {
        request = request.select(options.select);
      }

      if (options.orderBy) {
        request = request.orderby(options.orderBy);
      }

      const messages = await request.get();
      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  async getMessageById(messageId: string, mailboxId?: string) {
    try {
      const defaultMailboxId = 'TV.Schedule@pamediagroup.com';
      const selectedMailboxId = mailboxId || defaultMailboxId;
      const endpoint = selectedMailboxId && selectedMailboxId !== 'me' 
        ? `/users/${selectedMailboxId}/messages/${messageId}`
        : `/me/messages/${messageId}`;
      
      const message = await this.graphClient
        .api(endpoint)
        .get();
      return message;
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  async getMessageAttachments(messageId: string, mailboxId?: string) {
    try {
      const defaultMailboxId = 'TV.Schedule@pamediagroup.com';
      const selectedMailboxId = mailboxId || defaultMailboxId;
      const endpoint = selectedMailboxId && selectedMailboxId !== 'me' 
        ? `/users/${selectedMailboxId}/messages/${messageId}/attachments`
        : `/me/messages/${messageId}/attachments`;
      
      const attachments = await this.graphClient
        .api(endpoint)
        .get();
      return attachments;
    } catch (error) {
      console.error('Error getting message attachments:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string, mailboxId?: string) {
    try {
      const defaultMailboxId = 'TV.Schedule@pamediagroup.com';
      const selectedMailboxId = mailboxId || defaultMailboxId;
      const endpoint = selectedMailboxId && selectedMailboxId !== 'me' 
        ? `/users/${selectedMailboxId}/messages/${messageId}`
        : `/me/messages/${messageId}`;
      
      await this.graphClient
        .api(endpoint)
        .patch({
          isRead: true,
        });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  async flagMessage(messageId: string, flagged: boolean = true, mailboxId?: string) {
    try {
      const defaultMailboxId = 'TV.Schedule@pamediagroup.com';
      const selectedMailboxId = mailboxId || defaultMailboxId;
      const endpoint = selectedMailboxId && selectedMailboxId !== 'me' 
        ? `/users/${selectedMailboxId}/messages/${messageId}`
        : `/me/messages/${messageId}`;
      
      await this.graphClient
        .api(endpoint)
        .patch({
          flag: {
            flagStatus: flagged ? 'flagged' : 'notFlagged',
          },
        });
    } catch (error) {
      console.error('Error flagging message:', error);
      throw error;
    }
  }

  async createCategory(name: string, color: string) {
    try {
      await this.graphClient
        .api('/me/outlook/masterCategories')
        .post({
          displayName: name,
          color: color,
        });
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async assignCategoriesToMessage(messageId: string, categories: string[], mailboxId?: string) {
    try {
      const defaultMailboxId = 'TV.Schedule@pamediagroup.com';
      const selectedMailboxId = mailboxId || defaultMailboxId;
      const endpoint = selectedMailboxId && selectedMailboxId !== 'me' 
        ? `/users/${selectedMailboxId}/messages/${messageId}`
        : `/me/messages/${messageId}`;
      
      await this.graphClient
        .api(endpoint)
        .patch({
          categories: categories,
        });
    } catch (error) {
      console.error('Error assigning categories:', error);
      throw error;
    }
  }

  async getSharedMailboxes() {
    try {
      // Alternative approach: Get mailboxes from organization
      const orgResponse = await this.graphClient
        .api('/users')
        .filter('userType eq \'Member\' and accountEnabled eq true')
        .select(['id', 'displayName', 'userPrincipalName', 'userType'])
        .get();
      
      // Filter for mailboxes the user has access to
      const accessibleMailboxes = [];
      for (const user of orgResponse.value) {
        try {
          // Test access by trying to get mailbox settings
          await this.graphClient
            .api(`/users/${user.id}/mailboxSettings`)
            .get();
          accessibleMailboxes.push(user);
        } catch {
          // User doesn't have access to this mailbox
        }
      }
      
      return accessibleMailboxes;
    } catch (error) {
      console.error('Error getting shared mailboxes:', error);
      throw error;
    }
  }

  async getDelegatedMailboxes() {
    try {
      // Get mailboxes where the user has delegate permissions
      const response = await this.graphClient
        .api('/me/mailboxSettings/delegatesMeetingMessageDeliveryOptions')
        .get();
      
      return response.value || [];
    } catch (error) {
      console.error('Error getting delegated mailboxes:', error);
      throw error;
    }
  }
}