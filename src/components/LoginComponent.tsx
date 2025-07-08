'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Shield, Users, Play } from 'lucide-react';

interface LoginComponentProps {
  onDemoMode?: () => void;
}

export default function LoginComponent({ onDemoMode }: LoginComponentProps) {
  const { login, loading, error, clearError } = useAuth();

  const handleLogin = async () => {
    clearError();
    await login();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Mailbox Dashboard
        </h2>
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            📧 TV.Schedule@pamediagroup.com
          </span>
        </div>
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-900">
                    TV Schedule Emails Only
                  </h3>
                  <p className="mt-1 text-sm text-yellow-800">
                    This application is for TV Schedule emails only, it will not work with personal emails.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center">
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Shared Mailbox Access
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Connect to the dedicated TV Schedule shared mailbox
                </p>
              </div>
            </div>


            <div className="space-y-3">
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
              
              {onDemoMode && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
              )}
              
              {onDemoMode && (
                <button
                  onClick={onDemoMode}
                  className="w-full flex justify-center py-2 px-4 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    🎯 Try Demo Mode
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            This application requires Microsoft 365 authentication to access the shared mailbox.
            Your credentials are handled securely by Microsoft&apos;s authentication service.
          </p>
        </div>
      </div>
    </div>
  );
}