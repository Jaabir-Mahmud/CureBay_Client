import React from 'react';
import { Calendar, Clock, ArrowRight, Play, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <Heart className="w-3 h-3 mr-1" />
                Checkup
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                High Quality Checkup
                <br />
                <span className="text-gray-700">Makes You Healthy</span>
              </h1>
            </div>

            {/* Appointment Scheduling */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Tuesday, 1 Jun 24</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">8am</span>
                </div>
              </div>
              
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3">
                <span className="mr-2">Guides</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Reserve Button */}
            <Button 
              size="lg" 
              className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-2xl text-lg font-medium"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Reserve A Checkup
            </Button>

            {/* Address */}
            <div className="text-gray-600 text-sm">
              <p>306 Chapmans Lane San</p>
              <p>Ysidro, NM 87053</p>
            </div>
          </div>

          {/* Right Content - Interactive Elements */}
          <div className="relative">
            {/* Patient History Card */}
            <div className="absolute top-0 left-0 bg-white rounded-2xl p-4 shadow-lg border z-10 transform -rotate-2">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">B</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Brian</p>
                  <p className="text-xs text-gray-500">19 y.o (Male)</p>
                </div>
                <Badge className="bg-orange-100 text-orange-700 text-xs">18%</Badge>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">+10.57</p>
              </div>
            </div>

            {/* Heart Rate Card */}
            <div className="absolute top-20 right-0 bg-white rounded-2xl p-4 shadow-lg border z-10 transform rotate-1">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span className="text-sm font-medium">Heart</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Beep (80 bpm)</p>
              <div className="text-right">
                <p className="text-lg font-bold">74</p>
              </div>
            </div>

            {/* Central Circle with Play Button */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Large Circle Background */}
                <div className="w-96 h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center">
                  {/* Inner Circle */}
                  <div className="w-80 h-80 bg-white rounded-full shadow-lg flex items-center justify-center">
                    {/* Play Button */}
                    <Button 
                      size="lg" 
                      className="w-16 h-16 rounded-full bg-gray-900 hover:bg-gray-800 shadow-xl"
                    >
                      <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 shadow-md">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <span className="text-sm font-medium">Tue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right - Rights Reserved */}
            <div className="absolute bottom-0 right-0 text-xs text-gray-400">
              All rights reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

