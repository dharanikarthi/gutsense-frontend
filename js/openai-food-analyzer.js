/**
 * OpenAI Food Analyzer
 * Direct integration with OpenAI Vision API for food analysis
 */

class OpenAIFoodAnalyzer {
    constructor() {
        this.apiKey = null;
        this.apiUrl = CONFIG.OPENAI_API_URL;
        this.initializeApiKey();
    }

    /**
     * Initialize API key from various sources
     */
    initializeApiKey() {
        // Try to get API key from localStorage first
        this.apiKey = localStorage.getItem('openai_api_key');
        
        // If not found, use the one from config (if provided)
        if (!this.apiKey && CONFIG.OPENAI_API_KEY) {
            this.apiKey = CONFIG.OPENAI_API_KEY;
        }
    }

    /**
     * Set API key and store it securely
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('openai_api_key', apiKey);
    }

    /**
     * Check if API key is available
     */
    hasApiKey() {
        return !!this.apiKey;
    }

    /**
     * Prompt user for API key if not available
     */
    async ensureApiKey() {
        if (!this.hasApiKey()) {
            const apiKey = prompt(
                'Please enter your OpenAI API key:\n\n' +
                'You can get one from: https://platform.openai.com/api-keys\n\n' +
                'Your key will be stored locally and never shared.'
            );
            
            if (!apiKey) {
                throw new Error('OpenAI API key is required for food analysis');
            }
            
            this.setApiKey(apiKey.trim());
        }
    }

    /**
     * Analyze food image using OpenAI Vision API
     * @param {string} imageBase64 - Base64 encoded image
     * @returns {Promise<Object>} Analysis results
     */
    async analyzeFood(imageBase64) {
        try {
            // Ensure we have an API key
            await this.ensureApiKey();
            
            console.log('🤖 Analyzing food with OpenAI Vision API...');

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
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
                                        url: imageBase64
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
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
                analysisResult = this.createFallbackResponse(content);
            }

            // Ensure all required fields are present
            analysisResult = this.validateAndEnhanceResponse(analysisResult);

            console.log('✅ OpenAI analysis complete:', analysisResult);
            return analysisResult;

        } catch (error) {
            console.error('OpenAI analysis failed:', error);
            throw new Error(`Food analysis failed: ${error.message}`);
        }
    }

    /**
     * Create a fallback response when JSON parsing fails
     */
    createFallbackResponse(textContent) {
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
    validateAndEnhanceResponse(response) {
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

    /**
     * Test the OpenAI connection
     */
    async testConnection() {
        try {
            // Don't prompt for API key during connection test
            if (!this.hasApiKey()) {
                return false;
            }

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: "Hello, can you analyze food images?"
                        }
                    ],
                    max_tokens: 50
                })
            });

            return response.ok;
        } catch (error) {
            console.error('OpenAI connection test failed:', error);
            return false;
        }
    }
}

// Create global instance
window.openAIFoodAnalyzer = new OpenAIFoodAnalyzer();

console.log('🤖 OpenAI Food Analyzer initialized');