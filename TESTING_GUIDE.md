# 🧪 Mnet WiFi Portal - Testing Guide

## ✅ Sample Data Successfully Created!

Your database has been populated with realistic test data. Here's what's available:

---

## 📊 Sample Data Summary

### 👥 Users (10 Total)
- **1 Admin User**
- **9 Regular Users**

### 📋 Subscription Tiers (7 Plans)
1. **1 Hour Plan** - KSH 10
2. **3 Hour Plan** - KSH 20
3. **6 Hour Plan** - KSH 30
4. **12 Hour Plan** - KSH 50
5. **24 Hour Plan** - KSH 80
6. **Weekly Plan** - KSH 300
7. **Monthly Plan** - KSH 1000

### 📈 Other Data
- **6 Active Subscriptions** (various users with different plans)
- **9 Loyalty Records** (users with points ranging from 10-500)
- **12 Feedback Entries** (ratings and comments)
- **5 Complaints** (2 resolved, 3 pending)
- **16 Notifications** (various types)

---

## 🔐 Test Credentials

### Admin Account
```
Email: admin@mnet.com
Password: admin123
```

### Regular User Accounts
All regular users have the same password: `password123`

Available user emails:
- `john@example.com` - Has subscription
- `jane@example.com` - Has subscription
- `bob@example.com` - Has subscription
- `alice@example.com` - Inactive user
- `charlie@example.com` - Has subscription
- `diana@example.com` - Has subscription
- `eve@example.com` - Has subscription
- `frank@example.com` - Inactive user
- `grace@example.com` - No subscription

---

## 🧪 Testing Scenarios

### 🎯 Scenario 1: Admin - Manage Subscription Tiers

**Steps:**
1. Login as admin (`admin@mnet.com` / `admin123`)
2. Navigate to **Dashboard** or **Admin Panel**
3. Click on **📊 Subscription Tiers** tab
4. **View existing tiers** - You should see 7 pre-loaded plans
5. **Create a new tier:**
   - Click "Create New Tier"
   - Fill in the form:
     - Name: "2 Hour Plan"
     - Price: 15
     - Duration: 2 (hours)
     - Speed Limit: 15
     - Data Limit: 1000
     - Description: "Perfect for medium browsing"
   - Click "Create Tier"
6. **Edit a tier:**
   - Click "Edit" on any tier
   - Change the price or description
   - Click "Update Tier"
7. **Delete a tier:**
   - Click "Delete" on a tier
   - Confirm deletion

**Expected Results:**
- All tiers display correctly in a table
- New tier is created and appears in the list
- Edited tier shows updated information
- Deleted tier is removed from the list

---

### 🎯 Scenario 2: Admin - View Active Users

**Steps:**
1. Login as admin
2. Go to **👥 Active Users** tab
3. Review the user table

**Expected Results:**
- Table shows all 10 users
- Columns display:
  - User ID
  - Name
  - Email
  - Phone Number
  - Device ID (may be null)
  - Subscription Tier (e.g., "24 Hour Plan" or null)
  - Activation Time
  - Activity Status (Active/Inactive badge)
  - Usage (MB)
  - Disconnect button

**Test Actions:**
- Click "Disconnect" on an active user
- User should be disconnected (status changes)

---

### 🎯 Scenario 3: Admin - View Loyalty Program

**Steps:**
1. Login as admin
2. Go to **🎁 Loyalty Program** tab
3. Review loyalty records

**Expected Results:**
- Table shows 9 users with loyalty points
- Each record displays:
  - User ID
  - Name
  - Email
  - Phone Number
  - Device ID
  - Points Earned (ranging from 10-500)

---

### 🎯 Scenario 4: Admin - Review Feedback & Complaints

**Steps:**
1. Login as admin
2. Go to **💬 Feedback & Complaints** tab
3. Review both sections

**Expected Results:**

**Service Ratings Section:**
- Shows 12 feedback entries
- Each entry displays:
  - User ID
  - Tier rated
  - Star rating (⭐⭐⭐⭐⭐)
  - Comment
  - Date submitted
  - Reply button

