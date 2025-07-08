'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Mail, Shield, Users } from 'lucide-react';

export default function LoginComponent() {
  const { login, loading, error, clearError } = useAuth();

  const handleLogin = async () => {
    clearError();
    await login();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Mail className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Mailbox Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with your Microsoft account to access your emails
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center">
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Microsoft 365 Integration
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Connect to your Outlook mailbox to manage TV channel emails
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-900">Features:</h4>
                <ul className="mt-2 text-sm text-blue-800 space-y-1">
                  <li>• Categorize emails by TV supplier (BBC, ITV, etc.)</li>
                  <li>• Filter by channel and content type</li>
                  <li>• Advanced search and duplicate detection</li>
                  <li>• Export and reporting capabilities</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-green-900">Permissions Required:</h4>
                <ul className="mt-2 text-sm text-green-800 space-y-1">
                  <li>• Read your email messages</li>
                  <li>• Basic profile information</li>
                  <li>• Manage email categories (optional)</li>
                </ul>
              </div>
            </div>

            <div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in with Microsoft
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            This application requires Microsoft 365 authentication to access your Outlook mailbox.
            Your credentials are handled securely by Microsoft&apos;s authentication service.
          </p>
        </div>
      </div>
    </div>
  );
}