/**
 * Smart Food Detection System
 * Uses computer vision and color analysis to identify Indian foods
 * Works entirely in the browser without requiring ML model files
 */

class SmartFoodDetector {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas optimization
        this.canvas.setAttribute('willReadFrequently', 'true');
        
        // Improved food detection patterns with better color ranges and weights
        this.foodPatterns = {
            "biryani": {
                name: "Biryani",
                colorSignatures: [
                    { r: [180, 255], g: [140, 200], b: [60, 120], weight: 3 },  // Golden rice
                    { r: [160, 220], g: [120, 180], b: [40, 100], weight: 2 },  // Saffron color
                    { r: [200, 255], g: [160, 220], b: [80, 140], weight: 2 }   // Mixed spices
                ],
                keywords: ["rice", "grain", "mixed", "colorful"],
                baseConfidence: 0.85
            },
            "butter chicken": {
                name: "Butter Chicken",
                colorSignatures: [
                    { r: [200, 255], g: [100, 180], b: [60, 140], weight: 4 },  // Orange curry
                    { r: [180, 240], g: [80, 160], b: [40, 120], weight: 3 },   // Tomato base
                    { r: [220, 255], g: [160, 220], b: [120, 180], weight: 2 }  // Creamy sauce
                ],
                keywords: ["sauce", "curry", "orange", "creamy"],
                baseConfidence: 0.88
            },
            "dosa": {
                name: "Dosa",
                colorSignatures: [
                    { r: [180, 255], g: [160, 220], b: [100, 160], weight: 4 },  // Golden brown
                    { r: [200, 255], g: [180, 240], b: [120, 180], weight: 3 },  // Light golden
                    { r: [160, 200], g: [140, 180], b: [80, 120], weight: 2 }    // Darker edges
                ],
                keywords: ["flat", "round", "crispy", "golden"],
                baseConfidence: 0.92
            },
            "idli": {
                name: "Idli",
                colorSignatures: [
                    { r: [220, 255], g: [220, 255], b: [210, 255], weight: 5 },  // Pure white
                    { r: [200, 240], g: [200, 240], b: [190, 230], weight: 3 },  // Off white
                    { r: [180, 220], g: [180, 220], b: [170, 210], weight: 2 }   // Light gray
                ],
                keywords: ["white", "round", "soft", "steamed"],
                baseConfidence: 0.90
            },
            "paneer tikka": {
                name: "Paneer Tikka",
                colorSignatures: [
                    { r: [180, 255], g: [120, 200], b: [80, 160], weight: 3 },   // Grilled orange
                    { r: [200, 255], g: [180, 240], b: [160, 220], weight: 4 },  // White paneer
                    { r: [160, 220], g: [100, 180], b: [60, 140], weight: 2 }    // Spiced surface
                ],
                keywords: ["cubes", "grilled", "white", "chunks"],
                baseConfidence: 0.85
            },
            "samosa": {
                name: "Samosa",
                colorSignatures: [
                    { r: [160, 220], g: [120, 180], b: [60, 120], weight: 4 },   // Golden brown
                    { r: [180, 240], g: [140, 200], b: [80, 140], weight: 3 },   // Light fried
                    { r: [140, 180], g: [100, 140], b: [40, 80], weight: 2 }     // Dark crispy
                ],
                keywords: ["triangular", "fried", "golden", "crispy"],
                baseConfidence: 0.88
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
            
            // Analyze colors with improved algorithm
            const colorStats = this.analyzeColors(pixels);
            
            // Analyze texture
            const textureStats = this.analyzeTexture(pixels);
            
            // Match against food patterns with improved scoring
            const matches = this.matchFoodPatterns(colorStats, textureStats);
            
            console.log('🎯 Detection results:', matches);
            console.log('🏆 Best match:', matches[0]);
            console.log('📊 Color stats:', colorStats);
            console.log('🖼️ Texture stats:', textureStats);
            
            // Get best match with minimum confidence threshold
            let bestMatch = matches[0];
            
            // If confidence is too low, use generic analysis
            if (bestMatch.confidence < 0.15) {
                console.log('⚠️ Low confidence, using generic analysis');
                return this.getGenericAnalysis();
            }
            
            // Generate detailed analysis
            return this.generateAnalysis(bestMatch);
            
        } catch (error) {
            console.error('❌ Smart detection error:', error);
            return this.getGenericAnalysis();
        }
    }

    analyzeTexture(pixels) {
        let variance = 0;
        let brightness = 0;
        let edgeCount = 0;
        const sampleSize = pixels.length / 32;
        
        for (let i = 0; i < pixels.length; i += 32) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            const gray = (r + g + b) / 3;
            brightness += gray;
            
            // Calculate local variance for texture
            if (i > 32) {
                const prevGray = (pixels[i-32] + pixels[i-31] + pixels[i-30]) / 3;
                const diff = Math.abs(gray - prevGray);
                variance += diff;
                
                if (diff > 30) edgeCount++; // Edge detection
            }
        }
        
        brightness /= sampleSize;
        variance /= sampleSize;
        
