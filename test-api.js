// Simple test to verify API connectivity
async function testAPIs() {
  try {
    console.log('Testing API connectivity...');
    
    // Test categories API
    console.log('Fetching categories...');
    const categoriesResponse = await fetch('/api/categories');
    const categoriesData = await categoriesResponse.json();
    console.log('Categories:', categoriesData);
    
    // Test discounted medicines API
    console.log('Fetching discounted medicines...');
    const discountedResponse = await fetch('/api/medicines/discounted?limit=8');
    const discountedData = await discountedResponse.json();
    console.log('Discounted medicines:', discountedData);
    
    // Test hero slides API
    console.log('Fetching hero slides...');
    const slidesResponse = await fetch('/api/hero-slides?active=true');
    const slidesData = await slidesResponse.json();
    console.log('Hero slides:', slidesData);
    
    console.log('All API tests completed successfully!');
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Run the test
testAPIs();