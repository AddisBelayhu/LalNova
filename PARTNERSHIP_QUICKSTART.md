# Partnership Feature - Quick Start Guide

## Problem
Partnership form shows "Failed to submit partnership inquiry" because the database table doesn't exist.

## Solution - 3 Easy Methods

### Method 1: Run Setup Script (Easiest) ⭐

**Windows:**
```bash
setup-partnership.bat
```

**Linux/Mac:**
```bash
chmod +x setup-partnership.sh
./setup-partnership.sh
```

Then restart backend server.

### Method 2: Manual Commands

Open terminal in project root:

```bash
cd server
npx prisma db push
npx prisma generate
```

Then restart backend server.

### Method 3: Run SQL File

1. Open MySQL Workbench or phpMyAdmin
2. Select database: `lalnova_dev`
3. Open file: `create-partnership-table.sql`
4. Execute the SQL
5. Restart backend server

## After Setup

1. **Restart Backend:**
   ```bash
   cd server
   npm start
   ```

2. **Test Partnership Form:**
   - Go to: `http://localhost:3000/partnership`
   - Fill out form
   - Submit
   - Should see success message! ✅

3. **Check Admin Dashboard:**
   - Go to: `http://localhost:3001/dashboard`
   - Click "Partnerships" tab
   - See your partnership inquiry

## Verify Setup

### Check if table exists:
```sql
SHOW TABLES LIKE 'partnership_inquiries';
```

### Check table structure:
```sql
DESCRIBE partnership_inquiries;
```

Should show 14 columns.

### Test backend endpoint:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok"}`

## Troubleshooting

### "Failed to submit partnership inquiry"
- Database table not created → Run setup script
- Backend not running → Start backend: `cd server && npm start`
- Wrong database → Check `server/.env` DATABASE_URL

### "Failed to fetch data" in admin
- Table not created → Run setup script
- Prisma client not generated → Run `npx prisma generate`
- Backend not restarted → Restart backend server

### "Table already exists"
✅ Good! Just restart backend server.

### "Cannot connect to database"
Check `server/.env`:
```env
DATABASE_URL="mysql://root@localhost:3306/lalnova_dev"
```

Make sure MySQL is running.

## Complete Checklist

- [ ] MySQL is running
- [ ] Database `lalnova_dev` exists
- [ ] Ran setup script OR SQL file
- [ ] Table `partnership_inquiries` exists (verify with SQL)
- [ ] Ran `npx prisma generate` in server folder
- [ ] Restarted backend server
- [ ] Backend shows no errors in console
- [ ] Partnership form submits successfully
- [ ] Admin dashboard shows partnerships

## Quick Test

After setup, test with this data:

- **Partnership Name:** Test Company
- **Partner Type:** Technology Partner
- **Street Address:** 123 Test Street
- **City:** Addis Ababa
- **ZIP Code:** 12345
- **Country:** Ethiopia
- **Contact Name:** Test User
- **Contact Email:** test@example.com
- **Phone Number:** +251912345678

Submit and check admin dashboard!

## Files Created

- `setup-partnership.bat` - Windows setup script
- `setup-partnership.sh` - Linux/Mac setup script
- `create-partnership-table.sql` - SQL file to run manually
- `PARTNERSHIP_QUICKSTART.md` - This guide

## Need Help?

See detailed guides:
- `SETUP_PARTNERSHIP_DATABASE.md` - Detailed setup instructions
- `FIX_PARTNERSHIP_ERROR.md` - Error troubleshooting
- `PARTNERSHIP_MANAGEMENT.md` - Feature documentation

## Summary

**The fix is simple:**

1. Run `setup-partnership.bat` (Windows) or `setup-partnership.sh` (Linux/Mac)
2. Restart backend server
3. Test partnership form

That's it! 🎉
