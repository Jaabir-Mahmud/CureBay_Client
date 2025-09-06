import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, Search, Filter, Heart, Stethoscope, Pill, Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHelmet from '../components/SEOHelmet';

const HealthTipsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const healthTips = [
    {
      id: 1,
      title: 'Essential Vitamins for Daily Health',
      excerpt: 'Discover the key vitamins your body needs every day and how to incorporate them into your routine for optimal wellness.',
      author: 'Dr. Sarah Johnson',
      readTime: '5 min read',
      category: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2024-01-15',
      content: `
        <p>Vitamins are essential nutrients that play vital roles in maintaining our health and well-being. While our bodies can produce some vitamins, many must be obtained through diet or supplements.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Key Vitamins and Their Benefits</h3>
        
        <p><strong>Vitamin A:</strong> Supports vision, immune function, and skin health. Found in carrots, sweet potatoes, and leafy greens.</p>
        
        <p><strong>B Vitamins:</strong> Crucial for energy production and brain function. Include B12, folate, and B6 in your diet through whole grains, meat, and legumes.</p>
        
        <p><strong>Vitamin C:</strong> A powerful antioxidant that supports immune health and collagen production. Citrus fruits, strawberries, and bell peppers are excellent sources.</p>
        
        <p><strong>Vitamin D:</strong> Essential for bone health and immune function. Get it from sunlight exposure, fatty fish, and fortified foods.</p>
        
        <p><strong>Vitamin E:</strong> Protects cells from damage and supports skin health. Nuts, seeds, and vegetable oils are rich sources.</p>
        
        <p><strong>Vitamin K:</strong> Important for blood clotting and bone health. Found in leafy greens like kale and spinach.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Tips for Optimal Vitamin Intake</h3>
        
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Eat a varied diet with colorful fruits and vegetables</li>
          <li>Consider supplements if you have dietary restrictions</li>
          <li>Consult with a healthcare provider before starting any supplement regimen</li>
          <li>Be mindful of fat-soluble vitamins (A, D, E, K) which can accumulate in the body</li>
        </ul>
      `
    },
    {
      id: 2,
      title: 'Proper Medication Storage Tips',
      excerpt: 'Learn how to store your medications correctly to maintain their effectiveness and ensure your safety.',
      author: 'Pharmacist Mike Chen',
      readTime: '3 min read',
      category: 'Safety',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2024-01-10',
      content: `
        <p>Proper medication storage is crucial for maintaining effectiveness and preventing dangerous degradation. Incorrect storage can render medications ineffective or even harmful.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">General Storage Guidelines</h3>
        
        <p><strong>Temperature:</strong> Most medications should be stored at room temperature (68-77°F or 20-25°C) away from heat and moisture.</p>
        
        <p><strong>Humidity:</strong> Keep medications in dry places. Avoid storing in bathrooms where humidity levels fluctuate.</p>
        
        <p><strong>Light:</strong> Many medications are sensitive to light. Store in original containers or cabinets away from direct sunlight.</p>
        
        <p><strong>Child Safety:</strong> Keep all medications in child-resistant containers and store in high, locked cabinets.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Special Storage Requirements</h3>
        
        <p><strong>Refrigerated Medications:</strong> Some medications like insulin require refrigeration. Do not freeze unless specified.</p>
        
        <p><strong>Travel Storage:</strong> When traveling, keep medications in carry-on luggage and maintain temperature control.</p>
        
        <p><strong>Disposal:</strong> Never flush medications down the toilet. Use pharmacy take-back programs or FDA guidelines for safe disposal.</p>
      `
    },
    {
      id: 3,
      title: 'Understanding Drug Interactions',
      excerpt: 'Important information about how different medications can interact and what to watch out for.',
      author: 'Dr. Emily Rodriguez',
      readTime: '7 min read',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2024-01-05',
      content: `
        <p>Drug interactions occur when two or more medications react with each other, potentially altering their effectiveness or causing harmful side effects. Understanding these interactions is crucial for safe medication use.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Types of Drug Interactions</h3>
        
        <p><strong>Drug-Drug Interactions:</strong> Occur when two prescribed medications interact. Common examples include blood thinners interacting with pain relievers.</p>
        
        <p><strong>Drug-Food Interactions:</strong> Certain foods can affect how medications are absorbed. Grapefruit juice is a well-known example that can interfere with several medications.</p>
        
        <p><strong>Drug-Supplement Interactions:</strong> Herbal supplements and vitamins can interact with prescription medications, sometimes dangerously.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Prevention Strategies</h3>
        
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Always inform your healthcare provider of all medications, supplements, and herbal remedies you take</li>
          <li>Use one pharmacy for all prescriptions to allow for interaction checking</li>
          <li>Read medication labels carefully for food and alcohol warnings</li>
          <li>Keep an updated medication list with you at all times</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">When to Seek Help</h3>
        
        <p>If you experience unexpected side effects after starting a new medication or changing doses, contact your healthcare provider immediately. Pharmacists are also excellent resources for interaction information.</p>
      `
    },
    {
      id: 4,
      title: 'Managing Chronic Conditions with Medication',
      excerpt: 'Effective strategies for taking multiple medications for chronic conditions and maintaining adherence.',
      author: 'Dr. James Wilson',
      readTime: '6 min read',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2023-12-28',
      content: `
        <p>Managing chronic conditions often requires complex medication regimens. Developing effective strategies for adherence is essential for treatment success and quality of life.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Creating a Medication Schedule</h3>
        
        <p><strong>Organize by Time:</strong> Group medications that should be taken together. Use pill organizers with compartments for different days and times.</p>
        
        <p><strong>Associate with Daily Routines:</strong> Link medication times with regular activities like meals, brushing teeth, or watching the evening news.</p>
        
        <p><strong>Set Reminders:</strong> Use phone alarms, medication apps, or smart pill dispensers to remind you when it's time for doses.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Communication with Healthcare Providers</h3>
        
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Discuss side effects and concerns openly</li>
          <li>Ask about simplifying complex regimens when possible</li>
          <li>Report any missed doses or schedule changes</li>
          <li>Review medications regularly to ensure continued necessity</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Monitoring and Tracking</h3>
        
        <p>Keep a medication diary to track effectiveness, side effects, and adherence. This information is invaluable for healthcare provider visits and medication adjustments.</p>
      `
    },
    {
      id: 5,
      title: 'Natural Remedies vs. Prescription Medications',
      excerpt: 'Understanding when natural remedies can complement or should not replace prescribed treatments.',
      author: 'Dr. Lisa Thompson',
      readTime: '8 min read',
      category: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2023-12-20',
      content: `
        <p>The line between natural remedies and prescription medications can be blurry. While some natural approaches can complement traditional treatments, others may interfere or be inadequate for serious conditions.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">When Natural Remedies Can Help</h3>
        
        <p><strong>Supportive Care:</strong> Natural remedies like ginger for nausea or chamomile for mild anxiety can provide supportive benefits alongside prescribed treatments.</p>
        
        <p><strong>Prevention:</strong> Lifestyle approaches including diet, exercise, and stress management can prevent or reduce the severity of many conditions.</p>
        
        <p><strong>Mild Conditions:</strong> For minor issues like occasional headaches or mild digestive discomfort, natural approaches may be sufficient.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">When to Avoid Natural Substitutes</h3>
        
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Serious or life-threatening conditions requiring immediate intervention</li>
          <li>Conditions where precise dosing is critical (like blood thinners or diabetes medications)</li>
          <li>When there's a known effective treatment with proven results</li>
          <li>During pregnancy or when taking other medications with potential interactions</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Communication is Key</h3>
        
        <p>Always inform your healthcare provider about any natural remedies or supplements you're using. What's "natural" isn't always safe, and interactions can be just as significant as with prescription medications.</p>
      `
    },
    {
      id: 6,
      title: 'Reading and Understanding Your Prescription Labels',
      excerpt: 'A guide to decoding prescription labels and ensuring you take your medications correctly.',
      author: 'Pharmacist David Kim',
      readTime: '4 min read',
      category: 'Safety',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=250&fit=crop&auto=format',
      publishedAt: '2023-12-15',
      content: `
        <p>Prescription labels contain crucial information for safe and effective medication use. Understanding these details can prevent errors and ensure optimal treatment outcomes.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Key Label Information</h3>
        
        <p><strong>Patient Name:</strong> Verify this matches your name to ensure you have the correct medication.</p>
        
        <p><strong>Medication Name:</strong> Both brand and generic names are typically listed. Be aware of both to avoid confusion.</p>
        
        <p><strong>Dosage:</strong> The amount of medication per dose. This may be in milligrams (mg), micrograms (mcg), or other units.</p>
        
        <p><strong>Directions:</strong> How often and when to take the medication. Terms like "BID" (twice daily) or "QD" (once daily) may be used.</p>
        
        <p><strong>Quantity:</strong> Total number of pills or amount of liquid dispensed.</p>
        
        <p><strong>Refills:</strong> Number of times you can get additional supplies without a new prescription.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Special Instructions</h3>
        
        <p>Pay attention to special instructions like "take with food," "avoid alcohol," or "do not crush." These details are critical for safety and effectiveness.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Expiration and Storage</h3>
        
        <p>Check the expiration date and storage requirements. Expired medications should be properly disposed of, not used even if they appear unchanged.</p>
      `
    }
  ];

  const categories = ['All', 'Nutrition', 'Safety', 'Education'];

  const filteredTips = healthTips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tip.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Nutrition': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'Safety': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'Education': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <>
      <SEOHelmet 
        title="Health Tips & Medical Advice - CureBay"
        description="Expert health tips, medication advice, and wellness guidance from our medical professionals. Stay informed with the latest healthcare information."
        keywords="health tips, medical advice, wellness, medication information, healthcare, pharmacy advice"
        type="website"
      />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center text-cyan-200 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center mb-6">
              <BookOpen className="w-12 h-12 mr-4" />
              <h1 className="text-4xl lg:text-5xl font-bold">Health Tips & Guides</h1>
            </div>
            <p className="text-xl text-cyan-100 max-w-3xl">
              Expert advice and essential health information from our medical professionals to help you make informed decisions about your health and medications.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-12 transition-colors">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search health tips..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center">
                <Filter className="text-gray-400 w-5 h-5 mr-2" />
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Health Tips Grid */}
          {filteredTips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTips.map((tip) => (
                <Card key={tip.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden h-full">
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
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {tip.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors">
                        {tip.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                          {new Date(tip.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <Link to={`/health-tips/${tip.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 p-0 h-auto font-medium transition-colors"
                          >
                            Read More
                            <ArrowLeft className="w-4 h-4 ml-1 rotate-180 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No health tips found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Featured Tips Section */}
          <div className="mt-20">
            <div className="flex items-center mb-8">
              <Heart className="w-6 h-6 text-red-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Health Tips</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border border-cyan-100 dark:border-gray-700 transition-colors">
                <div className="flex items-start mb-6">
                  <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg mr-4">
                    <Stethoscope className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Medication Safety</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Learn how to safely store, take, and dispose of your medications
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Keep medications in their original containers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Store in a cool, dry place away from direct sunlight</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Check expiration dates regularly</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border border-green-100 dark:border-gray-700 transition-colors">
                <div className="flex items-start mb-6">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
                    <Pill className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Taking Medications</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Best practices for medication adherence and effectiveness
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Take medications exactly as prescribed</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Use a pill organizer to track doses</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Set daily reminders for medication times</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Health Calendar */}
          <div className="mt-20 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 mr-3" />
              <h2 className="text-3xl font-bold">Health & Wellness Calendar</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">January</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    <span>New Year Health Resolutions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    <span>Flu Shot Campaign</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">February</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                    <span>Heart Health Awareness</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                    <span>Medication Review Month</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">March</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>Spring Allergy Preparation</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>Medication Storage Check</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthTipsPage;