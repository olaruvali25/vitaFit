# SUPABASE SETUP INSTRUCTIONS

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Choose your organization and region
4. Set project name and database password
5. Wait for project creation to complete

## 2. Configure Authentication (PHONE VERIFICATION MANDATORY)

### Enable Phone Authentication
1. Go to Authentication → Settings in your Supabase dashboard
2. Under "Auth Providers", enable "Phone" (REQUIRED)
3. Configure SMS provider:
   - Go to Authentication → SMS Provider
   - Enable Twilio or your preferred SMS provider
   - Add your Twilio credentials (Account SID, Auth Token, Phone Number)
   - Test SMS delivery with a real phone number

### Configure Auth Settings
1. Go to Authentication → Settings
2. Set "Site URL" to your production domain (e.g., `https://yourdomain.com`)
3. Set "Redirect URLs" to include your development and production URLs
4. **IMPORTANT**: Set "Enable email confirmations" to OFF (we use phone verification)
5. Set "JWT Expiry" to 3600 seconds (1 hour)
6. Set "JWT Secret" - copy this for your environment variables

### Phone Verification Requirements
- Phone authentication MUST be enabled
- SMS provider MUST be configured and tested
- Users CANNOT sign up without providing a valid phone number
- Users CANNOT log in without phone verification

## 3. Database Setup

### Run SQL Setup
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `sql/setup.sql`
3. Run the SQL script

### Verify Tables
1. Go to Table Editor
2. Verify that `profiles` and `subscriptions` tables exist
3. Check that RLS is enabled on both tables

## 4. Environment Variables

Update your `.env.local` file with the actual values from Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
```

You can find these values in:
- Project Settings → API → Project URL and anon key
- Project Settings → API → service_role key
- Authentication → Settings → JWT Secret

## 5. Configure Rate Limiting

1. Go to Authentication → Rate Limits
2. Configure appropriate limits for signup/login attempts
3. Set SMS rate limits to prevent abuse

## 6. Test the Setup

### Verify Phone Signup Flow
1. Test signup with email + password + phone
2. Verify SMS is sent
3. Test OTP verification
4. Confirm profile is created automatically

### Verify Security
1. Try accessing other users' data - should fail
2. Test RLS policies
3. Verify phone uniqueness constraint

## 7. Production Deployment

### Environment Variables
- Ensure all Supabase environment variables are set in production
- Use different Supabase project for production vs development
- Never commit service role keys to version control

### Database Migrations
- Use Supabase migrations for schema changes
- Test migrations on staging environment first
- Backup database before major changes

### Monitoring
- Set up monitoring for auth events
- Monitor SMS delivery rates
- Track user signup/verification success rates

## Troubleshooting

### Common Issues

1. **SMS not sending**: Check Twilio credentials and balance
2. **OTP verification fails**: Check phone number format (must be E.164)
3. **RLS blocking access**: Verify user is authenticated and owns the data
4. **Environment variables**: Ensure they're loaded correctly

### Debug Commands

```bash
# Check Supabase connection
curl -H "apikey: YOUR_ANON_KEY" https://your-project-id.supabase.co/rest/v1/

# Check auth status
curl -H "apikey: YOUR_ANON_KEY" https://your-project-id.supabase.co/auth/v1/user
```

### Logs
- Check Supabase dashboard → Logs for detailed error information
- Monitor auth logs for failed attempts
- Check database logs for RLS violations
