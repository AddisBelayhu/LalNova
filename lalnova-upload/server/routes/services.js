const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

module.exports = router;