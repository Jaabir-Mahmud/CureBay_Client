import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHelmet from '../components/SEOHelmet';

const HealthTipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, this would come from an API
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
        <div class="prose max-w-none dark:prose-invert">
          <p class="lead">Vitamins are essential nutrients that play vital roles in maintaining our health and well-being. While our bodies can produce some vitamins, many must be obtained through diet or supplements.</p>
          
          <h2>Key Vitamins and Their Benefits</h2>
          
          <h3>Vitamin A</h3>
          <p>Supports vision, immune function, and skin health. Found in carrots, sweet potatoes, and leafy greens.</p>
          
          <h3>B Vitamins</h3>
          <p>Crucial for energy production and brain function. Include B12, folate, and B6 in your diet through whole grains, meat, and legumes.</p>
          
          <h3>Vitamin C</h3>
          <p>A powerful antioxidant that supports immune health and collagen production. Citrus fruits, strawberries, and bell peppers are excellent sources.</p>
          
          <h3>Vitamin D</h3>
          <p>Essential for bone health and immune function. Get it from sunlight exposure, fatty fish, and fortified foods.</p>
          
          <h3>Vitamin E</h3>
          <p>Protects cells from damage and supports skin health. Nuts, seeds, and vegetable oils are rich sources.</p>
          
          <h3>Vitamin K</h3>
          <p>Important for blood clotting and bone health. Found in leafy greens like kale and spinach.</p>
          
          <h2>Tips for Optimal Vitamin Intake</h2>
          
          <ul>
            <li>Eat a varied diet with colorful fruits and vegetables</li>
            <li>Consider supplements if you have dietary restrictions</li>
            <li>Consult with a healthcare provider before starting any supplement regimen</li>
            <li>Be mindful of fat-soluble vitamins (A, D, E, K) which can accumulate in the body</li>
          </ul>
          
          <blockquote>
            <p>"A balanced diet is the foundation of good health. Vitamins work best when they work together."</p>
            <cite>— Dr. Sarah Johnson, Nutrition Specialist</cite>
          </blockquote>
          
          <h2>When to Consider Supplements</h2>
          <p>While whole foods should be your primary source of vitamins, supplements can be beneficial in certain situations:</p>
          
          <ul>
            <li>Pregnancy or breastfeeding</li>
            <li>Strict dietary restrictions (vegan, gluten-free, etc.)</li>
            <li>Medical conditions affecting absorption</li>
            <li>Older age reducing nutrient absorption</li>
          </ul>
          
          <p>Remember, more isn't always better. Excessive intake of certain vitamins can be harmful. Always follow recommended daily allowances unless directed otherwise by a healthcare provider.</p>
        </div>
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
        <div class="prose max-w-none dark:prose-invert">
          <p class="lead">Proper medication storage is crucial for maintaining effectiveness and preventing dangerous degradation. Incorrect storage can render medications ineffective or even harmful.</p>
          
          <h2>General Storage Guidelines</h2>
          
          <h3>Temperature</h3>
          <p>Most medications should be stored at room temperature (68-77°F or 20-25°C) away from heat and moisture.</p>
          
          <h3>Humidity</h3>
          <p>Keep medications in dry places. Avoid storing in bathrooms where humidity levels fluctuate.</p>
          
          <h3>Light</h3>
          <p>Many medications are sensitive to light. Store in original containers or cabinets away from direct sunlight.</p>
          
          <h3>Child Safety</h3>
          <p>Keep all medications in child-resistant containers and store in high, locked cabinets.</p>
          
          <h2>Special Storage Requirements</h2>
          
          <h3>Refrigerated Medications</h3>
          <p>Some medications like insulin require refrigeration. Do not freeze unless specified.</p>
          
          <h3>Travel Storage</h3>
          <p>When traveling, keep medications in carry-on luggage and maintain temperature control.</p>
          
          <h3>Disposal</h3>
          <p>Never flush medications down the toilet. Use pharmacy take-back programs or FDA guidelines for safe disposal.</p>
          
          <blockquote>
            <p>"The bathroom medicine cabinet might be convenient, but it's one of the worst places to store medications due to heat and humidity."</p>
            <cite>— Pharmacist Mike Chen</cite>
          </blockquote>
          
          <h2>Common Storage Mistakes</h2>
          
          <ul>
            <li>Storing in the refrigerator when not required</li>
            <li>Leaving medications in hot cars</li>
            <li>Transferring to different containers</li>
            <li>Ignoring expiration dates</li>
          </ul>
          
          <p>Always check the medication label for specific storage instructions. When in doubt, consult your pharmacist for guidance.</p>
        </div>
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
        <div class="prose max-w-none dark:prose-invert">
          <p class="lead">Drug interactions occur when two or more medications react with each other, potentially altering their effectiveness or causing harmful side effects. Understanding these interactions is crucial for safe medication use.</p>
          
          <h2>Types of Drug Interactions</h2>
          
          <h3>Drug-Drug Interactions</h3>
          <p>Occur when two prescribed medications interact. Common examples include blood thinners interacting with pain relievers.</p>
          
          <h3>Drug-Food Interactions</h3>
          <p>Certain foods can affect how medications are absorbed. Grapefruit juice is a well-known example that can interfere with several medications.</p>
          
          <h3>Drug-Supplement Interactions</h3>
          <p>Herbal supplements and vitamins can interact with prescription medications, sometimes dangerously.</p>
          
          <h2>Prevention Strategies</h2>
          
          <ul>
            <li>Always inform your healthcare provider of all medications, supplements, and herbal remedies you take</li>
            <li>Use one pharmacy for all prescriptions to allow for interaction checking</li>
            <li>Read medication labels carefully for food and alcohol warnings</li>
            <li>Keep an updated medication list with you at all times</li>
          </ul>
          
          <blockquote>
            <p>"Communication is the best prevention. Never assume your doctor or pharmacist knows everything you're taking."</p>
            <cite>— Dr. Emily Rodriguez, Clinical Pharmacologist</cite>
          </blockquote>
          
          <h2>When to Seek Help</h2>
          
          <p>If you experience unexpected side effects after starting a new medication or changing doses, contact your healthcare provider immediately. Pharmacists are also excellent resources for interaction information.</p>
          
          <h3>Red Flag Symptoms</h3>
          
          <ul>
            <li>Unusual bleeding or bruising</li>
            <li>Severe dizziness or drowsiness</li>
            <li>Rapid heartbeat or chest pain</li>
            <li>Difficulty breathing</li>
            <li>Severe nausea or vomiting</li>
          </ul>
          
          <p>Keep emergency contact information for your healthcare providers easily accessible. In case of severe reactions, don't hesitate to call emergency services.</p>
        </div>
      `
    }
  ];

  const tip = healthTips.find(t => t.id.toString() === id);

  if (!tip) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Health Tip Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The health tip you're looking for doesn't exist or has been removed.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate(-1)}>Go Back</Button>
              <Link to="/health-tips">
                <Button variant="outline">View All Tips</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet 
        title={`${tip.title} - Health Tips - CureBay`}
        description={tip.excerpt}
        keywords={`${tip.category.toLowerCase()}, health advice, medical tips, ${tip.title.toLowerCase()}`}
        type="article"
      />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/health-tips" className="flex items-center text-cyan-200 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Health Tips</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {tip.category}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{tip.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-cyan-100">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{tip.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{tip.readTime}</span>
                  </div>
                  <div>
                    <span>{new Date(tip.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <img 
                  src={tip.image} 
                  alt={tip.title} 
                  className="w-full md:w-64 h-40 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
            dangerouslySetInnerHTML={{ __html: tip.content }}
          />
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-gray-600 dark:text-gray-400">
                Written by <span className="font-semibold">{tip.author}</span> on {new Date(tip.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <Link to="/health-tips">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Health Tips
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthTipDetailPage;