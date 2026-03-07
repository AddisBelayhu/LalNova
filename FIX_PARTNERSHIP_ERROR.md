# Fix "Failed to submit partnership inquiry" Error

## Problem
The partnership form shows "Failed to submit partnership inquiry" because the database table doesn't exist yet.

## Solution - Run Database Migration

### Step 1: Open Terminal in Server Folder

Open a terminal/command prompt and navigate to the server folder:

```bash
cd server
```

### Step 2: Run Database Migration

Run ONE of these commands:

**Option A: Using Prisma Migrate (Recommended)**
```bash
npx prisma migrate dev --name add_partnership_inquiries
```

**Option B: Using Prisma DB Push (Faster)**
```bash
npx prisma db push
```

**Option C: Run SQL Manually**
If the above don't work, run the SQL directly in your MySQL database:

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

### Step 3: Restart Backend Server

After running the migration, restart your backend server:

```bash
# Stop the server (Ctrl+C)
# Then start it again:
npm start
```

### Step 4: Test Partnership Form

1. Go to: `http://localhost:3000/partnership`
2. Fill out the form
3. Submit
4. Should now work successfully!

### Step 5: Verify in Admin Dashboard

1. Go to: `http://localhost:3001/dashboard`
2. Click "Partnerships" tab
3. You should see the submitted partnership inquiry

## Alternative: Use MySQL Workbench or phpMyAdmin

If you prefer a GUI:

1. Open MySQL Workbench or phpMyAdmin
2. Select your database (e.g., `lalnova_dev`)
3. Run the SQL query from Option C above
4. Restart backend server
5. Test the form

## Verify Table Was Created

Run this query to check:

```sql
SHOW TABLES LIKE 'partnership_inquiries';
```

Should return one row showing the table exists.

Or check table structure:

```sql
DESCRIBE partnership_inquiries;
```

Should show all the columns.

## Common Issues

### Issue 1: "Table already exists"
If you get this error, the table is already created. Just restart the backend server.

### Issue 2: "Cannot connect to database"
Check your `server/.env` file has correct DATABASE_URL:
```env
DATABASE_URL="mysql://root@localhost:3306/lalnova_dev"
```

### Issue 3: "Prisma not found"
Install Prisma:
```bash
cd server
npm install
```

### Issue 4: Backend not running
Make sure backend is running:
```bash
cd server
npm start
```

Should show: "Server running on port 5000"

## Quick Test

After fixing, test with this curl command:

```bash
curl -X POST http://localhost:5000/api/partnership \
  -H "Content-Type: application/json" \
  -d '{
    "partnershipName": "Test Company",
    "partnerType": "Technology Partner",
    "streetAddress": "123 Test St",
    "city": "Test City",
    "zipCode": "12345",
    "country": "Ethiopia",
    "contactName": "Test User",
    "contactEmail": "test@example.com",
    "phoneNumber": "+251123456789"
  }'
```

Should return success message.

## Summary

The fix is simple:
1. Create the database table (run migration)
2. Restart backend server
3. Test the form

That's it! The partnership form should now work perfectly. 🎉
