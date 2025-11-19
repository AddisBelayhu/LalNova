const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

// Submit contact message (public)
router.post('/', validateRequest(schemas.contact), async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        message
      }
    });

    res.status(201).json({
      message: 'Message sent successfully',
      id: contactMessage.id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;