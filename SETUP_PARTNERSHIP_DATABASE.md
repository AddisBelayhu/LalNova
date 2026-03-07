# Setup Partnership Database - Step by Step

## Problem
Admin dashboard shows "Failed to fetch data" because the `partnership_inquiries` table doesn't exist in the database.

## Solution - Create the Database Table

### Method 1: Using Prisma CLI (Recommended)

**Step 1:** Open terminal in your project root

**Step 2:** Navigate to server folder and run migration:

```bash
cd server
npx prisma migrate dev --name add_partnership_inquiries
```

**Step 3:** Generate Prisma Client:

```bash
npx prisma generate
```

**Step 4:** Restart backend server:
- Stop server (Ctrl+C)
- Start again: `npm start`

### Method 2: Using Prisma DB Push (Faster)

```bash
cd server
npx prisma db push
npx prisma generate
```

Then restart backend server.

### Method 3: Run SQL Directly in MySQL

If Prisma commands don't work, run this SQL in your MySQL database:

**Step 1:** Open MySQL Workbench, phpMyAdmin, or MySQL command line

**Step 2:** Select your database (e.g., `lalnova_dev`)

**Step 3:** Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS `partnership_inquiries` (
  `id` VARCHAR(191) NOT NULL,
  `partnership_name` VARCHAR(191) NOT NULL,
  `partner_type` VARCHAR(191) NOT NULL,
  `street_address` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `state_region` VARCHAR(191) NULL,
  `zip_code` VARCHAR(191) NOT NULL,
  `country` VARCHAR(191) NOT NULL,
  `contact_name` VARCHAR(191) NOT NULL,
  `contact_email` VARCHAR(191) NOT NULL,
  `phone_number` VARCHAR(191) NOT NULL,
  `message` TEXT NULL,
  `keep_updated` BOOLEAN NOT NULL DEFAULT false,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Step 4:** Restart backend server

## Verify Table Was Created

Run this SQL to check:

```sql
SHOW TABLES LIKE 'partnership_inquiries';
```

Or check table structure:

```sql
DESCRIBE partnership_inquiries;
```

Should show 14 columns.

## After Creating Table

1. **Restart Backend Server:**
   ```bash
   cd server
   npm start
   ```

2. **Refresh Admin Dashboard:**
   - Go to `http://localhost:3001/dashboard`
   - The "Failed to fetch data" error should be gone
   - Partnership count should show 0

3. **Test Partnership Form:**
   - Go to `http://localhost:3000/partnership`
   - Fill and submit form
   - Check admin dashboard - should see the partnership

## Troubleshooting

### Error: "Table already exists"
✅ Good! Table is created. Just restart backend server.

### Error: "Cannot connect to database"
Check `server/.env` file:
```env
DATABASE_URL="mysql://root@localhost:3306/lalnova_dev"
```

Make sure:
- MySQL is running
- Database name is correct
- Username/password are correct

### Error: "Prisma Client not generated"
Run:
```bash
cd server
npx prisma generate
```

### Backend shows error about PartnershipInquiry
The Prisma client needs to be regenerated:
```bash
cd server
npx prisma generate
npm start
```

## Quick Test Commands

### Test if table exists:
```bash
cd server
npx prisma studio
```

This opens a GUI where you can see all tables including `partnership_inquiries`.

### Test backend endpoint:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok",...}`

## Complete Setup Checklist

- [ ] MySQL is running
- [ ] Database exists (e.g., `lalnova_dev`)
- [ ] Ran Prisma migration or SQL script
- [ ] Table `partnership_inquiries` exists
- [ ] Ran `npx prisma generate`
- [ ] Restarted backend server
- [ ] Backend shows no errors
- [ ] Admin dashboard loads without "Failed to fetch data"
- [ ] Partnership form submits successfully
- [ ] Partnerships appear in admin dashboard

## Summary

The fix requires 3 simple steps:

1. **Create table:** Run Prisma migration or SQL script
2. **Generate Prisma Client:** `npx prisma generate`
3. **Restart backend:** Stop and start server

That's it! Everything should work after this. 🎉
