// services/userSyncService.js
import { auth } from "./firebase";

/**
 * Sync user profile with backend
 * @param {Object} firebaseUser - Firebase user object
 * @returns {Promise<Object|null>} User profile data or null if sync failed
 */
export async function syncUserProfile(firebaseUser) {
  try {
    if (!firebaseUser) return null;
    
    const token = await firebaseUser.getIdToken();
    const res = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error('Failed to sync user profile:', res.status, await res.text());
      return null;
    }
  } catch (error) {
    console.error('Error syncing user profile:', error);
    return null;
  }
}

/**
 * Validate user session with backend
 * @param {Object} firebaseUser - Firebase user object
 * @returns {Promise<Object>} Validation result
 */
export async function validateUserSession(firebaseUser) {
  try {
    if (!firebaseUser) {
      return { isValid: false, reason: 'No user provided' };
    }
    
    const token = await firebaseUser.getIdToken();
    const res = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.isActive === false) {
        return { isValid: false, reason: 'User account is inactive' };
      }
      return { isValid: true, user: data };
    } else if (res.status === 401) {
      return { isValid: false, reason: 'Invalid session' };
    } else if (res.status === 404) {
      return { isValid: false, reason: 'User not found' };
    } else {
      return { isValid: false, reason: 'Unknown error' };
    }
  } catch (error) {
    console.error('Error validating user session:', error);
    return { isValid: false, reason: 'Network error' };
  }
}

/**
 * Force sync user with backend (recreates user if missing)
 * @param {Object} firebaseUser - Firebase user object
 * @returns {Promise<Object>} Sync result
 */
export async function forceSyncUser(firebaseUser) {
  try {
    if (!firebaseUser) {
      return { success: false, reason: 'No user provided' };
    }
    
    const token = await firebaseUser.getIdToken();
    
    // Try to get user profile first
    const res = await fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, user: data };
    } else if (res.status === 404) {
      // User not found, try to recreate
      const loginResponse = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idToken: token }),
      });
      
      if (loginResponse.ok) {
        const userData = await loginResponse.json();
        return { success: true, user: userData.user };
      } else {
        return { success: false, reason: 'Failed to recreate user' };
      }
    } else {
      return { success: false, reason: 'Failed to sync user' };
    }
  } catch (error) {
    console.error('Error force syncing user:', error);
    return { success: false, reason: 'Network error' };
  }
}