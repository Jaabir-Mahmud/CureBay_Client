import React from 'react';
import { 
  Megaphone, 
  Monitor, 
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  Power
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

function MarketingTab({ 
  heroSlides, 
  bannerAds, 
  openHeroSlideModal, 
  openBannerModal, 
  deleteHeroSlide, 
  deleteBanner,
  toggleHeroSlideStatus,
  toggleBannerStatus
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Marketing Tools</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Manage banners, hero slides, and promotional content</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openHeroSlideModal()} className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Add Hero Slide
          </Button>
          <Button onClick={() => openBannerModal()} className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Add Banner
          </Button>
        </div>
      </div>

      {/* Hero Slides Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Hero Slides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroSlides.map((slide) => (
              <Card key={slide._id} className="overflow-hidden">
                <div className="relative">
                  {slide.image ? (
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="font-bold text-white truncate">{slide.title}</h3>
                    <p className="text-xs text-gray-200 truncate">{slide.subtitle}</p>
                  </div>
                  <Badge 
                    variant={slide.active ? 'default' : 'secondary'}
                    className="absolute top-2 right-2"
                  >
                    {slide.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {slide.buttonText}
                    </span>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => openHeroSlideModal(slide)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => toggleHeroSlideStatus(slide._id)}
                      >
                        <Power className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => deleteHeroSlide(slide._id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {heroSlides.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No hero slides found. Add your first hero slide to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Banner Ads Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Banner Advertisements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bannerAds.map((banner) => (
              <Card key={banner._id}>
                <div className="flex gap-4 p-4">
                  {banner.image ? (
                    <img 
                      src={banner.image} 
                      alt={banner.title} 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Image className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{banner.title}</h3>
                      <Badge 
                        variant={banner.active ? 'default' : 'secondary'}
                        className="ml-2 flex-shrink-0"
                      >
                        {banner.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {banner.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Priority: {banner.priority}</span>
                      <span>•</span>
                      <span>{banner.views || 0} views</span>
                      <span>•</span>
                      <span>{banner.clicks || 0} clicks</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <Button size="sm" variant="outline" className="h-8" asChild>
                        <a href={banner.link} target="_blank" rel="noopener noreferrer">
                          View Link
                        </a>
                      </Button>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => openBannerModal(banner)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0"
                          onClick={() => toggleBannerStatus(banner._id)}
                        >
                          <Power className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => deleteBanner(banner._id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {bannerAds.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No banner advertisements found. Add your first banner to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MarketingTab;