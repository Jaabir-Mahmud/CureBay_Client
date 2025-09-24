import React, { useState } from 'react';
import { BookOpen, Clock, User, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import SEOHelmet from '../components/SEOHelmet';

const HealthTipsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock health tips data
  const allHealthTips = [
    {
      id: 1,
      title: 'Essential Vitamins for Daily Health',
      excerpt: 'Discover the key vitamins your body needs every day and how to incorporate them into your routine for optimal wellness.',
      content: 'Vitamins are essential nutrients that play vital roles in maintaining our health. Here are the key vitamins you should focus on...',
      author: 'Dr. Sarah Johnson',
      readTime: '5 min read',
      category: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2024-01-15',
      tags: ['Vitamins', 'Nutrition', 'Wellness']
    },
    {
      id: 2,
      title: 'Proper Medication Storage Tips',
      excerpt: 'Learn how to store your medications correctly to maintain their effectiveness and ensure your safety.',
      content: 'Proper storage of medications is crucial for maintaining their effectiveness and safety...',
      author: 'Pharmacist Mike Chen',
      readTime: '3 min read',
      category: 'Safety',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2024-01-10',
      tags: ['Storage', 'Safety', 'Medication']
    },
    {
      id: 3,
      title: 'Understanding Drug Interactions',
      excerpt: 'Important information about how different medications can interact and what to watch out for.',
      content: 'Drug interactions can occur when two or more medications react with each other...',
      author: 'Dr. Emily Rodriguez',
      readTime: '7 min read',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2024-01-05',
      tags: ['Drugs', 'Interactions', 'Safety']
    },
    {
      id: 4,
      title: 'Managing Chronic Conditions',
      excerpt: 'Effective strategies for managing chronic health conditions and improving quality of life.',
      content: 'Living with a chronic condition can be challenging, but with the right strategies...',
      author: 'Dr. James Wilson',
      readTime: '8 min read',
      category: 'Chronic Care',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2024-01-02',
      tags: ['Chronic', 'Management', 'Health']
    },
    {
      id: 5,
      title: 'Natural Remedies for Common Ailments',
      excerpt: 'Explore safe and effective natural remedies for everyday health issues.',
      content: 'Nature provides us with many remedies for common health problems...',
      author: 'Dr. Lisa Thompson',
      readTime: '6 min read',
      category: 'Natural Health',
      image: 'https://images.unsplash.com/photo-1497302347628-2fc52384307f?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2023-12-28',
      tags: ['Natural', 'Remedies', 'Home']
    },
    {
      id: 6,
      title: 'Importance of Regular Health Screenings',
      excerpt: 'Why regular health screenings are crucial for early detection and prevention.',
      content: 'Regular health screenings can help detect potential health issues before they become serious...',
      author: 'Dr. Robert Garcia',
      readTime: '4 min read',
      category: 'Prevention',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2023-12-20',
      tags: ['Screening', 'Prevention', 'Checkup']
    },
    {
      id: 7,
      title: 'Healthy Aging Tips',
      excerpt: 'Practical advice for maintaining health and vitality as you age.',
      content: 'Aging is a natural process, but there are many ways to age healthily...',
      author: 'Dr. Maria Lopez',
      readTime: '9 min read',
      category: 'Aging',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2023-12-15',
      tags: ['Aging', 'Health', 'Wellness']
    },
    {
      id: 8,
      title: 'Mental Health and Wellness',
      excerpt: 'Understanding the connection between mental and physical health.',
      content: 'Mental health is just as important as physical health...',
      author: 'Dr. David Kim',
      readTime: '7 min read',
      category: 'Mental Health',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2023-12-10',
      tags: ['Mental', 'Wellness', 'Mind']
    }
  ];

  const categories = [
    'all',
    'Nutrition',
    'Safety',
    'Education',
    'Chronic Care',
    'Natural Health',
    'Prevention',
    'Aging',
    'Mental Health'
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Nutrition': 'bg-green-100 text-green-700',
      'Safety': 'bg-red-100 text-red-700',
      'Education': 'bg-cyan-100 text-cyan-700',
      'Chronic Care': 'bg-purple-100 text-purple-700',
      'Natural Health': 'bg-yellow-100 text-yellow-700',
      'Prevention': 'bg-blue-100 text-blue-700',
      'Aging': 'bg-indigo-100 text-indigo-700',
      'Mental Health': 'bg-pink-100 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Filter health tips based on search and category
  const filteredTips = allHealthTips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEOHelmet 
        title="Health Tips & Guides - CureBay"
        description="Explore our comprehensive collection of health tips, guides, and expert advice to help you maintain better health and wellness."
        keywords="health tips, medical advice, wellness guides, healthcare information, expert advice"
        type="website"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-cyan-600 mr-3" />
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white transition-colors">
                Health Tips & Guides
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
              Discover expert advice and essential health information to help you live a healthier life
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search health tips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-3 text-lg"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center">
                <Filter className="text-gray-400 w-5 h-5 mr-2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              Showing {filteredTips.length} of {allHealthTips.length} health tips
            </p>
          </div>

          {/* Health Tips Grid */}
          {filteredTips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTips.map((tip) => (
                <Card key={tip.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden h-full">
                  <CardContent className="p-0 flex flex-col h-full">
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
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Meta Info */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 transition-colors">
                        <User className="w-4 h-4 mr-1" />
                        <span className="mr-4">{tip.author}</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{tip.readTime}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 flex-grow">
                        {tip.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors">
                        {tip.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tip.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                            {tip.publishedAt}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 p-0 h-auto font-medium transition-colors"
                          >
                            Read More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                No health tips found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HealthTipsPage;