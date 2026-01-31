# GutSense Frontend

A modern, responsive web application for gut health food recommendations.

## 🚀 Features

- **Gut Profile Setup**: Interactive form to capture user's gut health sensitivities
- **Food Analysis**: Check food compatibility with your gut profile
- **Dashboard**: View analysis history and gut health insights
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **Vanilla JavaScript**: Interactive functionality
- **Responsive Design**: Mobile-first approach

## 📱 Pages

- `index.html` - Gut profile setup (Step 1)
- `dashboard.html` - Main dashboard with food analysis
- `food-check.html` - Food compatibility checker
- `profile.html` - User profile management
- `signin.html` / `signup.html` - Authentication pages
- `manual-entry.html` - Manual food entry
- `gut-result.html` - Analysis results
- `food-confirmation.html` - Food analysis confirmation

## 🎨 Styling

- `enhanced-styles.css` - Main application styles
- `auth-styles.css` - Authentication page styles
- `dashboard-styles.css` - Dashboard specific styles
- `food-check-styles.css` - Food checker styles
- `profile-styles.css` - Profile page styles

## 🚀 Deployment

### Vercel Deployment (Recommended)

This frontend is configured for easy deployment on Vercel:

1. **Push to GitHub** (done automatically)
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository: `dharanikarthi/gutsense-frontend`
   - Vercel will automatically detect the static site
   - No build configuration needed - it's a static HTML/CSS/JS site

3. **Environment Configuration**
   - Update API endpoints in JavaScript files to point to your deployed backend
   - Backend URL: `https://your-backend.vercel.app`

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/dharanikarthi/gutsense-frontend.git
   cd gutsense-frontend
   ```

2. **Install dependencies** (optional, for development server)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Or simply open `index.html` in your browser.

## 🔗 API Integration

The frontend integrates with the GutSense backend API:

- **Authentication**: `/api/auth/signup`, `/api/auth/login`
- **Gut Profile**: `/api/gut-profile/`
- **Food Analysis**: `/api/food/analyze`
- **Food History**: `/api/food/history`

Update the API base URL in your JavaScript files:
```javascript
const API_BASE_URL = 'https://your-backend.vercel.app';
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎯 User Flow

1. **Landing** → Gut profile setup
2. **Profile Setup** → Select sensitivities and spice tolerance
3. **Dashboard** → Main hub for food analysis
4. **Food Check** → Analyze specific foods
5. **Results** → View compatibility and recommendations

## 🔒 Security Features

- Content Security Policy headers
- XSS protection
- Frame options for clickjacking prevention
- Input validation and sanitization

## 🚀 Performance

- Optimized images and assets
- Minimal JavaScript for fast loading
- CSS optimizations for smooth animations
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check backend URL in JavaScript files
   - Verify CORS settings on backend
   - Ensure backend is deployed and running

2. **Styling Issues**
   - Clear browser cache
   - Check CSS file paths
   - Verify responsive breakpoints

3. **JavaScript Errors**
   - Check browser console for errors
   - Verify API endpoints
   - Check for typos in function names

## 📞 Contact

For questions or support, please open an issue in the repository.