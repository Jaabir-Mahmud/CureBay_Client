import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Upload, Github, Camera, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import SEOHelmet from '../../components/SEOHelmet';
import NetworkStatus from '../../components/ui/NetworkStatus';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLanguage } from '../../contexts/LanguageContext'; // Added LanguageContext import
import { t } from '../../lib/i18n'; // Added translation import
import { createApiUrl } from '../../lib/utils';

// Validation schemas
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const signupSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  role: yup
    .string()
    .oneOf(['user', 'seller'], 'Please select a valid role')
    .required('Role is required'),
});

const AuthPage = () => {
  const { language } = useLanguage(); // Use language context
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  // Debug logging
  console.log('Location state:', location.state);
  console.log('From location:', from);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  // Watch the role value for controlled component
  const selectedRole = watch('role');

  // Toggle between login and signup modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset(); // Reset form when switching modes
    setShowResend(false);
    setPendingEmail("");
    // Clear photo when switching modes
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB to match backend)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile photo must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      setProfilePhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove photo
  const removePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Upload photo to server
  const uploadPhoto = async () => {
    if (!profilePhoto) return null;
    
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('photo', profilePhoto);
      
      // For signup, we use the image endpoint which doesn't require authentication
      // For profile updates after login, we use the profile endpoint which requires authentication
      const endpoint = isLogin ? '/api/upload/profile' : '/api/upload/image';
      
      const response = await fetch(createApiUrl(endpoint), {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        let errorMessage = `Failed to upload photo: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Failed to parse JSON error response:', jsonError);
        }
        
        throw new Error(errorMessage);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Failed to upload photo - Invalid server response');
      }
      
      return data.url; // Return the file URL
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error(error.message || 'Failed to upload profile photo');
      throw error; // Re-throw the error so it can be handled by the caller
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = async (data) => {
    if (!checkInternetConnection()) {
      toast.error('No internet connection. Please check your connection and try again.');
      return;
    }

    try {
      if (isLogin) {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        
        // Get fresh ID token with forced refresh
        const freshIdToken = await user.getIdToken(true);
        
        // Send user data and token to backend
        try {
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            profilePicture: user.photoURL
          };
          
          // Send idToken in the body for /api/auth/firebase-login
          const response = await fetch(createApiUrl('/api/auth/firebase-login'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken: freshIdToken, ...userData }),
            credentials: 'include'
          });

          const responseData = await response.json();
          
          if (!response.ok) {
            throw new Error(responseData.error || 'Failed to authenticate with server');
          }
        } catch (error) {
          console.error('Error authenticating with server:', error);
          toast.error('Failed to authenticate with server. Please contact support.');
          // Don't navigate if authentication failed
          return;
        }
        
        // Check if email is verified
        if (!user.emailVerified) {
          setShowResend(true);
          setPendingEmail(data.email);
          toast.error('Please verify your email before logging in. A verification email has been sent to your email address.');
          return;
        }
        
        toast.success('Login successful!');
        console.log('Navigating to:', from);
        navigate(from, { replace: true });
      } else {
        // Signup logic
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        
        // Upload profile photo if provided
        let profilePictureUrl = null;
        if (profilePhoto) {
          try {
            profilePictureUrl = await uploadPhoto();
          } catch (uploadError) {
            console.error('Failed to upload profile photo:', uploadError);
            // Don't fail signup if photo upload fails, just continue without it
          }
        }
        
        // Send verification email
        await sendEmailVerification(user);
        
        // Save additional user data to backend
        try {
          const userData = {
            uid: user.uid,
            email: data.email,
            username: data.username,
            role: data.role,
            profilePicture: profilePictureUrl
          };
          
          const response = await fetch(createApiUrl('/api/users/signup'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });
          
          if (!response.ok) {
            throw new Error('Failed to save user data');
          }
        } catch (error) {
          console.error('Error saving user data:', error);
          toast.error('Failed to save user data. Please contact support.');
        }
        
        // Show success message
        Swal.fire({
          title: 'Signup Successful!',
          text: 'A verification email has been sent to your email address. Please verify your email before logging in.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          toggleMode(); // Switch to login mode
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or login instead.';
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please check your email or sign up.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      toast.error(errorMessage);
    }
  };

  const checkInternetConnection = () => {
    return navigator.onLine;
  };

  const handleGoogleSignIn = async () => {
    if (!checkInternetConnection()) {
      toast.error('No internet connection. Please check your connection and try again.');
      return;
    }

    let loadingToast;
    try {
      // Create and configure Google provider
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account',
        auth_type: 'rerequest',
        // Add these parameters to help with popup issues
        access_type: 'offline',
        include_granted_scopes: 'true'
      });
      

      // Show loading toast
      loadingToast = toast.loading('Connecting to Google...');
      
      const result = await signInWithPopup(auth, provider);
      toast.dismiss(loadingToast);
      
      // Update loading message
      loadingToast = toast.loading('Setting up your account...');
      
      // Get fresh ID token with forced refresh
      const freshIdToken = await result.user.getIdToken(true);
      
      // Debug logging
      console.log('Google sign-in successful, from location:', from);
      
      // Send user data and token to backend
      try {
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          profilePicture: result.user.photoURL
        };
        
        // Send idToken in the body for /api/auth/firebase-login
        const response = await fetch(createApiUrl('/api/auth/firebase-login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ idToken: freshIdToken, ...userData }),
          credentials: 'include'
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          // If user not found, try to create a new account
          if (response.status === 404) {
            const createResponse = await fetch(createApiUrl('/api/users/signup'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${freshIdToken}`
              },
              body: JSON.stringify({
                ...userData,
                username: result.user.displayName || result.user.email.split('@')[0],
                role: 'user'
              }),
              credentials: 'include'
            });

            if (!createResponse.ok) {
              throw new Error('Failed to create new account. Please try again.');
            }

            toast.success('New account created successfully!');
          } else {
            throw new Error(responseData.error || 'Failed to authenticate with server');
          }
        }
        
        // Short delay to ensure user data is properly synchronized
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error authenticating with server:', error);
        toast.error('Failed to authenticate with server. Please contact support.');
        // Don't navigate if user creation failed
        return;
      }
      
      toast.success('Login successful!');
      console.log('Navigating to:', from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/internal-error') {
        toast.error('Authentication service temporarily unavailable. Please check your internet connection and try again.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('net::ERR_INTERNET_DISCONNECTED')) {
        toast.error('Internet connection appears to be offline. Please check your connection and try again.');
      } else if (error.message && error.message.includes('Failed to create new account')) {
        toast.error('Could not create your account. Please try again or contact support.');
      } else {
        toast.error(error.message || 'Google sign-in failed. Please try again.');
      }
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Reset Password',
      input: 'email',
      inputLabel: 'Enter your email address',
      inputPlaceholder: 'Enter your email',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      cancelButtonText: 'Cancel'
    });
    
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        toast.success('Password reset email sent! Please check your inbox.');
      } catch (error) {
        console.error('Password reset error:', error);
        toast.error('Failed to send password reset email. Please try again.');
      }
    }
  };

  return (
    <>
      <SEOHelmet 
        title={isLogin ? "Login - CureBay" : "Sign Up - CureBay"}
        description={isLogin ? "Login to your CureBay account to access your pharmacy services." : "Create a new CureBay account to access our pharmacy services."}
        keywords={isLogin ? "login, sign in, CureBay account, pharmacy login" : "sign up, register, create account, CureBay signup, pharmacy account"}
      />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
        <NetworkStatus />
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              {isLogin ? t('auth.login', language) : t('auth.signup', language)}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              {isLogin ? 'Welcome back! Please sign in to continue.' : 'Create an account to get started.'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Username Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                      {t('profile.username', language)}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        className="pl-10 h-12"
                        {...register('username')}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Profile Photo (Optional)
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {profilePhotoPreview ? (
                          <div className="relative">
                            <img 
                              src={profilePhotoPreview} 
                              alt="Profile preview" 
                              className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500"
                            />
                            <button
                              type="button"
                              onClick={removePhoto}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="flex items-center justify-center px-4 py-2 bg-cyan-500 text-white rounded-lg cursor-pointer hover:bg-cyan-600 transition-colors">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Max 2MB, JPG/PNG</p>
                      </div>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">
                      {t('profile.accountType', language)}
                    </Label>
                    <Select 
                      value={selectedRole} 
                      onValueChange={(value) => setValue('role', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">👤 {t('profile.customer', language)}</SelectItem>
                        <SelectItem value="seller">🏪 {t('profile.seller', language)}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-red-500 text-sm">{errors.role.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  {t('auth.email', language)}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  {t('auth.password', language)}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    {t('auth.forgotPassword', language)}
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting || isUploadingPhoto}
                className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
              >
                {isSubmitting || isUploadingPhoto ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isUploadingPhoto ? 'Uploading Photo...' : 'Processing...'}
                  </div>
                ) : (
                  isLogin ? t('auth.login', language) : t('auth.signup', language)
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Toggle Mode */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? t('auth.noAccount', language) : t('auth.alreadyHaveAccount', language)}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
              >
                {isLogin ? t('auth.signup', language) : t('auth.login', language)}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AuthPage;