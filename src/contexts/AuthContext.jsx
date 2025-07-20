import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";

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

  // Function to check user profile
  const checkUserProfile = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        
        // Check if user is active
        if (data.isActive === false) {
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
      } else if (res.status === 404) {
        // User not found in database - try to recreate the account
        console.log('User not found in database, attempting to recreate account...');
        try {
          const loginResponse = await fetch('/api/auth/firebase-login', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken: token }),
          });
          
          console.log('Login response status:', loginResponse.status);
          
          if (loginResponse.ok) {
            const userData = await loginResponse.json();
            console.log('Account recreated successfully:', userData);
            setProfile({
              name: userData.user.username,
              email: userData.user.email,
              role: userData.user.role,
              isActive: true,
            });
            toast.success('Account recreated successfully!', {
              duration: 4000,
              position: 'top-center',
            });
            return;
          } else {
            const errorData = await loginResponse.text();
            console.error('Failed to recreate account:', loginResponse.status, errorData);
          }
        } catch (recreateError) {
          console.error('Error recreating account:', recreateError);
        }
        
        // If recreation fails, show the deletion message and log out
        setProfile(null);
        await signOut(auth);
        if (typeof window !== 'undefined') {
          toast.error('Your account has been deleted by an administrator. You have been logged out.', {
            duration: 6000,
            position: 'top-center',
          });
        }
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setProfile(null);
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

  const logout = () => signOut(auth);

  // Function to validate user session (can be called from components)
  const validateSession = async () => {
    if (user) {
      await checkUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, validateSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 