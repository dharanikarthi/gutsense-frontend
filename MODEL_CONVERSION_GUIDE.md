# 🔄 Convert Your .h5 Model to TensorFlow.js

## Quick Setup (5 minutes)

### Step 1: Install TensorFlow.js Converter
```bash
pip install tensorflowjs
```

### Step 2: Convert Your Model
```bash
# Navigate to where your indian_food_classifier.h5 file is located
cd /path/to/your/model

# Convert to TensorFlow.js format
tensorflowjs_converter --input_format=keras ./indian_food_classifier.h5 ./frontend/models/indian_food_classifier/
```

### Step 3: Create Models Directory
```bash
# In your frontend folder
mkdir -p models/indian_food_classifier
```

### Step 4: Verify Conversion
After conversion, you should have:
```
frontend/
├── models/
│   └── indian_food_classifier/
│       ├── model.json          # Model architecture
│       └── group1-shard1of1.bin # Model weights
├── js/
│   └── model-loader.js         # ✅ Already created
└── food-image-analyzer.html    # ✅ Already updated
```

## Alternative: Use Your Current Python Code

If you prefer to keep using your Python code, you can:

1. **Run your Python script locally**
2. **Create a simple local server** that serves predictions
3. **Update the frontend** to call your local Python server

### Python Server Example:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load your model
model = load_model("indian_food_classifier.h5", compile=False)
class_names = ["Biryani", "Butter Chicken", "Dosa", "Idli", "Paneer Tikka", "Samosa"]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from request
        data = request.json
        image_data = data['image']
        
        # Decode base64 image
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        img = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions)
        confidence = float(np.max(predictions))
        
        return jsonify({
            'food': class_names[predicted_class],
            'confidence': confidence,
            'all_predictions': [
                {'food': class_names[i], 'confidence': float(predictions[0][i])}
                for i in range(len(class_names))
            ]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

Then update the frontend to use `http://localhost:5000/predict` instead of the TensorFlow.js model.

## 🎯 Recommended Approach

**For production**: Convert to TensorFlow.js (runs in browser, no server needed)
**For development**: Use Python server (easier to debug and modify)

## 🔧 Troubleshooting

### Model Not Loading?
1. Check browser console for errors
2. Verify model files are in correct location
3. Check network tab for failed requests
4. Ensure model.json and .bin files are accessible

### Conversion Issues?
1. Make sure TensorFlow versions match
2. Try: `pip install tensorflowjs[wizard]`
3. Use: `tensorflowjs_wizard` for interactive conversion

### Performance Issues?
1. Model runs in browser - may be slower than server
2. Consider model quantization for smaller size
3. Use Web Workers for non-blocking predictions

## 📝 Next Steps

1. Convert your model using the commands above
2. Test the food analyzer with your images
3. Fine-tune the gut health analysis based on your preferences
4. Deploy to production when ready!