**Complaints Section:**
- Shows 5 complaints
- Each entry displays:
  - Subject
  - Description
  - User ID
  - Status badge (Pending/Resolved)
  - Admin Response (if resolved)
  - Reply button

**Test Actions:**
- Click "Reply" on a pending complaint
- Enter a response
- Submit the reply
- Complaint status should update to "Resolved"

---

### 🎯 Scenario 5: Admin - Send Mass Communications

**Steps:**
1. Login as admin
2. Go to **📧 Communications** tab
3. Test sending messages

**Test Cases:**

**A. Send Email to All Users:**
- Message: "Special offer: 20% off all weekly plans!"
- Channel: Email
- Recipients: All Users
- Click "Send Message"

**B. Send SMS to Active Users:**
- Message: "Your subscription expires soon. Renew now!"
- Channel: SMS
- Recipients: Active Users Only
- Click "Send Message"

**C. Send to Specific Users:**
- Message: "Thank you for being a loyal customer!"
- Channel: Both (Email & SMS)
- Recipients: Specific Users
- Enter user IDs: 2, 3, 4
- Click "Send Message"

**Expected Results:**
- Success message appears
- Notifications are created in the database
- Users can see notifications in their dashboard

---

### 🎯 Scenario 6: User - View and Subscribe to Plans

**Steps:**
1. Login as a regular user (e.g., `grace@example.com` / `password123`)
2. Go to **Dashboard**
3. Click on **📶 View Plans** tab

**Expected Results:**
- Grid displays all 7 subscription plans
- Each plan card shows:
  - Plan name
  - Price (KSH)
  - Duration (hours)
  - Speed limit (Mbps)
  - Data limit (MB)
  - Description
  - "Subscribe Now" button

**Test Actions:**
- Click "Subscribe Now" on the "3 Hour Plan"
- Success message appears
- Subscription is created
- Loyalty points are awarded (+10 points)

---

### 🎯 Scenario 7: User - View My Plan

**Steps:**
1. Login as a user with an active subscription (e.g., `john@example.com`)
2. Go to **📋 My Plan** tab

**Expected Results:**
- Displays current subscription details:
  - Plan Type (e.g., "24 Hour Plan")
  - Status badge (Active/Expired)
  - Time In (start date/time)
  - Time Expected Out (end date/time)
  - Speed Limit
  - Data Limit

**For users without subscription:**
- Shows message: "You don't have an active subscription"
- Button to "View Available Plans"

---

### 🎯 Scenario 8: User - Loyalty Program

**Steps:**
1. Login as any regular user
2. Go to **🎁 Loyalty Program** tab

**Expected Results:**
- Large circular display showing available points balance
- Points breakdown:
  - Total Earned
  - Available Balance
  - Redeemed
- "🎁 Redeem Points" button

**Test Actions:**
- Click "Redeem Points"
- Confirmation dialog appears
- Points are redeemed
- Balance updates to 0
- Total redeemed increases

---

### 🎯 Scenario 9: User - Submit Feedback

**Steps:**
1. Login as any regular user
2. Go to **💬 Feedback & Complaints** tab
3. Use the **Feedback Form** (left side)

**Test Actions:**
- Select a tier from dropdown (e.g., "3 Hour Plan")
- Enter rating: 5
- Enter comment: "Excellent service! Very fast and reliable."
- Click "Submit Feedback"

**Expected Results:**
- Success message appears
- Form resets
- Feedback is saved to database
- Admin can see it in the Feedback & Complaints tab

---

### 🎯 Scenario 10: User - File a Complaint

**Steps:**
1. Login as any regular user
2. Go to **💬 Feedback & Complaints** tab
3. Use the **Complaint Form** (right side)

**Test Actions:**
- Enter subject: "Connection keeps dropping"
- Enter description: "My internet connection drops every 10 minutes. Please help!"
- Click "Submit Complaint"

**Expected Results:**
- Success message appears
- Form resets
- Complaint is saved with status "Pending"
- Admin can see it and reply

---

## 🔄 End-to-End Testing Flow