        return {
            brightness: brightness,
            variance: variance / 255,
            edgeCount: edgeCount / sampleSize,
            texture: variance > 40 ? 'rough' : variance > 20 ? 'medium' : 'smooth'
        };
    }

    analyzeColors(pixels) {
        const colorStats = {
            totalPixels: 0,
            avgR: 0, avgG: 0, avgB: 0,
            dominantColors: [],
            brightness: 0,
            colorVariance: 0
        };
        
        let rSum = 0, gSum = 0, bSum = 0;
        const colorMap = new Map();
        
        // Analyze every 8th pixel for better performance
        for (let i = 0; i < pixels.length; i += 32) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            rSum += r;
            gSum += g;
            bSum += b;
            colorStats.totalPixels++;
            
            // Group similar colors
            const colorKey = `${Math.floor(r/15)*15}-${Math.floor(g/15)*15}-${Math.floor(b/15)*15}`;
            colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }
        
        // Calculate averages
        colorStats.avgR = rSum / colorStats.totalPixels;
        colorStats.avgG = gSum / colorStats.totalPixels;
        colorStats.avgB = bSum / colorStats.totalPixels;
        colorStats.brightness = (colorStats.avgR + colorStats.avgG + colorStats.avgB) / 3;
        
        // Get top 5 dominant colors
        colorStats.dominantColors = Array.from(colorMap.entries())
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([key, count]) => {
                const [r, g, b] = key.split('-').map(Number);
                return { 
                    r, g, b, 
                    percentage: (count / colorStats.totalPixels) * 100,
                    count 
                };
            });
        
        return colorStats;
    }

    matchFoodPatterns(colorStats, textureStats) {
        const matches = [];
        
        for (const [foodKey, pattern] of Object.entries(this.foodPatterns)) {
            let totalScore = 0;
            let maxColorMatch = 0;
            
            // Color signature matching with weights
            for (const signature of pattern.colorSignatures) {
                let colorMatch = 0;
                
                // Check against dominant colors (more generous scoring)
                for (const domColor of colorStats.dominantColors) {
                    if (this.isColorInRange(domColor, signature)) {
                        colorMatch += (domColor.percentage * 1.5) * (signature.weight || 1);
                    }
                }
                
                // Check against average color (bonus for overall tone match)
                if (this.isColorInRange(colorStats, signature)) {
                    colorMatch += 30 * (signature.weight || 1);
                }
                
                // Partial color matching (within 50% of range)
                if (this.isColorNearRange(colorStats, signature)) {
                    colorMatch += 15 * (signature.weight || 1);
                }
                
                maxColorMatch = Math.max(maxColorMatch, colorMatch);
            }
            
            // Brightness-based adjustments
            let brightnessBonus = 0;
            if (foodKey === 'idli' && colorStats.brightness > 200) {
                brightnessBonus = 40; // Idli is very white
            } else if (foodKey === 'dosa' && colorStats.brightness > 150 && colorStats.brightness < 220) {
                brightnessBonus = 35; // Dosa is golden
            } else if (foodKey === 'butter chicken' && colorStats.brightness > 120 && colorStats.brightness < 180) {
                brightnessBonus = 30; // Butter chicken is medium bright
            } else if (foodKey === 'samosa' && colorStats.brightness > 100 && colorStats.brightness < 170) {
                brightnessBonus = 30; // Samosa is golden brown
            } else if (foodKey === 'biryani' && colorStats.brightness > 130 && colorStats.brightness < 200) {
                brightnessBonus = 25; // Biryani is colorful
            } else if (foodKey === 'paneer tikka' && colorStats.brightness > 140 && colorStats.brightness < 190) {
                brightnessBonus = 25; // Paneer tikka is mixed colors
            }
            
            // Texture bonus
            let textureBonus = 0;
            if (foodKey === 'idli' && textureStats.variance < 0.3) {
                textureBonus = 20; // Idli is smooth
            } else if (foodKey === 'dosa' && textureStats.variance > 0.2 && textureStats.variance < 0.6) {
                textureBonus = 15; // Dosa has medium texture
            } else if (foodKey === 'samosa' && textureStats.variance > 0.3) {
                textureBonus = 15; // Samosa is crispy/rough
            } else if (foodKey === 'butter chicken' && textureStats.variance < 0.4) {
                textureBonus = 10; // Butter chicken is saucy/smooth
            }
            
            // Calculate final score with better scaling
            totalScore = (maxColorMatch * 2) + brightnessBonus + textureBonus;
            
            // Apply base confidence with better scaling
            const confidence = Math.min((totalScore / 150) * pattern.baseConfidence, 0.95);
            
            matches.push({
                food: foodKey,
                name: pattern.name,
                confidence: Math.max(confidence, 0.1), // Minimum confidence
                colorScore: maxColorMatch,
                brightnessBonus,
                textureBonus,
                totalScore,
                details: {
                    avgBrightness: colorStats.brightness,
                    textureVariance: textureStats.variance,
                    dominantColors: colorStats.dominantColors.slice(0, 2)
                }
            });
        }
        
        return matches.sort((a, b) => b.confidence - a.confidence);
    }
    
    isColorInRange(color, signature) {
        return color.r >= signature.r[0] && color.r <= signature.r[1] &&
               color.g >= signature.g[0] && color.g <= signature.g[1] &&
               color.b >= signature.b[0] && color.b <= signature.b[1];
    }
    
    isColorNearRange(color, signature) {
        // Check if color is within 50% extended range
        const rRange = signature.r[1] - signature.r[0];
        const gRange = signature.g[1] - signature.g[0];
        const bRange = signature.b[1] - signature.b[0];
        
        const rExtended = [signature.r[0] - rRange * 0.5, signature.r[1] + rRange * 0.5];
        const gExtended = [signature.g[0] - gRange * 0.5, signature.g[1] + gRange * 0.5];
        const bExtended = [signature.b[0] - bRange * 0.5, signature.b[1] + bRange * 0.5];
        
        return color.r >= rExtended[0] && color.r <= rExtended[1] &&
               color.g >= gExtended[0] && color.g <= gExtended[1] &&
               color.b >= bExtended[0] && color.b <= bExtended[1];
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