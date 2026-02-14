# Jobs Table Setup

## 📝 Overview
This guide will help you set up the jobs table for the EventIQ marketplace where organizers can post gigs and vendors can view them.

## 🚀 Steps to Set Up

### 1. Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### 2. Run the Jobs Table Schema
1. Open the file `jobs-table-schema.sql` in this project
2. Copy all the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### 3. Verify the Table was Created
Run this query in the SQL Editor to check:
```sql
SELECT * FROM public.jobs LIMIT 5;
```

If you see a table with 0 rows, you're all set! ✅

## 🎯 What This Creates

### Tables
- **jobs** - Stores all gigs/jobs posted by organizers

### Columns in jobs table:
- `id` - Unique job ID (UUID)
- `organizer_id` - References the organizer who posted it
- `title` - Job title
- `description` - Detailed job description
- `category` - Job category (catering, photography, etc.)
- `budget_min` - Minimum budget
- `budget_max` - Maximum budget
- `location` - Full location string (City, Country)
- `country` - Country
- `city` - City
- `event_date` - When the event will take place
- `attendees` - Number of expected attendees
- `duration` - Event duration (e.g., "2 days")
- `status` - Job status (open, in_progress, completed, cancelled)
- `proposals_count` - Number of proposals received
- `created_at` - When the job was posted
- `updated_at` - Last updated timestamp

### RLS Policies Created:
- ✅ Anyone can view open jobs
- ✅ Organizers can create jobs
- ✅ Organizers can update their own jobs
- ✅ Organizers can delete their own jobs

## 🎉 How It Works

### For Organizers:
1. Log in as an organizer
2. Click "Create Gig" on the homepage
3. Fill out the gig details (title, description, budget, location, etc.)
4. Click "Post Gig"
5. The gig will appear on all vendors' job listings with a "NEW" badge

### For Vendors:
1. Log in as a vendor
2. Click "Browse Jobs" on the homepage
3. See all available gigs (newest real jobs appear at the top)
4. Demo jobs are shown below real jobs for demonstration purposes
5. Real jobs have a green "NEW" badge

## 🔍 Testing

To test that everything works:

1. **Create an organizer account** if you don't have one
2. **Log in as organizer** and create a test gig
3. **Log out** and **log in as a vendor**
4. **Go to Browse Jobs** - you should see your new gig at the top with a "NEW" badge

## 📊 Sample Data

The system comes pre-loaded with 6 demo jobs for demonstration purposes. Real jobs created by organizers will always appear at the top of the list.

## ⚠️ Troubleshooting

### Error: "relation 'jobs' does not exist"
- You haven't run the schema yet. Go back to Step 2.

### Error: "permission denied for table jobs"
- RLS policies might not have been created. Run the schema again.

### Jobs not appearing
- Check that the job status is 'open'
- Verify the job was created successfully in Supabase Table Editor

## 🎨 Features

- ✨ Real-time job posting
- 🏷️ Category filtering
- 🆕 "NEW" badge for real jobs
- 📍 Location-based listings
- 💰 Budget ranges
- 📅 Event dates
- 👥 Attendee counts
- ⏱️ "Posted X ago" timestamps

Enjoy your EventIQ marketplace! 🎉
