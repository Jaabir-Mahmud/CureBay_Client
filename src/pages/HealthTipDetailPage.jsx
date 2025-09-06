import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, BookOpen, Calendar, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHelmet from '../components/SEOHelmet';

const HealthTipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Health tips data with comprehensive content
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
        <div class="space-y-6">
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Vitamins are essential nutrients that play vital roles in maintaining our health and well-being. While our bodies can produce some vitamins, many must be obtained through diet or supplements.
          </p>
          
          <div class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-cyan-100 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart class="w-6 h-6 text-cyan-500 mr-2" />
              
            </h2>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-cyan-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Vitamin A</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Supports vision, immune function, and skin health. Found in carrots, sweet potatoes, and leafy greens.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">B Vitamins</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Crucial for energy production and brain function. Include B12, folate, and B6 in your diet through whole grains, meat, and legumes.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Vitamin C</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">A powerful antioxidant that supports immune health and collagen production. Citrus fruits, strawberries, and bell peppers are excellent sources.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Vitamin D</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Essential for bone health and immune function. Get it from sunlight exposure, fatty fish, and fortified foods.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Vitamin E</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Protects cells from damage and supports skin health. Nuts, seeds, and vegetable oils are rich sources.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-pink-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Vitamin K</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Important for blood clotting and bone health. Found in leafy greens like kale and spinach.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Tips for Optimal Vitamin Intake
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Eat a varied diet with colorful fruits and vegetables</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Consider supplements if you have dietary restrictions</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Consult with a healthcare provider before starting any supplement regimen</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Be mindful of fat-soluble vitamins (A, D, E, K) which can accumulate in the body</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                When to Consider Supplements
              </h3>
              <p class="text-gray-700 dark:text-gray-300 mb-4">While whole foods should be your primary source of vitamins, supplements can be beneficial in certain situations:</p>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Pregnancy or breastfeeding</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Strict dietary restrictions (vegan, gluten-free, etc.)</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Medical conditions affecting absorption</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Older age reducing nutrient absorption</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white mt-8">
            <blockquote class="text-xl italic">
              "A balanced diet is the foundation of good health. Vitamins work best when they work together."
            </blockquote>
            <cite class="block mt-4 text-cyan-200">— Dr. Sarah Johnson, Nutrition Specialist</cite>
          </div>
          
          <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800/50 mt-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              Important Reminder
            </h3>
            <p class="text-gray-700 dark:text-gray-300">
              Remember, more isn't always better. Excessive intake of certain vitamins can be harmful. Always follow recommended daily allowances unless directed otherwise by a healthcare provider.
            </p>
          </div>
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
        <div class="space-y-6">
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Proper medication storage is crucial for maintaining effectiveness and preventing dangerous degradation. Incorrect storage can render medications ineffective or even harmful.
          </p>
          
          <div class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-red-100 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart class="w-6 h-6 text-red-500 mr-2 flex-shrink-0" />
              <span class="flex-shrink-0"></span>
            </h2>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4 mt-1 flex-shrink-0">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Temperature</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Most medications should be stored at room temperature (68-77°F or 20-25°C) away from heat and moisture.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4 mt-1 flex-shrink-0">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Humidity</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Keep medications in dry places. Avoid storing in bathrooms where humidity levels fluctuate.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4 mt-1 flex-shrink-0">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Light</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Many medications are sensitive to light. Store in original containers or cabinets away from direct sunlight.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-4 mt-1 flex-shrink-0">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Child Safety</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Keep all medications in child-resistant containers and store in high, locked cabinets.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                Special Storage Requirements
              </h3>
              <ul class="space-y-4">
                <li class="flex items-start">
                  <div class="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg mr-3 mt-1">
                    <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Refrigerated Medications</h4>
                    <p class="text-gray-700 dark:text-gray-300 mt-1">Some medications like insulin require refrigeration. Do not freeze unless specified.</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <div class="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg mr-3 mt-1">
                    <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Travel Storage</h4>
                    <p class="text-gray-700 dark:text-gray-300 mt-1">When traveling, keep medications in carry-on luggage and maintain temperature control.</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <div class="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg mr-3 mt-1">
                    <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Disposal</h4>
                    <p class="text-gray-700 dark:text-gray-300 mt-1">Never flush medications down the toilet. Use pharmacy take-back programs or FDA guidelines for safe disposal.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Common Storage Mistakes
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Storing in the refrigerator when not required</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Leaving medications in hot cars</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Transferring to different containers</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Ignoring expiration dates</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white mt-8">
            <blockquote class="text-xl italic">
              "The bathroom medicine cabinet might be convenient, but it's one of the worst places to store medications due to heat and humidity."
            </blockquote>
            <cite class="block mt-4 text-cyan-200">— Pharmacist Mike Chen</cite>
          </div>
          
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50 mt-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Pro Tip
            </h3>
            <p class="text-gray-700 dark:text-gray-300">
              Always check the medication label for specific storage instructions. When in doubt, consult your pharmacist for guidance.
            </p>
          </div>
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
        <div class="space-y-6">
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Drug interactions occur when two or more medications react with each other, potentially altering their effectiveness or causing harmful side effects. Understanding these interactions is crucial for safe medication use.
          </p>
          
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-purple-100 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart class="w-6 h-6 text-purple-500 mr-2" />
              
            </h2>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Drug-Drug Interactions</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Occur when two prescribed medications interact. Common examples include blood thinners interacting with pain relievers.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Drug-Food Interactions</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Certain foods can affect how medications are absorbed. Grapefruit juice is a well-known example that can interfere with several medications.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Drug-Supplement Interactions</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Herbal supplements and vitamins can interact with prescription medications, sometimes dangerously.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Prevention Strategies
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Always inform your healthcare provider of all medications, supplements, and herbal remedies you take</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Use one pharmacy for all prescriptions to allow for interaction checking</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Read medication labels carefully for food and alcohol warnings</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Keep an updated medication list with you at all times</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Red Flag Symptoms
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Unusual bleeding or bruising</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Severe dizziness or drowsiness</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Rapid heartbeat or chest pain</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Difficulty breathing</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Severe nausea or vomiting</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white mt-8">
            <blockquote class="text-xl italic">
              "Communication is the best prevention. Never assume your doctor or pharmacist knows everything you're taking."
            </blockquote>
            <cite class="block mt-4 text-cyan-200">— Dr. Emily Rodriguez, Clinical Pharmacologist</cite>
          </div>
          
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/50 mt-8">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              When to Seek Help
            </h3>
            <p class="text-gray-700 dark:text-gray-300">
              If you experience unexpected side effects after starting a new medication or changing doses, contact your healthcare provider immediately. Pharmacists are also excellent resources for interaction information.
            </p>
            <p class="text-gray-700 dark:text-gray-300 mt-3">
              Keep emergency contact information for your healthcare providers easily accessible. In case of severe reactions, don't hesitate to call emergency services.
            </p>
          </div>
        </div>
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
        <div class="space-y-6">
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Managing chronic conditions often requires complex medication regimens. Developing effective strategies for adherence is essential for treatment success and quality of life.
          </p>
          
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart class="w-6 h-6 text-blue-500 mr-2" />
              
            </h2>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Organize by Time</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Group medications that should be taken together. Use pill organizers with compartments for different days and times.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Associate with Daily Routines</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Link medication times with regular activities like meals, brushing teeth, or watching the evening news.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Set Reminders</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Use phone alarms, medication apps, or smart pill dispensers to remind you when it's time for doses.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                Communication with Healthcare Providers
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Discuss side effects and concerns openly</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Ask about simplifying complex regimens when possible</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Report any missed doses or schedule changes</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Review medications regularly to ensure continued necessity</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Monitoring and Tracking
              </h3>
              <p class="text-gray-700 dark:text-gray-300">
                Keep a medication diary to track effectiveness, side effects, and adherence. This information is invaluable for healthcare provider visits and medication adjustments.
              </p>
              <div class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                <h4 class="font-semibold text-green-800 dark:text-green-200">Pro Tip:</h4>
                <p class="text-green-700 dark:text-green-300 mt-1">Use a smartphone app to log your medication intake and set up automatic refill reminders.</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white mt-8">
            <blockquote class="text-xl italic">
              "Consistency is key in chronic disease management. Small daily habits can lead to significant health improvements over time."
            </blockquote>
            <cite class="block mt-4 text-cyan-200">— Dr. James Wilson, Chronic Disease Specialist</cite>
          </div>
        </div>
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
        <div class="space-y-6">
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The line between natural remedies and prescription medications can be blurry. While some natural approaches can complement traditional treatments, others may interfere or be inadequate for serious conditions.
          </p>
          
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-green-100 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart class="w-6 h-6 text-green-500 mr-2" />
             
            </h2>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Supportive Care</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Natural remedies like ginger for nausea or chamomile for mild anxiety can provide supportive benefits alongside prescribed treatments.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-cyan-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Prevention</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Lifestyle approaches including diet, exercise, and stress management can prevent or reduce the severity of many conditions.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Mild Conditions</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">For minor issues like occasional headaches or mild digestive discomfort, natural approaches may be sufficient.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                When to Avoid Natural Substitutes
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Serious or life-threatening conditions requiring immediate intervention</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">Conditions where precise dosing is critical (like blood thinners or diabetes medications)</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">When there's a known effective treatment with proven results</span>
                </li>
                <li class="flex items-start">
                  <div class="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <span class="text-gray-700 dark:text-gray-300">During pregnancy or when taking other medications with potential interactions</span>
                </li>
              </ul>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Communication is Key
              </h3>
              <p class="text-gray-700 dark:text-gray-300">
                Always inform your healthcare provider about any natural remedies or supplements you're using. What's "natural" isn't always safe, and interactions can be just as significant as with prescription medications.
              </p>
              <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                <h4 class="font-semibold text-blue-800 dark:text-blue-200">Important:</h4>
                <p class="text-blue-700 dark:text-blue-300 mt-1">Some herbal supplements can interfere with prescription medications or affect surgical outcomes.</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white mt-8">
            <blockquote class="text-xl italic">
              "Natural doesn't always mean safe, and prescription doesn't always mean necessary. The key is informed decision-making with your healthcare team."
            </blockquote>
            <cite class="block mt-4 text-cyan-200">— Dr. Lisa Thompson, Integrative Medicine Specialist</cite>
          </div>
        </div>
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
        <div class="space-y-6">
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Prescription labels contain crucial information for safe and effective medication use. Understanding these details can prevent errors and ensure optimal treatment outcomes.
          </p>
          
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart class="w-6 h-6 text-blue-500 mr-2" />
             
            </h2>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Patient Name</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Verify this matches your name to ensure you have the correct medication.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Medication Name</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Both brand and generic names are typically listed. Be aware of both to avoid confusion.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Dosage</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">The amount of medication per dose. This may be in milligrams (mg), micrograms (mcg), or other units.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Directions</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">How often and when to take the medication. Terms like "BID" (twice daily) or "QD" (once daily) may be used.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Quantity</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Total number of pills or amount of liquid dispensed.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg mr-4 mt-1">
                  <div class="w-3 h-3 bg-cyan-500 rounded-full"></div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Refills</h3>
                  <p class="text-gray-700 dark:text-gray-300 mt-1">Number of times you can get additional supplies without a new prescription.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                Special Instructions
              </h3>
              <p class="text-gray-700 dark:text-gray-300">
                Pay attention to special instructions like "take with food," "avoid alcohol," or "do not crush." These details are critical for safety and effectiveness.
              </p>
              <div class="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
                <h4 class="font-semibold text-purple-800 dark:text-purple-200">Note:</h4>
                <p class="text-purple-700 dark:text-purple-300 mt-1">If instructions seem unclear, contact your pharmacist before taking the medication.</p>
              </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div class="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                Expiration and Storage
              </h3>
              <p class="text-gray-700 dark:text-gray-300">
                Check the expiration date and storage requirements. Expired medications should be properly disposed of, not used even if they appear unchanged.
              </p>
              <div class="mt-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800/50">
                <h4 class="font-semibold text-cyan-800 dark:text-cyan-200">Storage Tip:</h4>
                <p class="text-cyan-700 dark:text-cyan-300 mt-1">Store medications in their original containers to maintain proper labeling and identification.</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white mt-8">
            <blockquote class="text-xl italic">
              "Reading your prescription label carefully is one of the simplest yet most effective ways to ensure safe medication use."
            </blockquote>
            <cite class="block mt-4 text-cyan-200">— Pharmacist David Kim</cite>
          </div>
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

  // Get category color
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
                  <Badge variant="secondary" className={getCategoryColor(tip.category)}>
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
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-h2:mb-4 prose-h3:mb-3"
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