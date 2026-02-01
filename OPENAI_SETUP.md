# OpenAI Integration with Vercel

The GutSense Food Image Analyzer now uses OpenAI's Vision API through secure Vercel serverless functions.

## Vercel Environment Setup

### 1. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy the frontend
vercel --prod
```

### 2. Set Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-proj-`)
   - **Environment**: Production, Preview, Development

### 3. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the key (starts with `sk-proj-`)

## How It Works

1. **Secure Architecture**: API keys are stored as Vercel environment variables
2. **Serverless Function**: `/api/analyze-food-openai.js` handles OpenAI communication
3. **Frontend Integration**: No API keys exposed in client-side code
4. **Direct Analysis**: Upload image → Vercel function → OpenAI → Results

## Features

- **Advanced Food Recognition**: Identifies various cuisines and dishes
- **Gut Health Analysis**: Detailed impact on digestive health
- **Nutritional Insights**: Highlights key nutritional aspects
- **Digestibility Scoring**: Rates how easy the food is to digest
- **Probiotic Content**: Identifies fermented foods and probiotics
- **Inflammatory Potential**: Assesses inflammatory risk
- **Personalized Tips**: Provides gut health recommendations
- **Healthier Alternatives**: Suggests better options

## Security Benefits

- ✅ API keys stored securely in Vercel environment
- ✅ No sensitive data in client-side code
- ✅ Direct communication with OpenAI through serverless function
- ✅ CORS enabled for secure cross-origin requests
- ✅ No user API key management required

## Cost Optimization

- Uses OpenAI's gpt-4o-mini model (cost-effective)
- Typical cost: ~$0.01-0.02 per image analysis
- Centralized billing through your OpenAI account
- No per-user API key management

## Local Development

For local development, create a `.env.local` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Troubleshooting

- **Function Timeout**: Increase maxDuration in vercel.json if needed
- **API Errors**: Check Vercel function logs in dashboard
- **Environment Variables**: Ensure OPENAI_API_KEY is set correctly
- **CORS Issues**: Function includes proper CORS headers