### Complete User Journey:

1. **User Registration/Login**
   - Login as `grace@example.com` / `password123`

2. **Browse Plans**
   - View all available subscription plans
   - Compare prices and features

3. **Subscribe to a Plan**
   - Subscribe to "6 Hour Plan" (KSH 30)
   - Receive 10 loyalty points

4. **Check Subscription Status**
   - Go to "My Plan" tab
   - Verify subscription is active
   - Check expiry time

5. **Earn More Points**
   - Subscribe to another plan after expiry
   - Points accumulate

6. **Redeem Points**
   - Go to Loyalty Program
   - Redeem accumulated points

7. **Provide Feedback**
   - Rate the service
   - Leave a comment

8. **File a Complaint (if needed)**
   - Report any issues
   - Wait for admin response

### Complete Admin Journey:

1. **Admin Login**
   - Login as `admin@mnet.com` / `admin123`

2. **Manage Tiers**
   - Create new subscription plans
   - Edit existing plans
   - Delete outdated plans

3. **Monitor Users**
   - View all active users
   - Check subscription status
   - Disconnect problematic users

4. **Review Loyalty Program**
   - See which users have the most points
   - Identify loyal customers

5. **Handle Feedback**
   - Read user ratings and comments
   - Reply to feedback

6. **Resolve Complaints**
   - Review pending complaints
   - Provide solutions
   - Mark as resolved

7. **Send Communications**
   - Announce promotions
   - Send renewal reminders
   - Notify about maintenance

---

## 🐛 Known Issues to Test

1. **Subscription Expiry**
   - Some subscriptions may be expired (created in the past)
   - Test how the UI handles expired subscriptions

2. **Inactive Users**
   - Users with status "inactive" should not appear in "Active Users Only" communications

3. **Empty States**
   - Test user with no subscription
   - Test user with no loyalty points
   - Test user with no notifications

---

## 📝 Testing Checklist

### Admin Features
- [ ] Login as admin
- [ ] Create new subscription tier
- [ ] Edit existing tier
- [ ] Delete tier
- [ ] View all users
- [ ] Disconnect a user
- [ ] View loyalty records
- [ ] Read feedback
- [ ] Reply to feedback
- [ ] Read complaints
- [ ] Reply to complaint
- [ ] Send email to all users
- [ ] Send SMS to active users
- [ ] Send message to specific users

### User Features
- [ ] Login as regular user
- [ ] View all available plans
- [ ] Subscribe to a plan
- [ ] View current subscription
- [ ] Check loyalty points
- [ ] Redeem loyalty points
- [ ] Submit feedback
- [ ] File a complaint
- [ ] View notifications

### Navigation
- [ ] Navigate between Home and Dashboard
- [ ] Switch between tabs smoothly
- [ ] Logout and login again
- [ ] Test as both admin and user

---

## 🚀 Quick Start Testing

**Fastest way to see everything:**

1. **Open browser:** http://localhost:5173

2. **Test as Admin:**
   ```
   Email: admin@mnet.com
   Password: admin123
   ```
   - Click through all 5 tabs
   - Try creating a new tier
   - Try replying to a complaint

3. **Logout and test as User:**
   ```
   Email: john@example.com
   Password: password123
   ```
   - Click through all 4 tabs
   - Try subscribing to a plan
   - Try submitting feedback

4. **Check the data:**
   - Verify changes appear in both admin and user views
   - Refresh the page to ensure data persists

---

## 🎉 Success Criteria

Your application is working correctly if:

✅ All pages load without errors  
✅ Admin can manage tiers, users, and communications  
✅ Users can view plans and subscribe  
✅ Loyalty points are awarded and can be redeemed  
✅ Feedback and complaints can be submitted and replied to  
✅ Navigation works smoothly between all pages  
✅ Data persists after page refresh  
✅ Both admin and user roles have appropriate access  

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors (F12)
2. Check the Flask server terminal for backend errors
3. Verify both servers are running:
   - Backend: http://127.0.0.1:5000
   - Frontend: http://localhost:5173

Happy Testing! 🎊

