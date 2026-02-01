/**
 * Vercel Serverless Function for OpenAI Food Analysis
 * This function securely handles OpenAI API calls using environment variables
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        // Get OpenAI API key from environment variables
        const openaiApiKey = process.env.OPENAI_API_KEY;
        
        if (!openaiApiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        console.log('🤖 Analyzing food with OpenAI Vision API...');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Analyze this food image and provide a detailed gut health analysis. Return your response as a JSON object with the following structure:

{
  "name": "Food name",
  "category": "Food category (e.g., Indian, Italian, etc.)",
  "confidence": 85,
  "reaction": "excellent|suitable|caution|avoid",
  "spiceLevel": 3,
  "gutImpact": "positive|neutral|negative",
  "fermented": true/false,
  "explanation": "Detailed explanation of gut health impact",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "alternatives": ["Alternative 1", "Alternative 2"],
  "nutritionalHighlights": ["Highlight 1", "Highlight 2"],
  "digestibilityScore": 7,
  "probioticContent": "high|medium|low|none",
  "fiberContent": "high|medium|low",
  "inflammatoryPotential": "low|medium|high"
}

Focus on:
1. Identifying the specific food/dish
2. Gut health benefits or concerns
3. Digestibility factors
4. Probiotic content if any
5. Fiber content
6. Inflammatory potential
7. Practical tips for better digestion
8. Healthier alternatives if needed

Be specific about Indian foods, spices, and their gut health impacts. Consider factors like fermentation, spice levels, cooking methods, and ingredients that affect digestion.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: image
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API error:', response.status, errorText);
            return res.status(response.status).json({ 
                error: `OpenAI API error: ${response.status} ${response.statusText}` 
            });
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse JSON response
        let analysisResult;
        try {
            // Extract JSON from the response (in case there's extra text)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.warn('Failed to parse JSON, creating structured response from text');
            analysisResult = createFallbackResponse(content);
        }

        // Ensure all required fields are present
        analysisResult = validateAndEnhanceResponse(analysisResult);

        console.log('✅ OpenAI analysis complete');
        return res.status(200).json(analysisResult);

    } catch (error) {
        console.error('Food analysis failed:', error);
        return res.status(500).json({ 
            error: `Food analysis failed: ${error.message}` 
        });
    }
}

/**
 * Create a fallback response when JSON parsing fails
 */
function createFallbackResponse(textContent) {
    return {
        name: "Food Item",
        category: "Unknown",
        confidence: 75,
        reaction: "caution",
        spiceLevel: 2,
        gutImpact: "neutral",
        fermented: false,
        explanation: textContent.substring(0, 200) + "...",
        tips: ["Eat in moderation", "Chew thoroughly", "Drink water"],
        alternatives: ["Steamed vegetables", "Whole grains"],
        nutritionalHighlights: ["Contains nutrients"],
        digestibilityScore: 6,
        probioticContent: "low",
        fiberContent: "medium",
        inflammatoryPotential: "medium"
    };
}

/**
 * Validate and enhance the response to ensure all fields are present
 */
function validateAndEnhanceResponse(response) {
    const defaults = {
        name: "Unknown Food",
        category: "Unknown",
        confidence: 70,
        reaction: "caution",
        spiceLevel: 2,
        gutImpact: "neutral",
        fermented: false,
        explanation: "This food item has been analyzed for gut health impact.",
        tips: ["Eat mindfully", "Consider portion size"],
        alternatives: ["Healthier options available"],
        nutritionalHighlights: ["Contains various nutrients"],
        digestibilityScore: 6,
        probioticContent: "low",
        fiberContent: "medium",
        inflammatoryPotential: "medium"
    };

    // Merge with defaults
    const enhanced = { ...defaults, ...response };

    // Ensure arrays are arrays
    if (!Array.isArray(enhanced.tips)) enhanced.tips = [enhanced.tips || "Eat mindfully"];
    if (!Array.isArray(enhanced.alternatives)) enhanced.alternatives = [enhanced.alternatives || "Healthier options"];
    if (!Array.isArray(enhanced.nutritionalHighlights)) enhanced.nutritionalHighlights = [enhanced.nutritionalHighlights || "Contains nutrients"];

    // Validate numeric values
    enhanced.confidence = Math.max(0, Math.min(100, enhanced.confidence || 70));
    enhanced.spiceLevel = Math.max(0, Math.min(5, enhanced.spiceLevel || 2));
    enhanced.digestibilityScore = Math.max(0, Math.min(10, enhanced.digestibilityScore || 6));

    // Validate enum values
    const validReactions = ['excellent', 'suitable', 'caution', 'avoid'];
    if (!validReactions.includes(enhanced.reaction)) enhanced.reaction = 'caution';

    const validGutImpacts = ['positive', 'neutral', 'negative'];
    if (!validGutImpacts.includes(enhanced.gutImpact)) enhanced.gutImpact = 'neutral';

    const validLevels = ['high', 'medium', 'low', 'none'];
    if (!validLevels.includes(enhanced.probioticContent)) enhanced.probioticContent = 'low';
    if (!validLevels.includes(enhanced.fiberContent)) enhanced.fiberContent = 'medium';
    if (!validLevels.includes(enhanced.inflammatoryPotential)) enhanced.inflammatoryPotential = 'medium';

    return enhanced;
}