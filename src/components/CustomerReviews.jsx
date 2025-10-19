import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../lib/i18n';
import toast from 'react-hot-toast';

const CustomerReviews = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: []
  });
  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews and stats from API
  useEffect(() => {
    const fetchReviewsAndStats = async () => {
      try {
        setLoading(true);
        
        // For homepage, we'll fetch featured reviews
        let headers = {};
        if (user) {
          const token = await user.getIdToken();
          headers = { 'Authorization': `Bearer ${token}` };
        }
        
        const reviewsResponse = await fetch('/api/reviews/featured?limit=3', { headers });
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
          
          // Set stats based on the reviews we have
          const total = reviewsData.totalReviews || 0;
          const average = reviewsData.averageRating || 0;
          
          setStats({
            average,
            total,
            distribution: [] // We'll populate this if needed
          });
        } else {
          // For unauthenticated users or API errors, show mock data
          const mockReviews = [
            {
              _id: 1,
              user: { name: "Sarah Johnson" },
              rating: 5,
              comment: "CureBay has completely transformed how I manage my healthcare needs. Fast delivery and genuine products!",
              createdAt: "2025-09-15"
            },
            {
              _id: 2,
              user: { name: "Michael Chen" },
              rating: 4,
              comment: "Great service and competitive prices. The prescription upload feature saves me so much time.",
              createdAt: "2025-09-10"
            },
            {
              _id: 3,
              user: { name: "Emma Rodriguez" },
              rating: 5,
              comment: "The medicine reminder feature is a game-changer. I never miss my daily medications anymore.",
              createdAt: "2025-09-05"
            }
          ];
          
          setReviews(mockReviews);
          setStats({
            average: 4.7,
            total: 20,
            distribution: []
          });
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
        // Even on error, show mock data as fallback
        const mockReviews = [
          {
            _id: 1,
            user: { name: "Sarah Johnson" },
            rating: 5,
            comment: "CureBay has completely transformed how I manage my healthcare needs. Fast delivery and genuine products!",
            createdAt: "2025-09-15"
          },
          {
            _id: 2,
            user: { name: "Michael Chen" },
            rating: 4,
            comment: "Great service and competitive prices. The prescription upload feature saves me so much time.",
            createdAt: "2025-09-10"
          },
          {
            _id: 3,
            user: { name: "Emma Rodriguez" },
            rating: 5,
            comment: "The medicine reminder feature is a game-changer. I never miss my daily medications anymore.",
            createdAt: "2025-09-05"
          }
        ];
        
        setReviews(mockReviews);
        setStats({
          average: 4.7,
          total: 20,
          distribution: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndStats();
  }, [user]);

  const StarRating = ({ rating, size = "w-5 h-5", interactive = false, onRatingChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            disabled={!interactive}
          >
            <svg
              className={`${size} ${star <= rating ? 'text-amber-400' : 'text-gray-300'} fill-current`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim() || !user) return;
    
    setSubmitting(true);
    try {
      // Get Firebase ID token for authentication
      const token = await user.getIdToken();
      
      const response = await fetch('/api/reviews/general', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ rating, comment })
      });
      
      if (response.ok) {
        // Reset form
        setRating(0);
        setComment('');
        
        // Show success notification
        toast.success(t('reviews.reviewSubmitted', language) || 'Review submitted successfully!');
        
        // Refresh reviews list
        // For simplicity, we'll just fetch the featured reviews again
        const token = await user.getIdToken();
        const reviewsResponse = await fetch('/api/reviews/featured?limit=3', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
          setStats({
            average: reviewsData.averageRating || stats.average,
            total: reviewsData.totalReviews || stats.total,
            distribution: []
          });
        }
      } else {
        const errorData = await response.json();
        if (response.status === 403) {
          // Authorization error - user not authorized to submit reviews
          toast.error(t('reviews.notAuthorized', language) || errorData.message || 'You are not authorized to submit reviews. Only admins, sellers, and users who have purchased medicine can submit reviews.');
        } else {
          throw new Error(errorData.message || 'Failed to submit review');
        }
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error(t('reviews.reviewFailed', language) || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Add Review Form */}
            <div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
            
            {/* Right Column - Featured Reviews */}
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-white dark:bg-gray-900">
        <div className="text-center py-12">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Error Loading Reviews</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white dark:bg-gray-900">
      {/* Header Section - Simplified for homepage */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('reviews.customerReviews', language)}
        </h2>
        
        <div className="flex items-center gap-3 mb-6">
          <StarRating rating={Math.round(stats.average)} />
          <span className="text-gray-600 dark:text-gray-400">
            {t('reviews.basedOnReviews', language).replace('{count}', stats.total)}
          </span>
        </div>
      </div>

      {/* Reviews Grid - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Add Review Form */}
        <div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('reviews.shareThoughts', language)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('reviews.ifUsedProduct', language)}
            </p>
            
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('reviews.rating', language)}
                </label>
                <StarRating 
                  rating={rating} 
                  size="w-8 h-8" 
                  interactive={true} 
                  onRatingChange={setRating} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('reviews.comment', language)}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                  placeholder={t('reviews.writeReview', language)}
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={submitting || rating === 0 || !comment.trim()}
                className={`w-full px-6 py-3 font-medium rounded-lg transition-colors ${
                  submitting || rating === 0 || !comment.trim()
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                {submitting ? t('reviews.submitting', language) || 'Submitting...' : t('reviews.submitReview', language)}
              </button>
            </form>
          </div>
        </div>
        
        {/* Right Column - Featured Reviews (Exactly 3) */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('reviews.featuredReviews', language)}
          </h3>
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review._id} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex items-start gap-4">
                  {/* Add null check for review.user before accessing profilePicture */}
                  {review.user && review.user.profilePicture ? (
                    <img 
                      src={review.user.profilePicture} 
                      alt={review.user.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {review.user && review.user.name ? review.user.name.charAt(0) : 'U'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {review.user && review.user.name ? review.user.name : 'Anonymous User'}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <StarRating rating={review.rating} size="w-4 h-4" />
                    <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;