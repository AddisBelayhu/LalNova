// Mock data for frontend-only deployment
export const mockServices = [
  {
    id: 1,
    title: 'Custom Software Development',
    description: '<p>We build tailored software solutions that perfectly align with your business needs. From web applications to mobile apps, our expert team delivers high-quality, scalable solutions.</p>',
    category: 'SOFTWARE_DEV',
    icon: 'code',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Cloud Solutions',
    description: '<p>Migrate your infrastructure to the cloud with confidence. We provide comprehensive cloud services including AWS, Azure, and Google Cloud implementations.</p>',
    category: 'CLOUD',
    icon: 'cloud',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'IT Consulting',
    description: '<p>Strategic technology guidance to help your business thrive. Our consultants provide expert advice on digital transformation and technology optimization.</p>',
    category: 'CONSULTING',
    icon: 'consulting',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'System Integration',
    description: '<p>Seamlessly connect your existing systems and applications. We ensure smooth data flow and communication between all your business tools.</p>',
    category: 'INTEGRATION',
    icon: 'integration',
    createdAt: new Date().toISOString()
  }
];

export const mockProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A comprehensive online shopping platform with advanced features including real-time inventory management, secure payment processing, and customer analytics.',
    imageUrl: '',
    link: '#',
    technologiesUsed: 'React, Node.js, MongoDB, Stripe',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Healthcare Management System',
    description: 'An integrated healthcare solution streamlining patient records, appointment scheduling, and medical billing processes for improved efficiency.',
    imageUrl: '',
    link: '#',
    technologiesUsed: 'Vue.js, Python, PostgreSQL, AWS',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Financial Analytics Dashboard',
    description: 'A powerful analytics platform providing real-time financial insights, automated reporting, and predictive analytics for better decision-making.',
    imageUrl: '',
    link: '#',
    technologiesUsed: 'Angular, Express, MySQL, D3.js',
    createdAt: new Date().toISOString()
  }
];

// Check if we're in production without backend
export const isStaticDeployment = () => {
  return process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL;
};
