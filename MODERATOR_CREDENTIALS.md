# 🔑 Moderator Credentials Configuration

## 📋 **Current Default Credentials**

The following accounts are available by default:

| Username | Password | Purpose |
|----------|----------|---------|
| `moderator` | `guessops2024` | Primary booth moderator |
| `admin` | `aws-booth` | Administrative access |
| `booth` | `community-day` | Event staff access |

## ⚙️ **How to Change/Add Credentials**

### **Method 1: Edit Code Directly (Simple)**

Edit `/src/components/auth/AuthProvider.tsx` around line 19-22:

```typescript
const defaultCredentials = [
  { username: 'moderator', password: 'guessops2024' },
  { username: 'admin', password: 'aws-booth' },
  { username: 'booth', password: 'community-day' },
  // Add your custom credentials:
  { username: 'your-username', password: 'your-password' },
];
```

### **Method 2: Environment Variables (Recommended)**

1. **Create `.env.local` file** in the project root:
```bash
# Copy from template
cp env.template .env.local
```

2. **Add your custom credentials** to `.env.local`:
```env
# Your custom moderator account
NEXT_PUBLIC_MODERATOR_USERNAME=john-doe
NEXT_PUBLIC_MODERATOR_PASSWORD=secure-password-123

# Additional admin account
NEXT_PUBLIC_ADMIN_USERNAME=event-admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin-pass-456
```

3. **Restart the development server**:
```bash
npm run dev
```

## 🔐 **Security Best Practices**

### **For Booth Environment:**
- ✅ Use simple, memorable passwords for quick booth setup
- ✅ Share credentials only with authorized staff
- ✅ Change default passwords for production events
- ✅ Use different accounts for different staff members

### **For Production:**
- ✅ Use environment variables instead of hardcoded values
- ✅ Use strong, unique passwords
- ✅ Limit the number of valid accounts
- ✅ Consider implementing password expiration

## 📝 **Adding Multiple Accounts**

### **Via Code (Multiple Accounts):**
```typescript
const defaultCredentials = [
  // Booth staff
  { username: 'moderator1', password: 'booth-pass-1' },
  { username: 'moderator2', password: 'booth-pass-2' },
  
  // Event organizers
  { username: 'event-lead', password: 'lead-pass-123' },
  { username: 'tech-support', password: 'support-pass-456' },
  
  // Backup accounts
  { username: 'backup', password: 'emergency-pass' },
];
```

### **Via Environment Variables (Multiple Accounts):**
```env
# Primary accounts
NEXT_PUBLIC_MODERATOR_USERNAME=primary-mod
NEXT_PUBLIC_MODERATOR_PASSWORD=primary-pass

NEXT_PUBLIC_ADMIN_USERNAME=event-admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin-pass

# You can add more by modifying the AuthProvider code
```

## 🎪 **Booth Operation Recommendations**

### **Account Strategy:**
1. **`moderator`** - Main booth operator account
2. **`admin`** - Event organizer/supervisor account  
3. **`booth`** - Backup account for additional staff
4. **Custom accounts** - Specific named accounts for different shifts

### **Password Strategy:**
- **Easy to remember** - For quick booth setup
- **Event-specific** - Include event name/date
- **Role-based** - Different passwords for different roles
- **Backup ready** - Have emergency credentials available

## 🔧 **Troubleshooting**

### **Login Not Working:**
1. Check username/password spelling (case-sensitive)
2. Verify credentials are properly added to code/environment
3. Restart development server after changes
4. Check browser console for error messages

### **Environment Variables Not Loading:**
1. Ensure `.env.local` file is in project root
2. Variable names must start with `NEXT_PUBLIC_`
3. Restart development server after adding variables
4. Check that `.env.local` is not in `.gitignore`

### **Multiple Accounts Not Working:**
1. Verify all accounts are added to the `VALID_CREDENTIALS` array
2. Check for typos in usernames/passwords
3. Ensure environment variables are properly formatted
4. Test each account individually

## 📋 **Quick Setup Checklist**

- [ ] Choose your preferred method (code edit vs environment variables)
- [ ] Set strong, memorable passwords
- [ ] Test login with each account
- [ ] Document credentials securely for booth staff
- [ ] Set up backup accounts
- [ ] Test on actual booth hardware/TV
- [ ] Prepare emergency access procedures

## 🎯 **Example Booth Setup**

```env
# Event: AWS Community Day Vadodara 2024
# Booth: GuessOps Game Station

# Primary moderator (main operator)
NEXT_PUBLIC_MODERATOR_USERNAME=aws-moderator
NEXT_PUBLIC_MODERATOR_PASSWORD=vadodara2024

# Event admin (supervisor)
NEXT_PUBLIC_ADMIN_USERNAME=event-lead
NEXT_PUBLIC_ADMIN_PASSWORD=community-day-admin
```

**Your credentials are now configured and ready for booth operation! 🎪🔑**
