import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";

// Utility function to sanitize user inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove potentially dangerous characters
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Utility function to validate URLs
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Utility function to sanitize profile picture URL
const sanitizeProfilePictureUrl = (url) => {
  if (!url) return null;
  
  // If it's a relative path, construct the full URL
  if (url.startsWith('/uploads/')) {
    return `${window.location.origin}${url}`;
  }
  
  // Validate external URLs
  if (isValidUrl(url)) {
    return url;
  }
  
  // Return null for invalid URLs
  return null;
};

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
        await checkUserProfile(firebaseUser);
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to check user profile with enhanced security
  const checkUserProfile = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      // Use relative URL as Vite proxy should handle the routing
      const res = await fetch('/api/users/me', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Security-Policy': "default-src 'self'"
        },
        credentials: 'same-origin'
      });
      
      if (res.ok) {
        try {
          const data = await res.json();
          // Sanitize profile data
          const sanitizedData = {
            ...data,
            name: sanitizeInput(data.name),
            email: sanitizeInput(data.email),
            username: sanitizeInput(data.username),
            phone: data.phone ? sanitizeInput(data.phone) : null,
            address: data.address ? sanitizeInput(data.address) : null,
            profilePicture: sanitizeProfilePictureUrl(data.profilePicture)
          };
          
          setProfile(sanitizedData);
          
          // Check if user is active
          if (sanitizedData.isActive === false) {
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
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          // Handle case where response is not valid JSON
          setProfile(null);
          return;
        }
      } else if (res.status === 404) {
        // User not found in database - they may have been deleted or might be a new user
        console.log('User not found in database');
        
        // Check if this might be a new user by looking at Firebase user metadata
        // If creation time is very recent, it might be a new user still being processed
        const creationTime = new Date(firebaseUser.metadata.creationTime).getTime();
        const now = new Date().getTime();
        const timeDiff = now - creationTime;
        
        // If user was created less than 10 seconds ago, wait a bit and try again
        if (timeDiff < 10000) {
          console.log('New user detected, waiting for profile creation...');
          // Try again after a short delay
          setTimeout(() => {
            checkUserProfile(firebaseUser);
          }, 2000);
          return;
        }
        
        // If it's been longer, treat as deleted user
        console.log('User account appears to be deleted, logging out...');
        setProfile(null);
        await signOut(auth);
        if (typeof window !== 'undefined') {
          toast.error('Your account has been deleted by an administrator. You have been logged out. Please sign up again if you wish to use the service.', {
            duration: 6000,
            position: 'top-center',
          });
        }
      } else if (res.status === 401) {
        // Handle unauthorized access
        let errorData = {};
        try {
          errorData = await res.json();
        } catch (jsonError) {
          // If response is not JSON, create a default error object
          errorData = { error: `Unauthorized: ${res.statusText}` };
        }
        console.log('Profile check error (401):', errorData);
        
        // Try to refresh the token and retry once
        try {
          const newToken = await firebaseUser.getIdToken(true); // Force refresh
          const retryRes = await fetch('/api/users/me', {
            headers: { 
              Authorization: `Bearer ${newToken}`,
              'Content-Security-Policy': "default-src 'self'"
            },
            credentials: 'same-origin'
          });
          
          if (retryRes.ok) {
            const data = await retryRes.json();
            // Sanitize profile data
            const sanitizedData = {
              ...data,
              name: sanitizeInput(data.name),
              email: sanitizeInput(data.email),
              username: sanitizeInput(data.username),
              phone: data.phone ? sanitizeInput(data.phone) : null,
              address: data.address ? sanitizeInput(data.address) : null,
              profilePicture: sanitizeProfilePictureUrl(data.profilePicture)
            };
            
            setProfile(sanitizedData);
            return;
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
        
        // If still unauthorized, log out
        setProfile(null);
        await signOut(auth);
        if (typeof window !== 'undefined') {
          toast.error(errorData.error || 'Session expired. Please log in again.', {
            duration: 4000,
            position: 'top-center',
          });
        }
      } else {
        // Handle other error statuses
        const errorData = await res.json().catch(() => ({}));
        console.log('Profile check error:', errorData);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setProfile(null);
    }
  };

  // Function to update user profile with enhanced security
  const updateProfile = async (profileData) => {
    try {
      const token = await user.getIdToken();
      console.log('Making request to update profile with data:', profileData);
      
      // Sanitize input data before sending
      const sanitizedProfileData = {};
      Object.keys(profileData).forEach(key => {
        if (typeof profileData[key] === 'string') {
          sanitizedProfileData[key] = sanitizeInput(profileData[key]);
        } else {
          sanitizedProfileData[key] = profileData[key];
        }
      });
      
      // Validate profile picture URL if provided
      if (sanitizedProfileData.profilePicture) {
        const sanitizedUrl = sanitizeProfilePictureUrl(sanitizedProfileData.profilePicture);
        if (sanitizedUrl === null && sanitizedProfileData.profilePicture !== null) {
          throw new Error('Invalid profile picture URL');
        }
        sanitizedProfileData.profilePicture = sanitizedUrl;
      }
      
      // Use relative URL as Vite proxy should handle the routing
      const response = await fetch('/api/users/update-profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Security-Policy': "default-src 'self'"
        },
        body: JSON.stringify(sanitizedProfileData),
        credentials: 'same-origin'
      });
      
      console.log('Response received:', response.status, response.statusText);

      // Check if response is OK before trying to parse JSON
      if (response.ok) {
        const data = await response.json();
        console.log('Profile update successful:', data);
        // Sanitize the returned user data
        const sanitizedUserData = {
          ...data.user,
          name: sanitizeInput(data.user.name),
          email: sanitizeInput(data.user.email),
          username: sanitizeInput(data.user.username),
          phone: data.user.phone ? sanitizeInput(data.user.phone) : null,
          address: data.user.address ? sanitizeInput(data.user.address) : null,
          profilePicture: sanitizeProfilePictureUrl(data.user.profilePicture)
        };
        
        setProfile(sanitizedUserData);
        return { success: true, data: sanitizedUserData };
      } else {
        // Try to parse error response, but handle case where it might not be JSON
        let errorData;
        const contentType = response.headers.get('content-type');
        console.log('Response content type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = { error: `Server error: ${response.status} ${response.statusText}` };
        }
        console.log('Profile update failed with error:', errorData);
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  // Periodic session validation (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      await checkUserProfile(user);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to validate user session (can be called from components)
  const validateSession = async () => {
    if (user) {
      await checkUserProfile(user);
    }
  };

  // Function to refresh user profile
  const refreshProfile = async () => {
    if (user) {
      await checkUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, validateSession, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);