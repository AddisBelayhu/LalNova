# LalNova Technologies - Full Stack Website

A modern, professional website for LalNova Technologies built with React.js, Node.js, Express.js, and PostgreSQL.

## 🚀 Features

### Frontend
- **React.js** with modern hooks and functional components
- **Tailwind CSS** for responsive, utility-first styling
- **React Router** for client-side routing
- **Context API** for state management
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js & Express.js** with MVC architecture
- **PostgreSQL** database with Prisma ORM
- **JWT Authentication** for admin access
- **RESTful API** design
- **Security middleware** (Helmet, CORS, Rate Limiting)
- **Input validation** with Joi
- **Error handling** and logging

### Database Models
- Users (Admin authentication)
- Services (Company services)
- Projects (Portfolio items)
- Contact Messages (Customer inquiries)

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, Context API
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd lalnova-technologies
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Database Setup
```bash
# Create a PostgreSQL database
createdb lalnova_db

# Update the DATABASE_URL in .env file
DATABASE_URL="postgresql://username:password@localhost:5432/lalnova_db"
```

### 4. Environment Configuration
Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lalnova_db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin credentials (for seeding)
ADMIN_EMAIL=admin@lalnova.com
ADMIN_PASSWORD=admin123
```

### 5. Database Migration & Seeding
```bash
# Generate Prisma client
cd server
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
node prisma/seed.js
cd ..
```

### 6. Start the application
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# Backend (from root directory)
npm run server

# Frontend (from root directory)
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Admin Access

**Default Admin Credentials:**
- Email: admin@lalnova.com
- Password: admin123

Access the admin dashboard at: http://localhost:3000/admin/login

## 📚 API Endpoints

### Public Endpoints
- `GET /api/services` - Get all services
- `GET /api/projects` - Get all projects
- `POST /api/contact` - Submit contact message

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/services` - Get services (admin)
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service
- `GET /api/admin/projects` - Get projects (admin)
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project
- `GET /api/admin/messages` - Get contact messages
- `DELETE /api/admin/messages/:id` - Delete message

## 🎨 Design System

### Colors
- **Primary**: #1E40AF (Blue)
- **Secondary**: #0F172A (Slate/Black)
- **Accent**: #38BDF8 (Sky)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)

### Components
- Rounded corners (rounded-xl)
- Shadows (shadow-lg)
- Smooth transitions
- Mobile-first responsive design

## 📱 Pages

### Public Pages
1. **Home** - Hero section, services overview, featured projects
2. **About** - Company story, mission, vision, team
3. **Services** - Detailed service listings with categories
4. **Projects** - Portfolio showcase with filtering
5. **Contact** - Contact form and company information

### Admin Pages
1. **Admin Login** - Secure authentication
2. **Admin Dashboard** - Content management interface

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database on your hosting provider
2. Update environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `cd client && npm run build`
2. Deploy to platforms like Netlify, Vercel, or serve from Express

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=your-production-frontend-url
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- SQL injection prevention with Prisma

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client && npm test
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact:
- Email: info@lalnova.com
- Phone: +1 (555) 123-4567

---

Built with ❤️ by LalNova Technologies