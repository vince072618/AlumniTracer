import React from 'react';
import { Users, UserCheck, UserX, TrendingUp, MapPin, Building, Shield, UserPlus, BarChart3 } from 'lucide-react';
import { DashboardStats } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats: DashboardStats = {
    totalAlumni: 1,
    employed: 1,
    unemployed: 1,
    recentGraduates: 1,
  };

  const recentAlumni = [
    { name: 'Maria Santos', course: 'Computer Science', year: 2023, status: 'Employed' },
    { name: 'John Dela Cruz', course: 'Business Admin', year: 2023, status: 'Looking for job' },
    { name: 'Sarah Johnson', course: 'Information Technology', year: 2022, status: 'Employed' },
    { name: 'Robert Kim', course: 'Engineering', year: 2023, status: 'Self-employed' },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Alumni Dashboard'}
          </h2>
          {user?.role === 'admin' && (
            <div className="flex items-center space-x-2 text-purple-600">
              <Shield size={20} />
              <span className="font-medium">Administrator View</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAlumni.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Employed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.employed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Seeking Employment</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unemployed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Graduates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentGraduates.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alumni</h3>
          <div className="space-y-4">
            {recentAlumni.map((alumni, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{alumni.name}</p>
                  <p className="text-sm text-gray-600">{alumni.course} • Class of {alumni.year}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alumni.status === 'Employed' 
                    ? 'bg-green-100 text-green-800'
                    : alumni.status === 'Self-employed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {alumni.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Rate by Course</h3>
          <div className="space-y-4">
            {[
              { course: 'Teachers Education', rate: 94 },
              { course: 'Business Administration', rate: 87 },
              { course: 'Information Technology', rate: 92 },
              { course: 'Accounting', rate: 85 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.course}</span>
                  <span className="text-sm text-gray-600">{item.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlumniDirectory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {user?.role === 'admin' ? 'Alumni Management' : 'Alumni Directory'}
        </h2>
        {user?.role === 'admin' && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Alumni
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search alumni..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Courses</option>
              <option>Teachers Educations</option>
              <option>Business Administration</option>
              <option>Information Technology</option>
            </select>
          </div>
          
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4" />
            <p>
              {user?.role === 'admin' 
                ? 'Alumni management system will be implemented here' 
                : 'Alumni directory feature will be implemented here'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = (title: string, icon: React.ReactNode) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-12 text-center">
          <div className="text-gray-400 mb-4">{icon}</div>
          <p className="text-gray-500 text-lg"></p>
          <p className="text-gray-400 text-sm mt-2"></p>
        </div>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'dashboard':
      return renderDashboard();
    case 'alumni':
      return renderAlumniDirectory();
    case 'registration':
      return renderComingSoon('User Registration Management', <UserPlus size={48} />);
    case 'employment':
      return renderComingSoon('Employment Status', <UserCheck size={48} />);
    case 'location':
      return renderComingSoon('Location Tracker', <MapPin size={48} />);
    case 'analytics':
      return renderComingSoon('Reports & Analytics', <BarChart3 size={48} />);
    case 'admin':
      return renderComingSoon('Admin Panel', <Shield size={48} />);
    case 'settings':
      return renderComingSoon('Settings', <Building size={48} />);
    default:
      return renderDashboard();
  }
};

export default DashboardContent;