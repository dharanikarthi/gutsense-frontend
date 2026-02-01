# Vercel Deployment Guide

This guide will help you deploy the GutSense frontend with OpenAI integration to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
3. **GitHub Repository**: Your frontend code should be in a GitHub repository

## Step 1: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (or leave empty)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: `./` (or leave empty)
5. Click "Deploy"

### Option B: Deploy via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to your frontend directory
cd frontend

# Deploy
vercel --prod
```

## Step 2: Set Environment Variables

### In Vercel Dashboard:
1. Go to your project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add the following variable:

| Name | Value | Environments |
|------|-------|--------------|
| `OPENAI_API_KEY` | `sk-proj-your-actual-api-key-here` | Production, Preview, Development |

### Via CLI:
```bash
# Set environment variable
vercel env add OPENAI_API_KEY

# When prompted:
# - Enter your OpenAI API key
# - Select all environments (Production, Preview, Development)
```

## Step 3: Redeploy

After setting environment variables, redeploy to apply changes:

### Via Dashboard:
1. Go to "Deployments" tab
2. Click "Redeploy" on the latest deployment

### Via CLI:
```bash
vercel --prod
```

## Step 4: Test the Deployment

1. Visit your deployed URL
2. Navigate to the food image analyzer
3. Upload a food image
4. Verify that the analysis works correctly

## Environment Variable Security

✅ **Secure**: Environment variables are stored securely on Vercel servers
✅ **Private**: Not exposed in client-side code
✅ **Encrypted**: Transmitted securely to serverless functions
✅ **Isolated**: Each deployment environment has separate variables

## Troubleshooting

### Common Issues:

1. **"OpenAI API key not configured" error**
   - Check that `OPENAI_API_KEY` is set in Vercel environment variables
   - Ensure the key starts with `sk-proj-`
   - Redeploy after setting the variable

2. **Function timeout errors**
   - OpenAI API calls may take time for complex images
   - The function is configured with 30-second timeout
   - Check Vercel function logs for details

3. **CORS errors**
   - The serverless function includes proper CORS headers
   - If issues persist, check browser console for specific errors

4. **API rate limits**
   - OpenAI has rate limits based on your plan
   - Monitor usage in OpenAI dashboard
   - Consider upgrading plan if needed

### Checking Logs:

1. Go to Vercel dashboard
2. Click on "Functions" tab
3. Click on your function to see logs
4. Check for any error messages

## Cost Considerations

- **Vercel**: Free tier includes generous limits for serverless functions
- **OpenAI**: Pay-per-use pricing (~$0.01-0.02 per image analysis)
- **Bandwidth**: Vercel includes CDN and bandwidth in free tier

## Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Monitoring

- **Vercel Analytics**: Enable in project settings for usage insights
- **OpenAI Usage**: Monitor API usage in OpenAI dashboard
- **Function Performance**: Check execution time and errors in Vercel dashboard

## Support

- **Vercel Issues**: Check [Vercel documentation](https://vercel.com/docs)
- **OpenAI Issues**: Check [OpenAI documentation](https://platform.openai.com/docs)
- **Function Logs**: Available in Vercel dashboard under Functions tab