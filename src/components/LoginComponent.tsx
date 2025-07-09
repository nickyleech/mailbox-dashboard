'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 shadow-lg mb-6">
            <div className="w-8 h-8 bg-white rounded"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mailbox Dashboard
          </h1>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-900 shadow-sm border border-gray-300">
            TV.Schedule@pamediagroup.com
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-300 sm:rounded-2xl sm:px-10">
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
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                    <div className="h-4 w-4 bg-gray-900 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    TV Schedule Emails Only
                  </h3>
                  <p className="mt-1 text-sm text-gray-800">
                    This application is for TV Schedule emails only, it will not work with personal emails.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-300">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 shadow-lg mb-4">
                  <div className="h-6 w-6 bg-white rounded"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Shared Mailbox Access
                </h3>
                <p className="text-sm text-gray-600">
                  Connect to the dedicated TV Schedule shared mailbox
                </p>
              </div>
            </div>


            <div className="space-y-4">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-semibold rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign in with Microsoft
                  </div>
                )}
              </button>
              
              {onDemoMode && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                  </div>
                </div>
              )}
              
              {onDemoMode && (
                <button
                  onClick={onDemoMode}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-semibold rounded-xl text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex items-center">
                    Try Demo Mode
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-300 shadow-sm">
            <div className="h-4 w-4 bg-gray-900 rounded-full mr-2"></div>
            <p className="text-xs text-gray-600 font-medium">
              Secured by Microsoft 365 Authentication
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500 max-w-sm mx-auto">
            Your credentials are handled securely by Microsoft&apos;s authentication service.
          </p>
        </div>
      </div>
    </div>
  );
}