# 🔐 Admin Access Guide - LalNova Technologies

## **How to Access Admin Dashboard**

The admin dashboard is completely hidden from public users for security. Here's how to access it:

### **Method 1: Secret URL Access**

1. **Go to the secret admin access page:**
   ```
   https://yourdomain.com/secret-admin-access
   ```

2. **Enter the secret access code:**
   ```
   LALNOVA2024ADMIN
   ```

3. **You'll be redirected to the admin login page**

4. **Login with your admin credentials:**
   - Email: `vibrantteam@lalnova.com`
   - Password: `novatech@2025`

### **Method 2: Direct Admin Login (if you know the URL)**

1. **Go directly to:**
   ```
   https://yourdomain.com/admin/login
   ```

2. **Login with your admin credentials**

## **Security Features Implemented**

### **Frontend Security:**
- ✅ **No visible admin links** - Admin links only appear after login
- ✅ **Hidden routes** - Admin routes not discoverable through navigation
- ✅ **Secret access code** - Additional layer before admin login
- ✅ **Protected routes** - Authentication required for admin pages
- ✅ **Auto-redirect** - Unauthorized users redirected away

### **Backend Security:**
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-based access** - Only ADMIN role can access admin routes
- ✅ **Rate limiting** - Prevents brute force attacks
- ✅ **IP whitelisting** - Optional IP-based restrictions (production)
- ✅ **CORS protection** - Cross-origin request security

## **Changing Security Settings**

### **Change Secret Access Code:**

Edit `client/src/pages/SecretAdminAccess.js`:
```javascript
const SECRET_ACCESS_CODE = 'YOUR_NEW_SECRET_CODE';
```

### **Change Admin Credentials:**

Update your `.env` file:
```env
ADMIN_EMAIL=vibrantteam@lalnova.com
ADMIN_PASSWORD=novatech@2025
```

### **Add IP Whitelisting (Production):**

Add to your `.env.production`:
```env
ADMIN_IP_WHITELIST=192.168.1.100,203.0.113.1
```

## **Public vs Admin Separation**

### **What Public Users See:**
- ✅ Home page with services (dynamically updated by admin)
- ✅ About page
- ✅ Services page (content managed by admin)
- ✅ Projects page (managed by admin)
- ✅ Contact page
- ❌ **NO admin links or references**
- ❌ **NO way to discover admin area**

### **What Admin Users See (After Login):**
- ✅ All public pages
- ✅ Dashboard link in navigation
- ✅ Admin dashboard with full CMS features
- ✅ Rich text editor for content
- ✅ Category management
- ✅ Service/project management
- ✅ Contact message management

## **Admin Dashboard Features**

Once logged in, admins can:

1. **Manage Services:**
   - Add/edit/delete services
   - Rich text descriptions with formatting
   - Category assignment

2. **Manage Categories:**
   - Create custom service categories
   - Edit category names
   - Delete unused categories

3. **Manage Projects:**
   - Add/edit/delete portfolio projects
   - Upload images and links
   - Technology stack management

4. **View Messages:**
   - Read contact form submissions
   - Delete processed messages

## **Best Practices**

### **For Production:**
1. **Change all default passwords**
2. **Use strong, unique secret codes**
3. **Enable HTTPS/SSL**
4. **Regular security updates**
5. **Monitor access logs**
6. **Backup database regularly**

### **For Development:**
1. **Never commit secrets to git**
2. **Use environment variables**
3. **Test authentication flows**
4. **Verify route protection**

## **Emergency Access**

If you lose access to the admin area:

1. **Check server logs** for authentication errors
2. **Reset admin password** in the database
3. **Verify environment variables** are correct
4. **Check JWT secret** hasn't changed

## **Troubleshooting**

### **Error: "Invalid or expired token"**

This error occurs when the admin dashboard cannot connect to the backend API.

**Quick Fix:**
1. Rebuild admin dashboard: `cd admin && npm run build`
2. Upload `admin/dist/` to server
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try logging in again

**For detailed troubleshooting, see:**
- `ADMIN_QUICK_FIX.md` - Quick 3-step fix
- `ADMIN_TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- `ADMIN_DEPLOYMENT.md` - Full deployment instructions

### **Common Issues:**

1. **API calls going to localhost** → Rebuild admin with production config
2. **CORS errors** → Update `.env.production` CORS_ORIGIN setting
3. **404 on admin routes** → Configure web server routing (see deployment guide)
4. **Token expires immediately** → Check JWT_SECRET in server environment

## **URLs Summary**

- **Public Website:** `https://lalnova.com`
- **Secret Admin Access:** `https://lalnova.com/secret-admin-access`
- **Admin Login:** `https://lalnova.com/admin/login`
- **Admin Dashboard:** `https://lalnova.com/admin/dashboard`
- **API Health Check:** `https://lalnova.com/api/health`

## **Current Configuration**

- **Domain:** lalnova.com
- **Admin Email:** vibrantteam@lalnova.com
- **Admin Password:** novatech@2025
- **Access Code:** LALNOVA2024ADMIN
- **API Endpoint:** https://lalnova.com/api

**Remember:** Only share admin access information with authorized personnel!