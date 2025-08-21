import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginData, UserRole } from '../../types';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
    expectedRole: 'alumni',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(formData);
    } catch (error) {
      let errorMessage = 'Invalid email or password';
      
      if (error instanceof Error) {
        if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before signing in.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('role mismatch')) {
          errorMessage = `This account is not registered as ${formData.expectedRole === 'admin' ? 'an administrator' : 'an alumni'}. Please select the correct account type.`;
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors({ email: errorMessage });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to access your alumni portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.expectedRole === 'alumni' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="expectedRole"
                value="alumni"
                checked={formData.expectedRole === 'alumni'}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedRole: e.target.value as UserRole }))}
                className="sr-only"
              />
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Alumni</p>
                  <p className="text-sm text-gray-600">Graduate access</p>
                </div>
              </div>
            </label>
            
            <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.expectedRole === 'admin' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="expectedRole"
                value="admin"
                checked={formData.expectedRole === 'admin'}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedRole: e.target.value as UserRole }))}
                className="sr-only"
              />
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Administrator</p>
                  <p className="text-sm text-gray-600">Admin access</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up here
          </button>
        </p>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Important:</p>
          <div className="text-xs space-y-1">
            <p><strong>New users:</strong> You must confirm your email before signing in</p>
            <p><strong>Check spam:</strong> Confirmation emails may go to spam folder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;