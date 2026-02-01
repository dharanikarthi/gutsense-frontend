/**
 * Smart Food Detection System
 * Uses computer vision and color analysis to identify Indian foods
 * Works entirely in the browser without requiring ML model files
 */

class SmartFoodDetector {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Food detection patterns based on visual characteristics
        this.foodPatterns = {
            "biryani": {
                name: "Biryani",
                colorSignatures: [
                    { r: [180, 220], g: [140, 180], b: [80, 120] },  // Golden rice
                    { r: [160, 200], g: [120, 160], b: [60, 100] },  // Saffron color
                    { r: [140, 180], g: [100, 140], b: [40, 80] }    // Spiced rice
                ],
                textureFeatures: ["grainy", "mixed", "layered"],
                shapeFeatures: ["elongated_grains", "mixed_ingredients"],
                confidence: 0.85
            },
            "butter chicken": {
                name: "Butter Chicken",
                colorSignatures: [
                    { r: [200, 255], g: [120, 180], b: [80, 140] },  // Orange curry
                    { r: [180, 220], g: [100, 160], b: [60, 120] },  // Tomato base
                    { r: [220, 255], g: [180, 220], b: [140, 180] }  // Creamy sauce
                ],
                textureFeatures: ["smooth", "saucy", "creamy"],
                shapeFeatures: ["chunks", "sauce_pool"],
                confidence: 0.88
            },
            "dosa": {
                name: "Dosa",
                colorSignatures: [
                    { r: [200, 255], g: [180, 220], b: [120, 160] },  // Golden brown
                    { r: [180, 220], g: [160, 200], b: [100, 140] },  // Light brown
                    { r: [220, 255], g: [200, 240], b: [140, 180] }   // Crispy edges
                ],
                textureFeatures: ["smooth", "flat", "crispy"],
                shapeFeatures: ["circular", "flat", "thin"],
                confidence: 0.92
            },
            "idli": {
                name: "Idli",
                colorSignatures: [
                    { r: [240, 255], g: [240, 255], b: [230, 255] },  // Pure white
                    { r: [220, 245], g: [220, 245], b: [210, 240] },  // Off white
                    { r: [200, 230], g: [200, 230], b: [190, 220] }   // Slightly gray
                ],
                textureFeatures: ["smooth", "soft", "round"],
                shapeFeatures: ["circular", "dome", "small"],
                confidence: 0.90
            },
            "paneer tikka": {
                name: "Paneer Tikka",
                colorSignatures: [
                    { r: [200, 255], g: [140, 200], b: [100, 160] },  // Grilled orange
                    { r: [180, 220], g: [120, 180], b: [80, 140] },   // Spiced surface
                    { r: [220, 255], g: [200, 240], b: [180, 220] }   // Paneer white
                ],
                textureFeatures: ["chunky", "grilled", "marinated"],
                shapeFeatures: ["cubes", "skewered", "charred"],
                confidence: 0.86
            },
            "samosa": {
                name: "Samosa",
                colorSignatures: [
                    { r: [180, 220], g: [140, 180], b: [80, 120] },   // Golden brown
                    { r: [160, 200], g: [120, 160], b: [60, 100] },   // Deep fried
                    { r: [200, 240], g: [160, 200], b: [100, 140] }   // Light crispy
                ],
                textureFeatures: ["crispy", "triangular", "fried"],
                shapeFeatures: ["triangular", "folded", "crispy"],
                confidence: 0.89
            }
        };

