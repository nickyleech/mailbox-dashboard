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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg mb-6">
            <span className="text-2xl">📧</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mailbox Dashboard
          </h1>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-sm">
            📧 TV.Schedule@pamediagroup.com
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-xl border border-white/20 sm:rounded-2xl sm:px-10">
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
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-amber-900">
                    TV Schedule Emails Only
                  </h3>
                  <p className="mt-1 text-sm text-amber-800">
                    This application is for TV Schedule emails only, it will not work with personal emails.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg mb-4">
                  <Users className="h-6 w-6 text-white" />
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
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-5 w-5 mr-3" />
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
                  className="w-full flex justify-center py-3 px-4 border border-blue-200 text-sm font-semibold rounded-xl text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex items-center">
                    <Play className="h-5 w-5 mr-3" />
                    🎯 Try Demo Mode
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm">
            <Shield className="h-4 w-4 text-gray-500 mr-2" />
            <p className="text-xs text-gray-600 font-medium">
              Secured by Microsoft 365 Authentication
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500 max-w-sm mx-auto">
            Your credentials are handled securely by Microsoft's authentication service.
          </p>
        </div>
      </div>
    </div>
  );
}