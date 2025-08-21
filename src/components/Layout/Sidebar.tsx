import React from 'react';
import { Home, Users, BarChart3, Settings, UserCheck, MapPin, Shield, UserPlus, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const alumniMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'alumni', label: 'Alumni Directory', icon: Users },
    { id: 'employment', label: 'Employment Status', icon: UserCheck },
    { id: 'location', label: 'Location Tracker', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'alumni', label: 'Alumni Management', icon: Users },
    { id: 'registration', label: 'User Registration', icon: UserPlus },
    { id: 'employment', label: 'Employment Tracking', icon: UserCheck },
    { id: 'location', label: 'Location Analytics', icon: MapPin },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'admin', label: 'Admin Panel', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : alumniMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          user?.role === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {user?.role === 'admin' ? (
            <>
              <Shield size={12} className="mr-1" />
              Administrator
            </>
          ) : (
            <>
              <GraduationCap size={12} className="mr-1" />
              Alumni
            </>
          )}
        </div>
      </div>
      <nav className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;