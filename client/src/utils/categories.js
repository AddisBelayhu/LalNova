// Shared category utility for consistent category handling across the app

export const getCategories = () => {
  const savedCategories = localStorage.getItem('adminCategories');
  return savedCategories ? JSON.parse(savedCategories) : [
    { id: 'SOFTWARE_DEV', name: 'Software Development' },
    { id: 'CONSULTANCY', name: 'IT Consulting' },
    { id: 'CLOUD', name: 'Cloud Solutions' },
    { id: 'INTEGRATION', name: 'System Integration' }
  ];
};

export const getCategoryName = (categoryId) => {
  const categories = getCategories();
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

export const getCategoryColor = (category) => {
  const colors = {
    SOFTWARE_DEV: 'bg-blue-100 text-blue-800',
    CONSULTANCY: 'bg-green-100 text-green-800',
    CLOUD: 'bg-purple-100 text-purple-800',
    INTEGRATION: 'bg-orange-100 text-orange-800',
    DATA_ANALYTICS: 'bg-indigo-100 text-indigo-800',
    NETWORKING: 'bg-red-100 text-red-800',
    DIGITAL_TRAINING: 'bg-yellow-100 text-yellow-800',
    ERP_SOLUTIONS: 'bg-pink-100 text-pink-800',
    ICT_CONSULTANCY: 'bg-teal-100 text-teal-800',
    MOBILE_DEV: 'bg-cyan-100 text-cyan-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};