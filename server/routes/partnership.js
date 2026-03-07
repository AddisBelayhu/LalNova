const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

// Submit partnership inquiry
router.post('/', async (req, res) => {
  try {
    const {
      partnershipName,
      partnerType,
      streetAddress,
      city,
      stateRegion,
      zipCode,
      country,
      contactName,
      contactEmail,
      phoneNumber,
      message,
      keepUpdated
    } = req.body;

    const inquiry = await prisma.partnershipInquiry.create({
      data: {
        partnershipName,
        partnerType,
        streetAddress,
        city,
        stateRegion,
        zipCode,
        country,
        contactName,
        contactEmail,
        phoneNumber,
        message,
        keepUpdated: keepUpdated || false
      }
    });

    res.status(201).json({ 
      message: 'Partnership inquiry submitted successfully',
      inquiry 
    });
  } catch (error) {
    console.error('Partnership inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit partnership inquiry' });
  }
});

module.exports = router;
