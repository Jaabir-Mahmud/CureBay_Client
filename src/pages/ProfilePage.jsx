import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Camera, User, Mail, Shield, Save, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEOHelmet from '../components/SEOHelmet';

// Validation schema
const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  address: yup
    .string()
    .optional(),
});

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: profile?.name || user?.displayName || '',
      username: profile?.username || '',
      email: user?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      role: profile?.role || 'user',
    },
  });

  // Watch the role value
  const selectedRole = watch('role');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Here you would typically upload the image and update the profile
      // For now, we'll just show a success message
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Profile updated successfully!');
      navigate('/'); // Redirect to home or dashboard
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h2>
          <Link to="/auth">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentAvatar = previewImage || profile?.profilePicture || user?.photoURL || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || user?.displayName || user?.email)}&background=0891b2&color=fff`;

  return (
    <>
      <SEOHelmet
        title="Update Profile - CureBay Online Pharmacy"
        description="Update your CureBay profile information, including personal details and preferences."
        keywords="profile, account settings, user profile, CureBay profile"
        url={window.location.href}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Update Profile</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="w-5 h-5" />
                    <span>Profile Picture</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <img
                        src={currentAvatar}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                      />
                      <label className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click the camera icon to change your profile picture
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Max file size: 5MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Account Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
                      <span className="font-medium text-cyan-600 dark:text-cyan-400 capitalize">
                        {profile?.role || 'user'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Verified:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {user?.emailVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className={errors.name ? 'border-red-500' : ''}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          className={errors.username ? 'border-red-500' : ''}
                          {...register('username')}
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm">{errors.username.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                            {...register('email')}
                            disabled
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className={errors.phone ? 'border-red-500' : ''}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="Enter your address"
                          className={errors.address ? 'border-red-500' : ''}
                          {...register('address')}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm">{errors.address.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Account Type</Label>
                        <Select 
                          value={selectedRole} 
                          onValueChange={(value) => setValue('role', value)}
                          disabled
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Customer</SelectItem>
                            <SelectItem value="seller">Seller</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Contact support to change your account type
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                      >
                        {isSubmitting || isLoading ? (
                          <span className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </span>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;