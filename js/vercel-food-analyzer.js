/**
 * Vercel Food Analyzer
 * Uses Vercel serverless function for secure OpenAI integration
 */

class VercelFoodAnalyzer {
    constructor() {
        this.apiEndpoint = CONFIG.OPENAI_API_ENDPOINT;
    }

    /**
     * Analyze food image using Vercel serverless function
     * @param {string} imageBase64 - Base64 encoded image
     * @returns {Promise<Object>} Analysis results
     */
    async analyzeFood(imageBase64) {
        try {
            console.log('🤖 Analyzing food with Vercel OpenAI function...');

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageBase64
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
            }

            const analysisResult = await response.json();

            console.log('✅ Vercel OpenAI analysis complete:', analysisResult);
            return analysisResult;

        } catch (error) {
            console.error('Vercel food analysis failed:', error);
            throw new Error(`Food analysis failed: ${error.message}`);
        }
    }

    /**
     * Test the Vercel function connection
     */
    async testConnection() {
        try {
            // Create a small test image (1x1 pixel transparent PNG)
            const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
            
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: testImage
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Vercel connection test failed:', error);
            return false;
        }
    }
}

// Create global instance
window.vercelFoodAnalyzer = new VercelFoodAnalyzer();

console.log('🚀 Vercel Food Analyzer initialized');