# CareAware 🌱

## Mental Health-Aware Social Network MVP

CareAware is a revolutionary social networking platform that integrates AI-driven mental health awareness directly into social interactions, enhancing empathy and sensitivity in digital communications.

### 🎯 Features

#### 🤖 AI-Powered Empathy Features
- **Empathy Alerts**: Real-time warnings before sending potentially sensitive messages
- **Conversation Starters**: AI-suggested topics based on mutual interests and recent activities
- **Biometric Integration**: Smartwatch data analysis for stress level monitoring
- **Social Media Analysis**: Contextual insights from Reddit, Instagram, and Discord activity

#### 🎨 Beautiful Autumn-Themed UI
- Warm, inviting color palette inspired by autumn
- Modern, accessible design with dark mode support
- Responsive layout optimized for all devices
- Smooth animations and transitions

#### 🔒 Privacy-First Approach
- Granular privacy controls for data sources
- Transparent data usage policies
- Local processing when possible
- User-controlled empathy score sharing

#### 📱 Core Social Features
- Post creation and sharing
- Real-time messaging with AI insights
- User profiles with empathy scores
- Feed with mindful interaction tips

### 🛠️ Tech Stack

#### Frontend
- **React 19.1.0** - Modern UI library
- **React Router Dom** - Client-side routing
- **Axios** - API communication
- **CSS Variables** - Theming and styling

#### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing

### 🚀 Getting Started

#### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

#### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mhealth/CareAware
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

#### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   # App runs on http://localhost:3000
   ```

3. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically connect to the backend API

### 📋 Usage Guide

#### Dashboard
- View AI insights and empathy alerts
- Monitor live biometric data from smartwatch
- Check empathy score and weekly stats
- Access quick actions for posting and messaging

#### Messaging
- Real-time empathy alerts while typing
- Biometric warnings for stressed recipients
- AI-suggested conversation starters
- Sensitive topic detection

#### Feed
- Browse posts with AI empathy insights
- Interact mindfully with like and support buttons
- View conversation starter suggestions
- Follow mindful interaction tips

#### Privacy Settings
- Control social media data access
- Enable/disable smartwatch integration
- Manage notification preferences
- Configure empathy score visibility

### 🔬 AI Analysis Features

#### Empathy Alert Examples
- **Sensitive Topic Detection**: "Maddy recently lost her mother. This topic might be painful."
- **Conversation Suggestions**: "Ask about Sarah's hiking adventures!"
- **Biometric Warnings**: "Heart rate elevated - consider a gentle approach."

#### Data Sources
- **Reddit**: Post sentiment and mood analysis
- **Instagram**: Story and post emotional context
- **Discord**: Message stress indicators
- **Smartwatch**: Heart rate, activity, and stress levels

### 🎨 Design Philosophy

#### Color Palette
- **Primary Orange**: `#E85A4F` - Warm, inviting primary color
- **Sage Green**: `#A8B5A0` - Calming, natural accent
- **Golden Yellow**: `#F4B942` - Optimistic highlights
- **Deep Teal**: `#4F7942` - Stable, trustworthy elements

#### Typography
- **Primary Font**: Segoe UI, Tahoma, Geneva, Verdana
- **Accessible**: High contrast ratios
- **Readable**: Optimal line heights and spacing

### 🔧 Development

#### Project Structure
```
CareAware/
├── backend/
│   ├── server.js          # Express server and API routes
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── App.css        # Global styles
│   └── package.json       # Frontend dependencies
└── README.md             # This file
```

#### API Endpoints
- `GET /api/users` - Fetch all users
- `GET /api/posts` - Fetch all posts
- `POST /api/analyze-message` - Analyze message for empathy insights
- `GET /api/conversations/:userId` - Get user conversations
- `POST /api/messages` - Send a message
- `GET /api/smartwatch/:userId` - Get smartwatch data

#### Mock Data
The application currently uses mock data for:
- User profiles and social data
- Posts and interactions
- Smartwatch biometric data
- AI analysis responses

### 🌟 Unique Features

#### Smartwatch Integration
- Camera-based screenshot capture every 5 seconds
- Heart rate and stress level analysis
- Real-time biometric alerts during conversations
- Activity and mood tracking

#### AI Empathy Engine
- Natural language processing for sentiment analysis
- Context-aware conversation suggestions
- Multi-platform social media integration
- Personalized empathy scoring

#### Mindful Social Networking
- Encourages thoughtful interactions
- Promotes mental health awareness
- Provides emotional support tools
- Creates safer digital spaces

### 🎯 MVP Scope

This is a hackathon MVP focusing on:
- Core empathy alert functionality
- Basic social networking features
- Smartwatch integration proof-of-concept
- Privacy control demonstrations

### 🚀 Future Enhancements

- Integration with real smartwatch APIs
- Advanced machine learning models
- Expanded social platform support
- Professional mental health resources
- Community support groups
- Wellness tracking and insights

### 🤝 Contributing

This is a hackathon project, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### 📄 License

This project is created for hackathon demonstration purposes.

### 🙏 Acknowledgments

- Built with modern web technologies
- Designed with mental health awareness in mind
- Created to promote empathetic digital interactions

---

**CareAware** - Making social media more mindful, one interaction at a time. 🌱💚 