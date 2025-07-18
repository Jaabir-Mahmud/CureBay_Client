import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Upload, Github } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Swal from 'sweetalert2';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    photo: null
  });
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    setPendingEmail("");
    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
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
          setPendingEmail(formData.email);
          await auth.signOut();
          return;
        }
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!'
        }).then(() => {
          navigate(from, { replace: true });
        });
      } else {
        // Signup
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(userCredential.user);
        Swal.fire({
          icon: 'info',
          title: 'Verify Your Email',
          text: 'A verification link has been sent to your email. Please verify your email before logging in.'
        });
        setShowResend(true);
        setPendingEmail(formData.email);
        setIsLogin(true); // Switch to login after signup
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: err.message || 'An error occurred.'
      });
      setError(err.message || 'Authentication failed');
    }
  };

  const handleResendVerification = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, pendingEmail, formData.password);
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
    setError('');
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
      // Handle successful login (e.g., save user info, redirect)
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!'
      }).then(() => {
        navigate(from, { replace: true });
      });
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleGithubLogin = () => {
    // GitHub authentication logic
    console.log('GitHub login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your CureBay account' : 'Join CureBay for better healthcare'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && <div className="text-red-500 text-center">{error}</div>}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo</Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end">
              {isLogin && (
                <button
                  type="button"
                  className="text-blue-600 hover:underline text-sm"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            {showResend && (
              <div className="text-center mt-2">
                <button
                  type="button"
                  className="text-blue-600 hover:underline text-sm"
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
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
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
  );
};

export default AuthPage;

