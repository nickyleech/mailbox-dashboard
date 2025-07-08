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
  } = {}) {
    try {
      let request = this.graphClient.api('/me/messages');

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

  async getMessageById(messageId: string) {
    try {
      const message = await this.graphClient
        .api(`/me/messages/${messageId}`)
        .get();
      return message;
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  async getMessageAttachments(messageId: string) {
    try {
      const attachments = await this.graphClient
        .api(`/me/messages/${messageId}/attachments`)
        .get();
      return attachments;
    } catch (error) {
      console.error('Error getting message attachments:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string) {
    try {
      await this.graphClient
        .api(`/me/messages/${messageId}`)
        .patch({
          isRead: true,
        });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  async flagMessage(messageId: string, flagged: boolean = true) {
    try {
      await this.graphClient
        .api(`/me/messages/${messageId}`)
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

  async assignCategoriesToMessage(messageId: string, categories: string[]) {
    try {
      await this.graphClient
        .api(`/me/messages/${messageId}`)
        .patch({
          categories: categories,
        });
    } catch (error) {
      console.error('Error assigning categories:', error);
      throw error;
    }
  }
}