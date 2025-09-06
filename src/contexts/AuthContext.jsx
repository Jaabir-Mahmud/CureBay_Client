import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { syncUserProfile, validateUserSession, forceSyncUser } from "../services/userSyncService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        await handleUserLogin(firebaseUser);
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to handle user login and sync
  const handleUserLogin = async (firebaseUser) => {
    try {
      // Sync user profile with backend
      const userProfile = await syncUserProfile(firebaseUser);
      
      if (userProfile) {
        setProfile(userProfile);
        
        // Check if user is active
        if (userProfile.isActive === false) {
          console.log('User account is inactive, logging out...');
          setProfile(null);
          await signOut(auth);
          if (typeof window !== 'undefined') {
            toast.error('Your account has been deactivated by an administrator. You have been logged out.', {
              duration: 6000,
              position: 'top-center',
            });
          }
          return;
        }
      } else {
        // If sync failed, try to force sync
        const syncResult = await forceSyncUser(firebaseUser);
        if (syncResult.success) {
          setProfile(syncResult.user);
          toast.success('Account synchronized successfully!', {
            duration: 4000,
            position: 'top-center',
          });
        } else {
          // If force sync also failed, log out
          setProfile(null);
          await signOut(auth);
          toast.error('Failed to synchronize account. Please log in again.', {
            duration: 4000,
            position: 'top-center',
          });
        }
      }
    } catch (error) {
      console.error('Error handling user login:', error);
      setProfile(null);
    }
  };

  // Periodic session validation with improved sync (every 2 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        // Force token refresh to ensure we have a valid token
        const token = await user.getIdToken(true);
        
        const validationResult = await validateUserSession(user);
        if (!validationResult.isValid) {
          console.log('User session invalid:', validationResult.reason);
          setProfile(null);
          await signOut(auth);
          
          if (validationResult.reason === 'User account is inactive') {
            toast.error('Your account has been deactivated by an administrator. You have been logged out.', {
              duration: 6000,
              position: 'top-center',
            });
          } else {
            toast.error('Session expired. Please log in again.', {
              duration: 4000,
              position: 'top-center',
            });
          }
        } else if (validationResult.user) {
          // Update profile with latest data
          setProfile(validationResult.user);
        }
      } catch (error) {
        console.error('Error during session validation:', error);
        // If token refresh fails, sign out the user
        setProfile(null);
        await signOut(auth);
        toast.error('Session expired. Please log in again.', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }, 2 * 60 * 1000); // 2 minutes for more responsive updates

    return () => clearInterval(interval);
  }, [user]);

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Function to validate user session (can be called from components)
  const validateSession = async () => {
    if (user) {
      const validationResult = await validateUserSession(user);
      if (!validationResult.isValid) {
        setProfile(null);
        await signOut(auth);
        
        if (typeof window !== 'undefined') {
          if (validationResult.reason === 'User account is inactive') {
            toast.error('Your account has been deactivated by an administrator. You have been logged out.', {
              duration: 6000,
              position: 'top-center',
            });
          } else {
            toast.error('Session expired. Please log in again.', {
              duration: 4000,
              position: 'top-center',
            });
          }
        }
      } else if (validationResult.user) {
        setProfile(validationResult.user);
      }
    }
  };

  // Function to force sync user data
  const forceSync = async () => {
    if (user) {
      const syncResult = await forceSyncUser(user);
      if (syncResult.success) {
        setProfile(syncResult.user);
        toast.success('Account synchronized successfully!', {
          duration: 4000,
          position: 'top-center',
        });
      } else {
        toast.error('Failed to synchronize account.', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, validateSession, forceSync }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);