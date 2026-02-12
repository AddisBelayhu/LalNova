const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@lalnova.com' },
    update: {},
    create: {
      fullName: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@lalnova.com',
      passwordHash: hashedPassword,
      role: 'ADMIN'
    }
  });

  // Create services
  const services = [
    {
      title: 'Custom Software Development',
      description: 'Tailored software solutions built with cutting-edge technologies to meet your specific business needs.',
      icon: 'code',
      category: 'SOFTWARE_DEV'
    },
    {
      title: 'IT Consulting',
      description: 'Strategic technology consulting to optimize your IT infrastructure and drive digital transformation.',
      icon: 'consulting',
      category: 'CONSULTANCY'
    },
    {
      title: 'Cloud Solutions',
      description: 'Scalable cloud architecture and migration services for enhanced performance and cost efficiency.',
      icon: 'cloud',
      category: 'CLOUD'
    },
    {
      title: 'System Integration',
      description: 'Seamless integration of disparate systems to create unified, efficient business processes.',
      icon: 'integration',
      category: 'INTEGRATION'
    }
  ];

  // Clear existing data and create new services
  await prisma.service.deleteMany({});
  for (const service of services) {
    await prisma.service.create({
      data: service
    });
  }

  // Create sample projects
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A modern, scalable e-commerce solution with advanced analytics and inventory management.',
      technologiesUsed: 'React, Node.js, PostgreSQL, AWS',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500',
      link: 'https://example-ecommerce.com'
    },
    {
      title: 'Healthcare Management System',
      description: 'Comprehensive healthcare platform for patient management and medical records.',
      technologiesUsed: 'Vue.js, Express, MongoDB, Docker',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500',
      link: 'https://example-healthcare.com'
    },
    {
      title: 'Financial Analytics Dashboard',
      description: 'Real-time financial data visualization and reporting platform for investment firms.',
      technologiesUsed: 'Angular, Python, PostgreSQL, D3.js',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
      link: 'https://example-finance.com'
    }
  ];

  // Clear existing data and create new projects
  await prisma.project.deleteMany({});
  for (const project of projects) {
    await prisma.project.create({
      data: project
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });