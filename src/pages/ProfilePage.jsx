import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Camera, User, Mail, Shield, Save, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEOHelmet from '../components/SEOHelmet';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';
import { createApiUrl } from '../lib/utils';

// Country data with codes
const countries = [
  { code: '+1-US', name: 'United States', iso: 'US', flag: '🇺🇸' },
  { code: '+1-CA', name: 'Canada', iso: 'CA', flag: '🇨🇦' },
  { code: '+44', name: 'United Kingdom', iso: 'GB', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', iso: 'AU', flag: '🇦🇺' },
  { code: '+91', name: 'India', iso: 'IN', flag: '🇮🇳' },
  { code: '+880', name: 'Bangladesh', iso: 'BD', flag: '🇧🇩' },
];

// Enhanced validation schema
const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[\d\s\-()]{7,15}$/, 'Please enter a valid phone number (7-15 digits)')
    .optional(),
  address: yup
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
});

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('+880');
  const [profilePhoto, setProfilePhoto] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      address: '',
      role: 'user',
    },
  });

  const selectedRole = watch('role');

  // Set initial form values when profile loads
  useEffect(() => {
    if (profile) {
      const formData = {
        name: profile.name || '',
        username: profile.username || '',
        email: user?.email || '',
        address: profile.address || '',
        role: profile.role || 'user',
        phone: '',
      };

      // Handle phone number parsing
      if (profile.phone) {
        const phoneStr = profile.phone.toString();
        let countryMatch = countries.find(country => phoneStr.startsWith(country.code));
        
        if (!countryMatch && phoneStr.startsWith('+1')) {
          countryMatch = countries.find(country => country.code === '+1-US');
        }
        
        if (countryMatch) {
          setSelectedCountry(countryMatch.code);
          let actualCountryCode = countryMatch.code;
          if (actualCountryCode.startsWith('+1-')) {
            actualCountryCode = '+1';
          }
          formData.phone = phoneStr.replace(actualCountryCode, '').replace(/^\s*/, '');
        } else {
          formData.phone = phoneStr;
        }
      }

      reset(formData);
    }
    
    if (user) {
      setIsEmailVerified(user.emailVerified || false);
    }
  }, [profile, user, reset]);

  // Handle profile photo change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(t('profile.invalidImage', language) || 'Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('profile.imageTooLarge', language) || 'Image size should be less than 5MB');
        return;
      }

      setProfilePhoto(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload profile photo
  const uploadProfilePhoto = async () => {
    if (!profilePhoto) return null;
    
    try {
      const formData = new FormData();
      formData.append('photo', profilePhoto);
      
      const token = await user.getIdToken();
      const response = await fetch(createApiUrl('/api/upload/profile'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
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
        throw new Error(errorData.error || 'Failed to upload photo');
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Failed to upload photo - Invalid server response');
      }
      return data.url;
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error(error.message || t('profile.uploadFailed', language) || 'Failed to upload profile photo');
      return null;
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let profilePictureUrl = null;
      if (profilePhoto) {
        profilePictureUrl = await uploadProfilePhoto();
        if (!profilePictureUrl) {
          toast.error(t('profile.uploadFailed', language) || 'Failed to upload profile photo. Please try again.');
          return;
        }
      }
      
      let fullPhoneNumber = '';
      if (data.phone && data.phone.trim()) {
        const cleanPhone = data.phone.replace(/[\s\-()]/g, '');
        let actualCountryCode = selectedCountry;
        if (selectedCountry.startsWith('+1-')) {
          actualCountryCode = '+1';
        }
        fullPhoneNumber = `${actualCountryCode}${cleanPhone}`;
      }
      
      const updateData = {
        name: data.name.trim(),
        username: data.username.toLowerCase().trim(),
        phone: fullPhoneNumber,
        address: data.address?.trim() || ''
      };
      
      if (profilePictureUrl) {
        updateData.profilePicture = profilePictureUrl;
      }

      const result = await updateProfile(updateData);
      
      if (result.success) {
        toast.success(t('profile.updateSuccess', language) || 'Profile updated successfully!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || t('profile.updateFailed', language) || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(createApiUrl('/api/auth/resend-verification'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success(t('profile.verificationSent', language) || 'Verification email sent! Please check your inbox.');
      } else {
        let errorData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = { error: `Server error: ${response.status} ${response.statusText}` };
        }
        throw new Error(errorData.error || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Verification email error:', error);
      toast.error(error.message || t('profile.verificationFailed', language) || 'Failed to send verification email. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('auth.noAccount', language)}
          </h2>
          <Link to="/auth">
            <Button className="bg-cyan-500 hover:bg-cyan-600">{t('nav.joinUs', language)}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentAvatar = previewImage || 
    (profile?.profilePicture ? profile.profilePicture : null) || 
    (user?.photoURL ? user.photoURL : null) || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || user?.displayName || user?.email)}`;

  const selectedCountryInfo = countries.find(c => c.code === selectedCountry) || countries[0];

  return (
    <>
      <SEOHelmet
        title={t('profile.seo.title', language) || "Update Profile - CureBay Online Pharmacy"}
        description={t('profile.seo.description', language) || "Update your CureBay profile information, including personal details and preferences."}
        keywords={t('profile.seo.keywords', language) || "profile, account settings, user profile, CureBay profile"}
        url={window.location.href}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.cancel', language)}
                </Button>
              </Link>
              {isDirty && (
                <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                  {t('profile.unsavedChanges', language) || 'You have unsaved changes'}
                </span>
              )}
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('profile.updateProfile', language)}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">{t('profile.manageInfo', language) || 'Manage your account information and preferences'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Enhanced Profile Picture Section */}
            <div className="xl:col-span-1">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Camera className="w-5 h-5 text-cyan-500" />
                    <span>{t('profile.profilePicture', language) || 'Profile Picture'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <img
                        src={currentAvatar}
                        alt={t('profile.profile', language) || "Profile"}
                        className="w-36 h-36 rounded-full object-cover border-4 border-cyan-200 dark:border-cyan-800 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                      />
                      <label className="absolute bottom-2 right-2 bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110">
                        <Camera className="w-5 h-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('profile.changePhoto', language) || 'Click the camera icon to change your photo'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {t('profile.imageRequirements', language) || 'JPG, PNG or GIF • Max 5MB'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Account Info */}
              <Card className="mt-6 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Shield className="w-5 h-5 text-cyan-500" />
                    <span>{t('profile.accountStatus', language) || 'Account Status'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('profile.role', language) || 'Role:'}</span>
                      <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium capitalize">
                        {profile?.role || 'user'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('profile.emailStatus', language) || 'Email Status:'}</span>
                      <div className="flex items-center space-x-2">
                        {isEmailVerified ? (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                            {t('profile.verified', language) || 'Verified'}
                          </span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                              {t('profile.unverified', language) || 'Unverified'}
                            </span>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleResendVerification}
                              className="text-xs h-7 px-2"
                            >
                              {t('profile.resend', language) || 'Resend'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('profile.memberSince', language) || 'Member Since:'}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(language === 'BN' ? 'bn-BD' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Profile Form */}
            <div className="xl:col-span-3">
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <User className="w-6 h-6 text-cyan-500" />
                    <span>{t('profile.personalInfo', language)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t('profile.fullName', language)} *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder={t('profile.namePlaceholder', language) || "Enter your full name"}
                          className={`h-12 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-cyan-500'} transition-colors`}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Username Field */}
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t('profile.username', language)} *
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder={t('profile.usernamePlaceholder', language) || "Enter your username"}
                          className={`h-12 ${errors.username ? 'border-red-500 focus:border-red-500' : 'focus:border-cyan-500'} transition-colors`}
                          {...register('username')}
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.username.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">{t('profile.usernameHelp', language) || 'Letters, numbers, and underscores only'}</p>
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t('profile.email', language)} *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder={t('profile.emailPlaceholder', language) || "Enter your email"}
                            className={`h-12 pl-11 bg-gray-50 dark:bg-gray-700 ${errors.email ? 'border-red-500' : ''} cursor-not-allowed`}
                            {...register('email')}
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-500">{t('profile.emailHelp', language) || 'Email address cannot be changed'}</p>
                      </div>

                      {/* Enhanced Phone Field */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t('profile.phone', language)}
                        </Label>
                        <div className="flex gap-0 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-cyan-500 transition-all">
                          <div className="relative">
                            <Select 
                              value={selectedCountry} 
                              onValueChange={setSelectedCountry}
                            >
                              <SelectTrigger className="w-44 h-12 border-0 border-r border-gray-300 dark:border-gray-600 rounded-none focus:ring-0 bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{selectedCountryInfo.flag || '🏳️'}</span>
                                  <span className="font-medium">{selectedCountry}</span>
                                </div>
                              </SelectTrigger>
                              <SelectContent className="w-80">
                                {countries.map((country) => (
                                  <SelectItem key={`${country.iso}-${country.code}`} value={country.code}>
                                    <div className="flex items-center space-x-3">
                                      <span className="text-lg">{country.flag || '🏳️'}</span>
                                      <span className="font-medium text-gray-700">{country.code}</span>
                                      <span className="text-gray-500 truncate">{country.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1 relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder={t('profile.phonePlaceholder', language) || "Enter phone number"}
                              className={`h-12 pl-10 border-0 rounded-none focus:ring-0 ${errors.phone ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                              {...register('phone')}
                            />
                          </div>
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.phone.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">{t('profile.phoneHelp', language) || 'Enter your phone number without the country code'}</p>
                      </div>

                      {/* Address Field */}
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t('profile.address', language)}
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder={t('profile.addressPlaceholder', language) || "Enter your full address"}
                          className={`h-12 ${errors.address ? 'border-red-500 focus:border-red-500' : 'focus:border-cyan-500'} transition-colors`}
                          {...register('address')}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.address.message}
                          </p>
                        )}
                      </div>

                      {/* Role Field */}
                      <div className="space-y-2 lg:col-span-2">
                        <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t('profile.accountType', language)}
                        </Label>
                        <Select 
                          value={selectedRole} 
                          onValueChange={(value) => setValue('role', value)}
                          disabled
                        >
                          <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-700 cursor-not-allowed">
                            <SelectValue placeholder={t('profile.selectRole', language) || "Select account type"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">👤 {t('profile.customer', language)}</SelectItem>
                            <SelectItem value="seller">🏪 {t('profile.seller', language)}</SelectItem>
                            <SelectItem value="admin">⚡ {t('profile.admin', language)}</SelectItem>
                          </SelectContent>
                        </Select>
                       
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        type="submit"
                        disabled={isSubmitting || isLoading || !isDirty}
                        className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting || isLoading ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>{t('common.loading', language)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Save className="w-5 h-5" />
                            <span>{t('profile.saveChanges', language)}</span>
                          </div>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="flex-1 h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors duration-300"
                        disabled={isSubmitting || isLoading}
                      >
                        {t('common.cancel', language)}
                      </Button>
                    </div>

                    {/* Save indicator */}
                    {!isDirty && !isSubmitting && !isLoading && (
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('profile.makeChanges', language) || 'Make changes to enable the save button'}
                      </p>
                    )}
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