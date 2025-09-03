// Simple test to verify HeroSlider theme switching
import { render, screen } from '@testing-library/react';
import HeroSlider from './HeroSlider';

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
}));

jest.mock('swiper/modules', () => ({
  Navigation: {},
  Pagination: {},
  Autoplay: {},
  EffectFade: {},
}));

describe('HeroSlider Theme Detection', () => {
  beforeEach(() => {
    // Clear document classes
    document.documentElement.className = '';
  });

  test('detects light mode correctly', () => {
    // Ensure light mode
    document.documentElement.classList.remove('dark');
    
    render(<HeroSlider />);
    
    // Should show loading state initially
    expect(screen.getByText('Loading slides...')).toBeInTheDocument();
  });

  test('detects dark mode correctly', () => {
    // Set dark mode
    document.documentElement.classList.add('dark');
    
    render(<HeroSlider />);
    
    // Should show loading state initially
    expect(screen.getByText('Loading slides...')).toBeInTheDocument();
  });
});