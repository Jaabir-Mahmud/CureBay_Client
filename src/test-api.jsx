import React, { useEffect, useState } from 'react';

const TestAPI = () => {
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Test categories API
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Test discounted medicines API
        const medicinesResponse = await fetch('/api/medicines/discounted?limit=8');
        if (!medicinesResponse.ok) {
          throw new Error('Failed to fetch medicines');
        }
        const medicinesData = await medicinesResponse.json();
        setMedicines(medicinesData.medicines);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>API Test Results</h1>
      
      <h2>Categories ({categories.length})</h2>
      <ul>
        {categories.map(category => (
          <li key={category._id}>{category.name}</li>
        ))}
      </ul>
      
      <h2>Discounted Medicines ({medicines.length})</h2>
      <ul>
        {medicines.map(medicine => (
          <li key={medicine._id}>{medicine.name} - {medicine.category?.name || medicine.category}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestAPI;