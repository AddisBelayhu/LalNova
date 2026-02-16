const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
// Load .env from server folder (works when run from project root on cPanel)
require('dotenv').config({ path: path.join(__dirname, '.env') });
// Local dev: if .env.development exists, it overrides (use local DATABASE_URL; keep .env for production)
const devEnvPath = path.join(__dirname, '.env.development');
if (fs.existsSync(devEnvPath)) {
  require('dotenv').config({ path: devEnvPath, override: true });
}

// Log file for cPanel (when no log view): server/logs/app.log
const logsDir = path.join(__dirname, 'logs');
const logFile = path.join(logsDir, 'app.log');
if (process.env.NODE_ENV === 'production') {
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  var logStream = fs.createWriteStream(logFile, { flags: 'a' });
}

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration (production: comma-separated origins e.g. https://lalnova.com,https://admin.lalnova.com)
const productionOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
  : ['https://lalnova.com'];
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? productionOrigins
    : [
        process.env.CLIENT_URL || 'http://localhost:3000',
        process.env.ADMIN_URL || 'http://localhost:3001'
      ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Logging (production: also write to server/logs/app.log for cPanel File Manager)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: process.env.NODE_ENV === 'production' && logStream ? logStream : process.stdout
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const errMsg = `[${new Date().toISOString()}] ${err.stack}\n`;
  console.error(err.stack);
  if (process.env.NODE_ENV === 'production' && logStream) logStream.write(errMsg);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  const msg = `[${new Date().toISOString()}] Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})\n`;
  console.log(msg.trim());
  if (process.env.NODE_ENV === 'production' && logStream) logStream.write(msg);
});