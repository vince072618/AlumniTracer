import React, { useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import AlumniProfile from '../Profile/AlumniProfile';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <AlumniProfile />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;