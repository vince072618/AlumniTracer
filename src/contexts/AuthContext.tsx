import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { User, AuthState, LoginData, RegisterData } from '../types';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleAuthUser(session.user);
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          handleAuthUser(session.user);
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (supabaseUser: SupabaseUser) => {
    try {
      // Get user profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }

      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        role: profile?.role || 'alumni',
        graduationYear: profile?.graduation_year || new Date().getFullYear(),
        course: profile?.course || '',
        currentJob: profile?.current_job || '',
        company: profile?.company || '',
        location: profile?.location || '',
        phoneNumber: profile?.phone_number || '',
        isVerified: supabaseUser.email_confirmed_at !== null,
        createdAt: new Date(supabaseUser.created_at),
      };

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error handling auth user:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (data: LoginData): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // If expectedRole is provided, verify the user's role matches
      if (data.expectedRole) {
        // Get the current session to access user data
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile to check role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user role:', profileError);
            throw new Error('Unable to verify account type');
          }

          if (profile?.role !== data.expectedRole) {
            // Sign out the user since they logged in with wrong role
            await supabase.auth.signOut();
            throw new Error(`Account role mismatch: expected ${data.expectedRole}, got ${profile?.role}`);
          }
        }
      }
      // User state will be updated by the auth state change listener
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
            graduation_year: data.graduationYear,
            course: data.course,
            phone_number: data.phoneNumber,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw here as the user is already created
        }
      }

      // Always set loading to false after registration
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      // If no session, user needs to confirm email
      if (!authData.session) {
        // Registration successful, but email confirmation required
        return;
      }

      // User state will be updated by the auth state change listener
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    supabase.auth.signOut().then(() => {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};