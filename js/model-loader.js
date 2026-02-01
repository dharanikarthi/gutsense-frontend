/**
 * TensorFlow.js Model Loader for Indian Food Classification
 * Runs your .h5 model directly in the browser
 */

class IndianFoodClassifier {
    constructor() {
        this.model = null;
        this.isLoading = false;
        this.IMG_SIZE = 224;
        
        // Class names from your model (in correct order)
        this.classNames = [
            "Biryani",
            "Butter Chicken", 
            "Dosa",
            "Idli",
            "Paneer Tikka",
            "Samosa"
        ];
        
        // Enhanced food database with gut health analysis
        this.foodAnalysis = {
            "biryani": {
                name: "Biryani",
                category: "indian_rice",
                spiceLevel: 4,
                gutImpact: "high",
                fermented: false,
                reaction: "caution",
                explanation: "Biryani is rich, spicy, and often contains heavy spices and oils. May cause digestive issues for sensitive individuals.",
                alternatives: ["Plain rice with curry", "Vegetable pulao", "Khichdi"],
                tips: ["Eat small portions", "Drink buttermilk", "Avoid late night consumption", "Choose vegetable biryani over meat"]
            },
            "butter chicken": {
                name: "Butter Chicken",
                category: "indian_curry",
                spiceLevel: 3,
                gutImpact: "high",
                fermented: false,
                reaction: "avoid",
                explanation: "Butter chicken is high in cream, butter, and rich spices. Can be heavy on the digestive system.",
                alternatives: ["Grilled chicken", "Chicken curry with less cream", "Dal with vegetables"],
                tips: ["Share the portion", "Eat with plain rice", "Avoid if lactose intolerant", "Drink warm water"]
            },
            "dosa": {
                name: "Dosa",
                category: "indian_fermented",
                spiceLevel: 1,
                gutImpact: "low",
                fermented: true,
                reaction: "suitable",
                explanation: "Dosa is fermented and made from rice and lentils, making it gut-friendly. The fermentation aids digestion.",
                alternatives: ["Idli", "Uttapam", "Plain rice"],
                tips: ["Choose less oily versions", "Eat with coconut chutney", "Great for breakfast", "Easy to digest"]
            },
            "idli": {
                name: "Idli",
                category: "indian_fermented",
                spiceLevel: 0,
                gutImpact: "very_low",
                fermented: true,
                reaction: "excellent",
                explanation: "Idli is the perfect gut-friendly food - steamed, fermented, and easy to digest. Excellent for sensitive stomachs.",
                alternatives: ["Dosa", "Dhokla", "Steamed rice"],
                tips: ["Perfect for any time", "Great with coconut chutney", "Ideal for recovery meals", "Safe for all gut types"]
            },
            "paneer tikka": {
                name: "Paneer Tikka",
                category: "indian_grilled",
                spiceLevel: 3,
                gutImpact: "medium",
                fermented: false,
                reaction: "caution",
                explanation: "Paneer tikka is grilled and spiced. While paneer is protein-rich, the spices and oil may affect sensitive digestion.",
                alternatives: ["Grilled vegetables", "Plain paneer curry", "Tofu tikka"],
                tips: ["Eat in moderation", "Pair with yogurt", "Choose less spicy versions", "Good protein source"]
            },
            "samosa": {
                name: "Samosa",
                category: "indian_fried",
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

    async loadModel() {
        if (this.model || this.isLoading) {
            return this.model !== null;
        }

        this.isLoading = true;
        
        try {
            console.log('🔄 Loading TensorFlow.js model...');
            
            // Try to load the converted model from the models directory
            this.model = await tf.loadLayersModel('./models/indian_food_classifier/model.json');
            
            console.log('✅ Model loaded successfully!');
            console.log('Model input shape:', this.model.inputs[0].shape);
            
            // Warm up the model with a dummy prediction
            const dummyInput = tf.zeros([1, this.IMG_SIZE, this.IMG_SIZE, 3]);
            await this.model.predict(dummyInput);
            dummyInput.dispose();
            console.log('🔥 Model warmed up and ready!');
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to load model:', error);
            console.log('');
            console.log('🔧 TO SET UP YOUR MODEL:');
            console.log('1. Place your indian_food_classifier.h5 file in the root directory');
            console.log('2. Run: python convert_model.py');
            console.log('3. Refresh this page');
            console.log('');
            console.log('📖 See frontend/MODEL_CONVERSION_GUIDE.md for detailed instructions');
            
            return false;
        } finally {
            this.isLoading = false;
        }
    }

    async preprocessImage(imageElement) {
        try {
            // Resize and normalize the image
            const tensor = tf.browser.fromPixels(imageElement)
                .resizeNearestNeighbor([this.IMG_SIZE, this.IMG_SIZE])
                .toFloat()
                .div(255.0)
                .expandDims(0);
            
            return tensor;
        } catch (error) {
            console.error('Error preprocessing image:', error);
            return null;
        }
    }

    async predictFood(imageElement) {
        try {
            // Load model if not already loaded
            if (!this.model) {
                const loaded = await this.loadModel();
                if (!loaded) {
                    // Return setup instructions instead of error
                    return this.getFallbackPrediction();
                }
            }

            // Preprocess image
            const preprocessed = await this.preprocessImage(imageElement);
            if (!preprocessed) {
                return this.getErrorResponse("Failed to preprocess image");
            }

            // Make prediction
            console.log('🔮 Making prediction...');
            const predictions = await this.model.predict(preprocessed);
            const predictionArray = await predictions.data();
            
            // Get the predicted class
            const predictedClassIndex = predictionArray.indexOf(Math.max(...predictionArray));
            const confidence = predictionArray[predictedClassIndex];
            
            console.log('📊 Raw predictions:', predictionArray);
            console.log('🎯 Predicted class index:', predictedClassIndex);
            console.log('📈 Confidence:', confidence);

            // Clean up tensors
            preprocessed.dispose();
            predictions.dispose();

            // Get class name and analysis
            if (predictedClassIndex < this.classNames.length) {
                const predictedFood = this.classNames[predictedClassIndex];
                const foodKey = predictedFood.toLowerCase().replace(" ", " ");
                
                const analysis = this.getFoodAnalysis(foodKey, predictedFood, confidence);
                analysis.rawPredictions = Array.from(predictionArray);
                analysis.allPredictions = this.classNames.map((food, i) => ({
                    food: food,
                    confidence: predictionArray[i]
                })).sort((a, b) => b.confidence - a.confidence);
                
                return analysis;
            } else {
                return this.getErrorResponse("Predicted class index out of range");
            }

        } catch (error) {
            console.error('❌ Prediction error:', error);
            return this.getErrorResponse(`Prediction failed: ${error.message}`);
        }
    }

    getFoodAnalysis(foodKey, foodName, confidence) {
        const normalizedKey = foodKey.toLowerCase().replace(" ", " ");
        
        let analysis;
        if (this.foodAnalysis[normalizedKey]) {
            analysis = { ...this.foodAnalysis[normalizedKey] };
        } else {
            // Generic analysis for foods not in database
            analysis = {
                name: foodName,
                category: "indian",
                spiceLevel: 2,
                gutImpact: "medium",
                fermented: false,
                reaction: "caution",
                explanation: `${foodName} is an Indian dish. General caution advised for sensitive digestion.`,
                alternatives: ["Idli", "Plain rice", "Steamed vegetables"],
                tips: ["Eat in moderation", "Monitor your response", "Pair with yogurt"]
            };
        }

        // Add ML prediction data
        analysis.confidence = Math.round(confidence * 100);
        analysis.mlConfidence = confidence;
        analysis.recognitionMethod = "ml_model_browser";
        analysis.modelUsed = "indian_food_classifier_tfjs";
        analysis.predictionTimestamp = new Date().toISOString();

        return analysis;
    }

    getFallbackPrediction() {
        return {
            name: "🤖 AI Model Setup Required",
            category: "setup",
            reaction: "info",
            confidence: 0,
            explanation: "Your AI model needs to be converted to run in the browser. This is a one-time setup that takes about 2 minutes.",
            alternatives: [
                "1. Place indian_food_classifier.h5 in root folder",
                "2. Run: python convert_model.py", 
                "3. Refresh this page"
            ],
            tips: [
                "The model will run directly in your browser",
                "No internet connection needed after setup",
                "Your images stay private on your device"
            ],
            recognitionMethod: "setup_required",
            modelUsed: "none",
            setupInstructions: {
                step1: "Place your indian_food_classifier.h5 file in the root directory",
                step2: "Run the command: python convert_model.py",
                step3: "Refresh this page to load the converted model",
                note: "This is a one-time setup. After conversion, the model runs entirely in your browser!"
            }
        };
    }

    getErrorResponse(errorMessage) {
        return {
            name: "Recognition Error",
            category: "error",
            reaction: "caution",
            confidence: 0,
            explanation: `Error: ${errorMessage}`,
            alternatives: ["Try different image", "Enter food name manually"],
            tips: ["Use clear, well-lit photos", "Show food clearly", "Try again"],
            recognitionMethod: "error",
            error: errorMessage
        };
    }

    getSupportedFoods() {
        return this.classNames;
    }

    getModelInfo() {
        return {
            modelName: "Indian Food Classifier (TensorFlow.js)",
            supportedFoods: this.classNames,
            inputSize: `${this.IMG_SIZE}x${this.IMG_SIZE}`,
            modelLoaded: this.model !== null,
            totalClasses: this.classNames.length,
            framework: "TensorFlow.js"
        };
    }
}

// Global classifier instance
window.indianFoodClassifier = new IndianFoodClassifier();