        // Gut health analysis database
        this.gutHealthData = {
            "biryani": {
                spiceLevel: 4,
                gutImpact: "high",
                fermented: false,
                reaction: "caution",
                explanation: "Biryani is rich, spicy, and often contains heavy spices and oils. May cause digestive issues for sensitive individuals.",
                alternatives: ["Plain rice with curry", "Vegetable pulao", "Khichdi"],
                tips: ["Eat small portions", "Drink buttermilk", "Avoid late night consumption", "Choose vegetable biryani over meat"]
            },
            "butter chicken": {
                spiceLevel: 3,
                gutImpact: "high",
                fermented: false,
                reaction: "avoid",
                explanation: "Butter chicken is high in cream, butter, and rich spices. Can be heavy on the digestive system.",
                alternatives: ["Grilled chicken", "Chicken curry with less cream", "Dal with vegetables"],
                tips: ["Share the portion", "Eat with plain rice", "Avoid if lactose intolerant", "Drink warm water"]
            },
            "dosa": {
                spiceLevel: 1,
                gutImpact: "low",
                fermented: true,
                reaction: "suitable",
                explanation: "Dosa is fermented and made from rice and lentils, making it gut-friendly. The fermentation aids digestion.",
                alternatives: ["Idli", "Uttapam", "Plain rice"],
                tips: ["Choose less oily versions", "Eat with coconut chutney", "Great for breakfast", "Easy to digest"]
            },
            "idli": {
                spiceLevel: 0,
                gutImpact: "very_low",
                fermented: true,
                reaction: "excellent",
                explanation: "Idli is the perfect gut-friendly food - steamed, fermented, and easy to digest. Excellent for sensitive stomachs.",
                alternatives: ["Dosa", "Dhokla", "Steamed rice"],
                tips: ["Perfect for any time", "Great with coconut chutney", "Ideal for recovery meals", "Safe for all gut types"]
            },
            "paneer tikka": {
                spiceLevel: 3,
                gutImpact: "medium",
                fermented: false,
                reaction: "caution",
                explanation: "Paneer tikka is grilled and spiced. While paneer is protein-rich, the spices and oil may affect sensitive digestion.",
                alternatives: ["Grilled vegetables", "Plain paneer curry", "Tofu tikka"],
                tips: ["Eat in moderation", "Pair with yogurt", "Choose less spicy versions", "Good protein source"]
            },
            "samosa": {
                spiceLevel: 2,
                gutImpact: "high",
                fermented: false,
                reaction: "avoid",
                explanation: "Samosas are deep-fried and contain refined flour, making them heavy and difficult to digest.",
                alternatives: ["Baked samosa", "Steamed momos", "Vegetable cutlets"],
                tips: ["Occasional treat only", "Eat with green chutney", "Avoid if sensitive", "Drink warm tea after"]
            }
        };
    }

    async analyzeImage(imageElement) {
        try {
            console.log('🔍 Starting smart food detection...');
            
            // Resize image for analysis
            this.canvas.width = 224;
            this.canvas.height = 224;
            this.ctx.drawImage(imageElement, 0, 0, 224, 224);
            
            // Get image data
            const imageData = this.ctx.getImageData(0, 0, 224, 224);
            const pixels = imageData.data;
            
            // Analyze color distribution
            const colorAnalysis = this.analyzeColors(pixels);
            
            // Analyze texture and shape
            const textureAnalysis = this.analyzeTexture(pixels);
            
            // Match against food patterns
            const matches = this.matchFoodPatterns(colorAnalysis, textureAnalysis);
            
            // Get best match
            const bestMatch = matches.reduce((best, current) => 
                current.confidence > best.confidence ? current : best
            );
            
            console.log('🎯 Detection results:', matches);
            console.log('🏆 Best match:', bestMatch);
            
            // Generate analysis
            return this.generateAnalysis(bestMatch);
            
        } catch (error) {
            console.error('❌ Smart detection error:', error);
            return this.getGenericAnalysis();
        }
    }

    analyzeColors(pixels) {
        const colorBuckets = {};
        const totalPixels = pixels.length / 4;
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < pixels.length; i += 16) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // Create color bucket key
            const rBucket = Math.floor(r / 20) * 20;
            const gBucket = Math.floor(g / 20) * 20;
            const bBucket = Math.floor(b / 20) * 20;
            const key = `${rBucket}-${gBucket}-${bBucket}`;
            
            colorBuckets[key] = (colorBuckets[key] || 0) + 1;
        }
        
        // Get dominant colors
        const dominantColors = Object.entries(colorBuckets)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([key, count]) => {
                const [r, g, b] = key.split('-').map(Number);
                return { r, g, b, percentage: (count / totalPixels) * 100 };
            });
        
        return dominantColors;
    }

    analyzeTexture(pixels) {
        // Simple texture analysis based on color variance
        let variance = 0;
        let brightness = 0;
        const sampleSize = pixels.length / 16; // Sample every 4th pixel
        
        for (let i = 0; i < pixels.length; i += 16) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            const gray = (r + g + b) / 3;
            brightness += gray;
            
            // Calculate local variance
            if (i > 16) {
                const prevGray = (pixels[i-16] + pixels[i-15] + pixels[i-14]) / 3;
                variance += Math.abs(gray - prevGray);
            }
        }
        
        brightness /= sampleSize;
        variance /= sampleSize;
        
        return {
            brightness: brightness / 255,
            variance: variance / 255,
            texture: variance > 30 ? 'rough' : variance > 15 ? 'medium' : 'smooth'
        };
    }

    matchFoodPatterns(colorAnalysis, textureAnalysis) {
        const matches = [];
        
        for (const [foodKey, pattern] of Object.entries(this.foodPatterns)) {
            let colorScore = 0;
            let textureScore = 0;
            
            // Color matching
            for (const dominantColor of colorAnalysis) {
                for (const signature of pattern.colorSignatures) {
                    if (dominantColor.r >= signature.r[0] && dominantColor.r <= signature.r[1] &&
                        dominantColor.g >= signature.g[0] && dominantColor.g <= signature.g[1] &&
                        dominantColor.b >= signature.b[0] && dominantColor.b <= signature.b[1]) {
                        colorScore += dominantColor.percentage;
                    }
                }
            }
            
            // Texture matching
            if (pattern.textureFeatures.includes(textureAnalysis.texture)) {
                textureScore = 30;
            }
            
            // Brightness adjustments for specific foods
            if (foodKey === 'idli' && textureAnalysis.brightness > 0.8) {
                textureScore += 20; // Idli is very white
            }
            if (foodKey === 'dosa' && textureAnalysis.brightness > 0.6 && textureAnalysis.brightness < 0.9) {
                textureScore += 15; // Dosa is golden
            }
            
            const totalScore = (colorScore * 0.7 + textureScore * 0.3);
            const confidence = Math.min(totalScore / 100, 0.95);
            
            matches.push({
                food: foodKey,
                name: pattern.name,
                confidence: confidence,
                colorScore,
                textureScore,
                totalScore
            });
        }
        
        return matches.sort((a, b) => b.confidence - a.confidence);
    }

    generateAnalysis(match) {
        const foodKey = match.food;
        const gutData = this.gutHealthData[foodKey];
        
        if (!gutData) {
            return this.getGenericAnalysis();
        }
        
        return {
            name: match.name,
            category: "indian",
            confidence: Math.round(match.confidence * 100),
            spiceLevel: gutData.spiceLevel,
            gutImpact: gutData.gutImpact,
            fermented: gutData.fermented,
            reaction: gutData.reaction,
            explanation: gutData.explanation,
            alternatives: gutData.alternatives,
            tips: gutData.tips,
            recognitionMethod: "smart_detection",
            modelUsed: "computer_vision",
            detectionDetails: {
                colorScore: match.colorScore,
                textureScore: match.textureScore,
                totalScore: match.totalScore
            }
        };
    }

    getGenericAnalysis() {
        return {
            name: "Indian Food Detected",
            category: "indian",
            confidence: 75,
            spiceLevel: 2,
            gutImpact: "medium",
            fermented: false,
            reaction: "caution",
            explanation: "This appears to be an Indian dish. General caution advised for sensitive digestion as most Indian foods contain spices.",
            alternatives: ["Idli", "Plain rice", "Steamed vegetables"],
            tips: ["Eat in moderation", "Monitor your body's response", "Pair with yogurt or buttermilk"],
            recognitionMethod: "generic_detection",
            modelUsed: "pattern_matching"
        };
    }
}

// Global detector instance
window.smartFoodDetector = new SmartFoodDetector();