// Manual Entry Redesigned JavaScript
class ManualEntryApp {
    constructor() {
        this.currentStep = 1;
        this.selectedFood = null;
        this.selectedCategory = null;
        this.searchTimeout = null;
        this.recentSearches = ['Chicken Biryani', 'Margherita Pizza', 'Greek Salad'];
        
        this.foodDatabase = {
            indian: [
                { name: 'Chicken Biryani', icon: '🍛', description: 'Aromatic rice with spiced chicken' },
                { name: 'Butter Chicken', icon: '🍗', description: 'Creamy tomato-based curry' },
                { name: 'Masala Dosa', icon: '🥞', description: 'Crispy crepe with spiced filling' },
                { name: 'Dal Tadka', icon: '🍲', description: 'Spiced lentil curry' },
                { name: 'Paneer Tikka', icon: '🧀', description: 'Grilled cottage cheese cubes' },
                { name: 'Chole Bhature', icon: '🍞', description: 'Spicy chickpeas with fried bread' }
            ],
            italian: [
                { name: 'Margherita Pizza', icon: '🍕', description: 'Classic tomato and mozzarella' },
                { name: 'Spaghetti Carbonara', icon: '🍝', description: 'Pasta with eggs and cheese' },
                { name: 'Lasagna', icon: '🍝', description: 'Layered pasta with meat sauce' },
                { name: 'Risotto', icon: '🍚', description: 'Creamy Italian rice dish' },
                { name: 'Caesar Salad', icon: '🥗', description: 'Romaine with Caesar dressing' },
                { name: 'Tiramisu', icon: '🍰', description: 'Coffee-flavored dessert' }
            ],
            chinese: [
                { name: 'Fried Rice', icon: '🍚', description: 'Wok-fried rice with vegetables' },
                { name: 'Sweet & Sour Chicken', icon: '🍗', description: 'Battered chicken in tangy sauce' },
                { name: 'Chow Mein', icon: '🍜', description: 'Stir-fried noodles' },
                { name: 'Dumplings', icon: '🥟', description: 'Steamed or fried dumplings' },
                { name: 'Kung Pao Chicken', icon: '🌶️', description: 'Spicy chicken with peanuts' },
                { name: 'Hot Pot', icon: '🍲', description: 'Communal cooking pot' }
            ],
            mexican: [
                { name: 'Chicken Tacos', icon: '🌮', description: 'Soft tacos with grilled chicken' },
                { name: 'Burrito Bowl', icon: '🍲', description: 'Rice bowl with Mexican toppings' },
                { name: 'Quesadilla', icon: '🫓', description: 'Grilled tortilla with cheese' },
                { name: 'Guacamole', icon: '🥑', description: 'Avocado-based dip' },
                { name: 'Enchiladas', icon: '🌯', description: 'Rolled tortillas with sauce' },
                { name: 'Nachos', icon: '🧀', description: 'Tortilla chips with cheese' }
            ],
            american: [
                { name: 'Cheeseburger', icon: '🍔', description: 'Beef patty with cheese' },
                { name: 'BBQ Ribs', icon: '🍖', description: 'Slow-cooked pork ribs' },
                { name: 'Mac & Cheese', icon: '🧀', description: 'Pasta with cheese sauce' },
                { name: 'Chicken Wings', icon: '🍗', description: 'Fried or grilled wings' },
                { name: 'Pancakes', icon: '🥞', description: 'Fluffy breakfast pancakes' },
                { name: 'Apple Pie', icon: '🥧', description: 'Classic American dessert' }
            ],
            healthy: [
                { name: 'Quinoa Salad', icon: '🥗', description: 'Protein-rich grain salad' },
                { name: 'Grilled Salmon', icon: '🐟', description: 'Omega-3 rich fish' },
                { name: 'Avocado Toast', icon: '🥑', description: 'Whole grain bread with avocado' },
                { name: 'Green Smoothie', icon: '🥤', description: 'Nutrient-packed smoothie' },
                { name: 'Buddha Bowl', icon: '🍲', description: 'Balanced bowl with grains and veggies' },
                { name: 'Chia Pudding', icon: '🍮', description: 'Superfood pudding' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.updateStepDisplay();
        this.setupEventListeners();
        this.loadRecentSearches();
    }
    
    setupEventListeners() {
        // Search input events
        const searchInput = document.getElementById('foodSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('focus', () => this.showSearchSuggestions());
            searchInput.addEventListener('blur', () => {
                // Delay hiding to allow clicks on suggestions
                setTimeout(() => this.hideSearchSuggestions(), 200);
            });
        }
        
        // Cooking style chips
        document.querySelectorAll('.cooking-chip').forEach(chip => {
            chip.addEventListener('click', () => this.toggleCookingStyle(chip));
        });
        
        // Symptom toggle
        const symptomToggle = document.querySelector('.symptom-toggle');
        if (symptomToggle) {
            symptomToggle.addEventListener('click', () => this.toggleSymptoms());
        }
    }
    
    updateStepDisplay() {
        // Update progress steps
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update step content
        document.querySelectorAll('.step-content').forEach((content, index) => {
            content.classList.remove('active');
            if (index + 1 === this.currentStep) {
                content.classList.add('active');
            }
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        const backBtn = document.getElementById('backBtn');
        const nextBtn = document.getElementById('nextBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        // Show/hide back button
        if (backBtn) {
            backBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        
        // Update next/analyze button
        if (this.currentStep === 1) {
            if (nextBtn) {
                nextBtn.style.display = 'block';
                nextBtn.disabled = !this.selectedFood;
                nextBtn.textContent = 'Continue →';
            }
            if (analyzeBtn) analyzeBtn.style.display = 'none';
        } else if (this.currentStep === 2) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (analyzeBtn) analyzeBtn.style.display = 'flex';
        } else {
            if (nextBtn) nextBtn.style.display = 'none';
            if (analyzeBtn) analyzeBtn.style.display = 'none';
        }
    }
    
    handleSearch(query) {
        const liveResults = document.getElementById('liveResults');
        const clearButton = document.querySelector('.clear-search');
        
        // Show/hide clear button
        if (clearButton) {
            clearButton.style.display = query.length > 0 ? 'block' : 'none';
        }
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            if (query.length > 2) {
                this.performSearch(query);
                if (liveResults) liveResults.style.display = 'block';
            } else {
                if (liveResults) liveResults.style.display = 'none';
            }
        }, 300);
    }
    
    performSearch(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        // Search through all categories
        Object.entries(this.foodDatabase).forEach(([category, foods]) => {
            foods.forEach(food => {
                if (food.name.toLowerCase().includes(queryLower) || 
                    food.description.toLowerCase().includes(queryLower)) {
                    results.push({ ...food, category });
                }
            });
        });
        
        this.displaySearchResults(results.slice(0, 6)); // Limit to 6 results
    }
    
    displaySearchResults(results) {
        const liveResults = document.getElementById('liveResults');
        if (!liveResults) return;
        
        if (results.length === 0) {
            liveResults.innerHTML = '<div class="no-results">No foods found. Try a different search term.</div>';
            return;
        }
        
        liveResults.innerHTML = results.map(food => `
            <div class="suggestion-item" onclick="app.selectFood('${food.name}', '${food.category}', '${food.icon}')">
                <div class="suggestion-icon">${food.icon}</div>
                <div class="suggestion-content">
                    <span class="suggestion-name">${food.name}</span>
                    <span class="suggestion-category">${food.category} • ${food.description}</span>
                </div>
            </div>
        `).join('');
    }
    
    showSearchSuggestions() {
        const suggestions = document.getElementById('searchSuggestions');
        const searchInput = document.getElementById('foodSearch');
        
        if (suggestions && searchInput && !searchInput.value) {
            suggestions.style.display = 'block';
        }
    }
    
    hideSearchSuggestions() {
        const suggestions = document.getElementById('searchSuggestions');
        const liveResults = document.getElementById('liveResults');
        
        if (suggestions) suggestions.style.display = 'none';
        if (liveResults) liveResults.style.display = 'none';
    }
    
    selectCategory(category) {
        this.selectedCategory = category;
        
        // Highlight selected category
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('selected');
        
        // Show category foods
        this.showCategoryFoods(category);
    }
    
    showCategoryFoods(category) {
        const categoryFoods = document.getElementById('categoryFoods');
        const categoryTitle = document.getElementById('categoryTitle');
        const foodsGrid = document.getElementById('foodsGrid');
        const categoriesSection = document.querySelector('.categories-section');
        
        if (!categoryFoods || !this.foodDatabase[category]) return;
        
        // Update title
        if (categoryTitle) {
            categoryTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Foods`;
        }
        
        // Generate food items
        const foods = this.foodDatabase[category];
        if (foodsGrid) {
            foodsGrid.innerHTML = foods.map(food => `
                <div class="food-item" onclick="app.selectFood('${food.name}', '${category}', '${food.icon}')">
                    <div class="food-item-icon">${food.icon}</div>
                    <h4>${food.name}</h4>
                </div>
            `).join('');
        }
        
        // Show category foods, hide categories
        if (categoriesSection) categoriesSection.style.display = 'none';
        if (categoryFoods) categoryFoods.style.display = 'block';
    }
    
    backToCategories() {
        const categoryFoods = document.getElementById('categoryFoods');
        const categoriesSection = document.querySelector('.categories-section');
        
        if (categoryFoods) categoryFoods.style.display = 'none';
        if (categoriesSection) categoriesSection.style.display = 'block';
        
        // Clear category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });
        this.selectedCategory = null;
    }
    
    selectFood(name, category, icon = '🍽️') {
        this.selectedFood = { name, category, icon };
        
        // Add to recent searches
        if (!this.recentSearches.includes(name)) {
            this.recentSearches.unshift(name);
            this.recentSearches = this.recentSearches.slice(0, 5); // Keep only 5 recent
        }
        
        // Update search input
        const searchInput = document.getElementById('foodSearch');
        if (searchInput) searchInput.value = name;
        
        // Hide suggestions and results
        this.hideSearchSuggestions();
        
        // Update navigation
        this.updateNavigationButtons();
        
        // Show success feedback
        this.showFoodSelectedFeedback(name, icon);
    }
    
    showFoodSelectedFeedback(name, icon) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = 'food-selected-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-icon">${icon}</span>
                <span class="feedback-text">${name} selected!</span>
                <span class="feedback-check">✓</span>
            </div>
        `;
        
        // Add styles
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            border: 2px solid #27ae60;
            border-radius: 16px;
            padding: 20px 24px;
            z-index: 1000;
            animation: feedbackPop 0.6s ease-out;
            box-shadow: 0 8px 30px rgba(39, 174, 96, 0.3);
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes feedbackPop {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            .feedback-content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: #155724;
                font-weight: 600;
            }
            .feedback-icon { font-size: 1.5rem; }
            .feedback-check { color: #27ae60; font-size: 1.2rem; }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(feedback);
        
        // Remove after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 1500);
    }
    
    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
            this.updateStepDisplay();
            
            // Update step 2 with selected food
            if (this.currentStep === 2 && this.selectedFood) {
                this.updateFoodConfirmation();
            }
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }
    
    updateFoodConfirmation() {
        const foodIcon = document.getElementById('selectedFoodIcon');
        const foodName = document.getElementById('selectedFoodName');
        const foodCategory = document.getElementById('selectedFoodCategory');
        
        if (foodIcon) foodIcon.textContent = this.selectedFood.icon;
        if (foodName) foodName.textContent = this.selectedFood.name;
        if (foodCategory) foodCategory.textContent = `${this.selectedFood.category.charAt(0).toUpperCase() + this.selectedFood.category.slice(1)} cuisine`;
    }
    
    editFood() {
        this.currentStep = 1;
        this.updateStepDisplay();
    }
    
    toggleCookingStyle(chip) {
        chip.classList.toggle('selected');
    }
    
    toggleSymptoms() {
        const symptomOptions = document.getElementById('symptomOptions');
        const toggleIcon = document.getElementById('symptomToggle');
        
        if (symptomOptions && toggleIcon) {
            const isOpen = symptomOptions.style.display === 'block';
            symptomOptions.style.display = isOpen ? 'none' : 'block';
            toggleIcon.textContent = isOpen ? '+' : '−';
            toggleIcon.classList.toggle('open', !isOpen);
        }
    }
    
    analyzeFood() {
        this.currentStep = 3;
        this.updateStepDisplay();
        
        // Start analysis animation
        this.startAnalysisAnimation();
    }
    
    startAnalysisAnimation() {
        const steps = document.querySelectorAll('.loading-step');
        let currentStep = 0;
        
        const stepInterval = setInterval(() => {
            if (currentStep > 0) {
                steps[currentStep - 1].classList.remove('active');
                steps[currentStep - 1].classList.add('completed');
            }
            
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(stepInterval);
                // Navigate to results after animation
                setTimeout(() => {
                    window.location.href = 'gut-result.html';
                }, 1000);
            }
        }, 1200);
    }
    
    clearSearch() {
        const searchInput = document.getElementById('foodSearch');
        const clearButton = document.querySelector('.clear-search');
        
        if (searchInput) searchInput.value = '';
        if (clearButton) clearButton.style.display = 'none';
        
        this.hideSearchSuggestions();
    }
    
    loadRecentSearches() {
        // In a real app, this would load from localStorage
        // For now, we'll use the default recent searches
    }
}

// Global functions for onclick handlers
function goBack() {
    window.location.href = 'dashboard.html';
}

function selectCategory(category) {
    app.selectCategory(category);
}

function selectFood(name, category, icon) {
    app.selectFood(name, category, icon);
}

function backToCategories() {
    app.backToCategories();
}

function nextStep() {
    app.nextStep();
}

function previousStep() {
    app.previousStep();
}

function analyzeFood() {
    app.analyzeFood();
}

function clearSearch() {
    app.clearSearch();
}

function showSearchSuggestions() {
    app.showSearchSuggestions();
}

function handleSearch(query) {
    app.handleSearch(query);
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ManualEntryApp();
});