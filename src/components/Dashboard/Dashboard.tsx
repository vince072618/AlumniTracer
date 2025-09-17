import React, { useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import AlumniProfile from '../Profile/AlumniProfile';
import ActivityLogs from '../Profile/ActivityLogs';
import PasswordChangeForm from '../Profile/PasswordChangeForm';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <AlumniProfile />;
      case 'activity':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
            <ActivityLogs />
          </div>
        );
      case 'password':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
            <PasswordChangeForm onSuccess={() => setActiveTab('profile')} />
          </div>
        );
      default:
        return <AlumniProfile />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;