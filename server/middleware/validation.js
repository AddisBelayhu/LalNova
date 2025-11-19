const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  contact: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
    message: Joi.string().min(10).max(1000).required()
  }),

  service: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    icon: Joi.string().required(),
    category: Joi.string().valid('SOFTWARE_DEV', 'CONSULTANCY', 'CLOUD', 'INTEGRATION').required()
  }),

  project: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    technologiesUsed: Joi.array().items(Joi.string()).min(1).required(),
    imageUrl: Joi.string().uri().optional(),
    link: Joi.string().uri().optional()
  })
};

module.exports = { validateRequest, schemas };