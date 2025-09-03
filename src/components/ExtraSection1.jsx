import React from 'react';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ExtraSection1 = () => {
  const healthTips = [
    {
      id: 1,
      title: 'Essential Vitamins for Daily Health',
      excerpt: 'Discover the key vitamins your body needs every day and how to incorporate them into your routine for optimal wellness.',
      author: 'Dr. Sarah Johnson',
      readTime: '5 min read',
      category: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2 days ago'
    },
    {
      id: 2,
      title: 'Proper Medication Storage Tips',
      excerpt: 'Learn how to store your medications correctly to maintain their effectiveness and ensure your safety.',
      author: 'Pharmacist Mike Chen',
      readTime: '3 min read',
      category: 'Safety',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop&auto=format',
      publishedAt: '1 week ago'
    },
    {
      id: 3,
      title: 'Understanding Drug Interactions',
      excerpt: 'Important information about how different medications can interact and what to watch out for.',
      author: 'Dr. Emily Rodriguez',
      readTime: '7 min read',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=250&fit=crop&auto=format',
      publishedAt: '3 days ago'
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Nutrition': 'bg-green-100 text-green-700',
      'Safety': 'bg-red-100 text-red-700',
      'Education': 'bg-blue-100 text-blue-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors">
              Health Tips & Guides
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
            Stay informed with expert advice and essential health information from our medical professionals
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {healthTips.map((tip) => (
            <Card key={tip.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(tip.category)}>
                      {tip.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors">
                    <User className="w-4 h-4 mr-1" />
                    <span className="mr-4">{tip.author}</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{tip.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {tip.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors">
                    {tip.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      {tip.publishedAt}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto font-medium transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3">
            <BookOpen className="w-5 h-5 mr-2" />
            View All Health Tips
          </Button>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
    </section>
  );
};

export default ExtraSection1;

