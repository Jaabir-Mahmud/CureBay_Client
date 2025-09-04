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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Profile photo must be less than 2MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
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
      
      const response = await fetch('/api/upload/profile', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON error response:', jsonError);
          throw new Error(`Failed to upload photo: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.message || 'Failed to upload photo');
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
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = async (data) => {
    setShowResend(false);
    setPendingEmail("");
    
    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
          Swal.fire({
            icon: 'warning',
            title: 'Email Not Verified',
            text: 'Please verify your email before logging in.',
            showCancelButton: true,
            confirmButtonText: 'Resend Verification Email',
            cancelButtonText: 'Close'
          }).then(async (result) => {
            if (result.isConfirmed) {
              await sendEmailVerification(user);
              Swal.fire({
                icon: 'info',
                title: 'Verification Email Sent',
                text: 'A new verification link has been sent to your email.'
              });
            }
          });
          setShowResend(true);
          setPendingEmail(data.email);
          await auth.signOut();
          return;
        }
        
        // Show toast notification and navigate automatically
        toast.success('Login Successful! Welcome back!', {
          duration: 3000,
          position: 'top-center',
        });
        navigate(from, { replace: true });
        
      } else {
        // Signup
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        
        // Upload profile photo if provided
        let profilePictureUrl = null;
        if (profilePhoto) {
          profilePictureUrl = await uploadPhoto();
          if (!profilePictureUrl) {
            // Photo upload failed, but continue with signup
            toast('Profile photo upload failed, but account was created successfully', {
              icon: '⚠️'
            });
          }
        }
        
        // Get ID token and send to backend for enhanced signup
        const idToken = await user.getIdToken();
        
        const signupResponse = await fetch('/api/auth/firebase-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken,
            username: data.username,
            role: data.role,
            profilePicture: profilePictureUrl
          })
        });
        
        let signupData;
        try {
          signupData = await signupResponse.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          throw new Error('Failed to create account - Invalid server response');
        }
        
        if (!signupResponse.ok) {
          throw new Error(signupData.error || 'Failed to create account');
        }
        
        // Send email verification
        await sendEmailVerification(user);
        
        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'A verification link has been sent to your email. Please verify your email before logging in.'
        });
        
        setShowResend(true);
        setPendingEmail(data.email);
        setIsLogin(true); // Switch to login after signup
        reset(); // Reset form after successful signup
        
        // Clear photo after successful signup
        setProfilePhoto(null);
        setProfilePhotoPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: err.message || 'An error occurred.'
      });
    }
  };

  const handleResendVerification = async () => {
    const currentPassword = watch('password'); // Get current password from form
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, pendingEmail, currentPassword);
      await sendEmailVerification(userCredential.user);
      Swal.fire({
        icon: 'info',
        title: 'Verification Email Sent',
        text: 'A new verification link has been sent to your email.'
      });
      await auth.signOut();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Resend Failed',
        text: err.message || 'Could not resend verification email.'
      });
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Reset Password',
      input: 'email',
      inputLabel: 'Enter your email address',
      inputPlaceholder: 'Email',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter your email address';
        }
        return null;
      }
    });
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
          icon: 'success',
          title: 'Reset Email Sent',
          text: 'A password reset link has been sent to your email.'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Reset Failed',
          text: err.message || 'Could not send reset email.'
        });
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      // Send ID token to backend
      const response = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      
      // Handle successful login with toast notification and automatic navigation
      toast.success('Login Successful! Welcome back!', {
        duration: 3000,
        position: 'top-center',
      });
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Google login failed');
    }
  };

  const handleGithubLogin = () => {
    // GitHub authentication logic
    console.log('GitHub login');
  };

  return (
    <>
      <SEOHelmet
        title={isLogin ? "Sign In - CureBay Online Pharmacy" : "Create Account - CureBay Online Pharmacy"}
        description={isLogin ? "Sign in to your CureBay account to access your orders, prescriptions, and healthcare dashboard." : "Create your CureBay account to start shopping for medicines and healthcare products online."}
        keywords={isLogin ? "login, sign in, pharmacy account, CureBay login" : "sign up, create account, register, pharmacy registration"}
        url={window.location.href}
      />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            {isLogin ? 'Sign in to your CureBay account' : 'Join CureBay for better healthcare'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Message */}
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500 text-sm space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <div key={field}>{error.message}</div>
              ))}
            </div>
          )}
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </Button>
            <Button
              onClick={handleGithubLogin}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                    {...register('username')}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  autoComplete="username"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo (Optional)</Label>
                <div className="space-y-3">
                  {profilePhotoPreview ? (
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={profilePhotoPreview}
                          alt="Profile preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{profilePhoto?.name}</p>
                        <p className="text-xs text-gray-500">
                          {(profilePhoto?.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        ref={fileInputRef}
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="pl-10"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Upload a profile picture (max 2MB). Supported formats: JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  autoComplete="current-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select 
                  value={selectedRole} 
                  onValueChange={(value) => setValue('role', value)}
                >
                  <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              {isLogin && (
                <button
                  type="button"
                  className="text-cyan-600 hover:underline text-sm"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600"
              disabled={isSubmitting || isUploadingPhoto}
            >
              {isSubmitting || isUploadingPhoto ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isUploadingPhoto ? 'Uploading photo...' : (isLogin ? 'Signing In...' : 'Creating Account...')}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </Button>
            {showResend && (
              <div className="text-center mt-2">
                <button
                  type="button"
                  className="text-cyan-600 hover:underline text-sm"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </button>
              </div>
            )}
          </form>
          {/* Toggle Login/Register */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 text-cyan-600 hover:text-cyan-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
          {/* Back to Home */}
          <div className="text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default AuthPage;

