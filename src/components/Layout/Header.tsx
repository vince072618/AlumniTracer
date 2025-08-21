import React from 'react';
import { LogOut, User, Bell, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-blue-900">NBSC Alumni Portal</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            user?.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
          }`}>
            {user?.role === 'admin' ? (
              <Shield size={16} className="text-white" />
            ) : (
              <GraduationCap size={16} className="text-white" />
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin' ? 'Administrator' : 'Alumni'} • {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;