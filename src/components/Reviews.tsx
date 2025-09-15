'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUser, FaPaperPlane } from 'react-icons/fa';
import LoadingState, { EmptyState } from './LoadingState';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  name: string;
  company: string;
  role: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    rating: 5,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load reviews from localStorage on component mount
  useEffect(() => {
    try {
      const savedReviews = localStorage.getItem('hiringAgent_reviews');
      if (savedReviews) {
        const parsedReviews = JSON.parse(savedReviews);
        setReviews(parsedReviews);
      }
    } catch (err) {
      console.error('Error loading reviews from localStorage:', err);
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newReview: Review = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };

      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);

      // Save to localStorage
      localStorage.setItem('hiringAgent_reviews', JSON.stringify(updatedReviews));

      setFormData({ name: '', company: '', role: '', rating: 5, comment: '' });
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} transition-colors duration-200`}
        onClick={interactive && onRatingChange ? () => onRatingChange(i + 1) : undefined}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
              Client Reviews & Ratings
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 transition-colors duration-500">
              Share your experience with our AI-powered hiring platform
            </p>
            
            {reviews.length > 0 && (
              <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="flex space-x-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                  {averageRating.toFixed(1)} out of 5
                </span>
                <span className="text-gray-500 dark:text-gray-400 transition-colors duration-500">
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          </motion.div>
        </div>

        {/* Review Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto mb-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-500"
          >
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-500">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-500">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-500">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
                  placeholder="Your job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-500">
                  Rating *
                </label>
                <div className="flex space-x-1">
                  {renderStars(formData.rating, true, (rating) => 
                    setFormData(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-500">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-500"
                  placeholder="Share your experience with our platform..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <FaPaperPlane className="mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Reviews Display */}
        <LoadingState
          isLoading={isLoading}
          error={error}
          isEmpty={reviews.length === 0}
          emptyState={
            <EmptyState
              title="No Reviews Yet"
              description="Be the first to share your experience with our AI-powered hiring platform!"
              icon={<FaUser className="w-8 h-8 text-gray-400" />}
              action={
                <Button
                  onClick={() => setShowForm(true)}
                  className="mt-4"
                >
                  Write First Review
                </Button>
              }
            />
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    <FaUser className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">{review.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">{review.role}</p>
                    <p className="text-sm font-medium text-primary-600">{review.company}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 mb-4">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 transition-colors duration-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 transition-colors duration-500">
                  &quot;{review.comment}&quot;
                </p>
              </motion.div>
            ))}
          </div>
        </LoadingState>
      </div>
    </section>
  );
}