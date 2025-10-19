import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { createApiUrl } from "../lib/utils";

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
      // Ensure we have a fresh token
      const token = await firebaseUser.getIdToken(true); // Force refresh token
      // Use relative URL as Vite proxy should handle the routing
      let res = await fetch(createApiUrl('/api/users/me'), {
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
          setProfile(null);
          return;
        }
      } else if (res.status === 404 || res.status === 401) {
        // User not found or unauthorized, try to create user in backend
        console.log('User not found or unauthorized, attempting to create user in backend...');
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          username: firebaseUser.displayName 
            ? firebaseUser.displayName.toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 20) || firebaseUser.email.split('@')[0]
            : firebaseUser.email.split('@')[0],
          role: 'user',
          profilePicture: firebaseUser.photoURL
        };
        // Try to create user (Google sign-in flow)
        const createRes = await fetch(createApiUrl('/api/users/google'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData),
          credentials: 'include'
        });
        if (createRes.ok) {
          // Try fetching profile again with a fresh token
          const freshToken = await firebaseUser.getIdToken(true); // Force refresh token
          res = await fetch(createApiUrl('/api/users/me'), {
            headers: { 
              Authorization: `Bearer ${freshToken}`,
              'Content-Security-Policy': "default-src 'self'"
            },
            credentials: 'same-origin'
          });
          if (res.ok) {
            const data = await res.json();
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
        } else {
          // Show backend error message if available
          let backendError = 'Your account could not be found or created. Please try again or contact support.';
          try {
            const errData = await createRes.json();
            if (errData && errData.error) backendError = errData.error;
          } catch {}
          setProfile(null);
          await signOut(auth);
          if (typeof window !== 'undefined') {
            toast.error(backendError, {
              duration: 6000,
              position: 'top-center',
            });
          }
          return;
        }
        // If still not found, log out
        setProfile(null);
        await signOut(auth);
        if (typeof window !== 'undefined') {
          toast.error('Your account could not be found or created. Please try again or contact support.', {
            duration: 6000,
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
      const token = await user.getIdToken(true); // Force refresh token
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

      const response = await fetch(createApiUrl('/api/users/update-profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Security-Policy': "default-src 'self'"
        },
        body: JSON.stringify(sanitizedProfileData),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      // Sanitize the response data as well
      const sanitizedResponse = {
        ...updatedProfile,
        name: sanitizeInput(updatedProfile.name),
        email: sanitizeInput(updatedProfile.email),
        username: sanitizeInput(updatedProfile.username),
        phone: updatedProfile.phone ? sanitizeInput(updatedProfile.phone) : null,
        address: updatedProfile.address ? sanitizeInput(updatedProfile.address) : null,
        profilePicture: sanitizeProfilePictureUrl(updatedProfile.profilePicture)
      };
      setProfile(sanitizedResponse);
      return sanitizedResponse;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Periodic session validation (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      // Get a fresh user object with updated token
      const freshUser = auth.currentUser;
      if (freshUser) {
        await checkUserProfile(freshUser);
      }
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
      // Get a fresh user object with updated token
      const freshUser = auth.currentUser;
      if (freshUser) {
        await checkUserProfile(freshUser);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, validateSession, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);