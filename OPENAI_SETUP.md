# OpenAI Integration Setup

The GutSense Food Image Analyzer now uses OpenAI's Vision API for advanced food analysis.

## How to Use

1. **Get an OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account or sign in
   - Generate a new API key

2. **Use the Food Analyzer**
   - Open `food-image-analyzer.html`
   - Upload a food image
   - When prompted, enter your OpenAI API key
   - Your key is stored locally and never shared

## Features

- **Advanced Food Recognition**: Identifies various cuisines and dishes
- **Gut Health Analysis**: Detailed impact on digestive health
- **Nutritional Insights**: Highlights key nutritional aspects
- **Digestibility Scoring**: Rates how easy the food is to digest
- **Probiotic Content**: Identifies fermented foods and probiotics
- **Inflammatory Potential**: Assesses inflammatory risk
- **Personalized Tips**: Provides gut health recommendations
- **Healthier Alternatives**: Suggests better options

## Security

- API keys are stored locally in your browser
- Keys are never transmitted to our servers
- All communication is directly with OpenAI's API
- You can clear your key anytime from browser storage

## Cost

- Uses OpenAI's gpt-4o-mini model (cost-effective)
- Typical cost: ~$0.01-0.02 per image analysis
- You only pay OpenAI directly for usage

## Troubleshooting

- **API Key Issues**: Make sure your key starts with "sk-proj-"
- **Connection Problems**: Check your internet connection
- **Analysis Errors**: Ensure the image is clear and shows food