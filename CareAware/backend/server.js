const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for demo purposes
let users = [
  {
    id: 1,
    name: "Maddy Johnson",
    username: "maddy_j",
    avatar: "https://i.pravatar.cc/100?img=1",
    bio: "Star Wars enthusiast | Coffee lover ☕",
    interests: ["Star Wars", "Photography", "Coffee", "Tech"],
    recentActivity: {
      mood: "elevated_stress",
      heartRate: 85,
      lastActive: new Date().toISOString()
    },
    socialData: {
      reddit: ["Recently posted about losing her mom", "Active in r/starwars"],
      instagram: ["Shared story about grief counseling", "Posted sunset photos"],
      discord: ["Mentioned feeling overwhelmed in study group"]
    }
  },
  {
    id: 2,
    name: "Alex Chen",
    username: "alex_c",
    avatar: "https://i.pravatar.cc/100?img=2",
    bio: "Designer & Mental Health Advocate 🌱",
    interests: ["Design", "Mental Health", "Gaming", "Books"],
    recentActivity: {
      mood: "calm",
      heartRate: 72,
      lastActive: new Date().toISOString()
    },
    socialData: {
      reddit: ["Posted in r/mentalhealth about self-care"],
      instagram: ["Shared mindfulness tips", "Posted workout selfie"],
      discord: ["Helping others in mental health support server"]
    }
  },
  {
    id: 3,
    name: "Sarah Williams",
    username: "sarah_w",
    avatar: "https://i.pravatar.cc/100?img=3",
    bio: "Medical Student | Hiking Enthusiast 🏔️",
    interests: ["Medicine", "Hiking", "Rock Climbing", "Photography"],
    recentActivity: {
      mood: "anxious",
      heartRate: 95,
      lastActive: new Date().toISOString()
    },
    socialData: {
      reddit: ["Stressed about medical school exams"],
      instagram: ["Posted about study burnout"],
      discord: ["Asked for study tips in med student group"]
    }
  }
];

let posts = [
  {
    id: 1,
    userId: 1,
    content: "Beautiful autumn sunset today 🍂✨",
    image: "https://images.unsplash.com/photo-1571304303607-404cb58e6f6c?w=500",
    timestamp: new Date().toISOString(),
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    userId: 2,
    content: "Taking time for mindfulness today. Remember to check in with yourself 🧘‍♀️",
    timestamp: new Date().toISOString(),
    likes: 8,
    comments: 2
  },
  {
    id: 3,
    userId: 3,
    content: "Study break! Anyone else feeling the exam stress? 📚😅",
    timestamp: new Date().toISOString(),
    likes: 15,
    comments: 5
  }
];

let conversations = [
  {
    id: 1,
    participants: [1, 2],
    messages: [
      {
        id: 1,
        senderId: 2,
        content: "Hey Maddy! How are you holding up?",
        timestamp: new Date().toISOString(),
        aiSuggested: true
      }
    ]
  }
];

// Routes

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Get all posts
app.get('/api/posts', (req, res) => {
  const postsWithUserInfo = posts.map(post => {
    const user = users.find(u => u.id === post.userId);
    return {
      ...post,
      user: {
        name: user.name,
        username: user.username,
        avatar: user.avatar
      }
    };
  });
  res.json(postsWithUserInfo);
});

// Create new post
app.post('/api/posts', (req, res) => {
  const newPost = {
    id: posts.length + 1,
    userId: req.body.userId,
    content: req.body.content,
    image: req.body.image,
    timestamp: new Date().toISOString(),
    likes: 0,
    comments: 0
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// AI Analysis endpoint - Empathy Alert
app.post('/api/analyze-message', (req, res) => {
  const { recipientId, messageContent } = req.body;
  const recipient = users.find(u => u.id === recipientId);
  
  if (!recipient) {
    return res.status(404).json({ error: 'Recipient not found' });
  }

  // Mock AI analysis based on message content and user's social data
  let alert = null;
  let suggestion = null;

  // Check for potentially sensitive topics
  const sensitiveTopics = ['mom', 'mother', 'family', 'parent'];
  const containsSensitiveTopic = sensitiveTopics.some(topic => 
    messageContent.toLowerCase().includes(topic)
  );

  if (containsSensitiveTopic && recipient.socialData.reddit.some(post => 
    post.toLowerCase().includes('mom') || post.toLowerCase().includes('mother')
  )) {
    alert = {
      type: 'empathy_warning',
      message: `⚠️ Sensitivity Alert: ${recipient.name}'s recent social media activity suggests they may have experienced a loss in their family. Consider a different approach.`,
      severity: 'high'
    };
  }

  // Generate conversation suggestions based on interests
  if (recipient.interests.length > 0) {
    const commonInterests = recipient.interests.slice(0, 2);
    suggestion = {
      type: 'conversation_starter',
      message: `💡 Conversation Tip: ${recipient.name} is interested in ${commonInterests.join(' and ')}. Maybe ask about their latest ${commonInterests[0]} experience!`,
      topics: commonInterests
    };
  }

  // Biometric analysis (mock smartwatch data)
  let biometricAlert = null;
  if (recipient.recentActivity.mood === 'elevated_stress' || recipient.recentActivity.heartRate > 90) {
    biometricAlert = {
      type: 'biometric_warning',
      message: `📱 Biometric Alert: ${recipient.name}'s heart rate is elevated (${recipient.recentActivity.heartRate} BPM). They might be stressed - consider a gentle approach.`,
      severity: 'medium'
    };
  }

  res.json({
    alert,
    suggestion,
    biometricAlert,
    recipientMood: recipient.recentActivity.mood,
    confidence: 0.85
  });
});

// Get conversations for user
app.get('/api/conversations/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userConversations = conversations.filter(conv => 
    conv.participants.includes(userId)
  );
  
  const conversationsWithUserInfo = userConversations.map(conv => {
    const otherParticipant = conv.participants.find(id => id !== userId);
    const otherUser = users.find(u => u.id === otherParticipant);
    return {
      ...conv,
      otherUser: {
        id: otherUser.id,
        name: otherUser.name,
        username: otherUser.username,
        avatar: otherUser.avatar
      }
    };
  });
  
  res.json(conversationsWithUserInfo);
});

// Send message
app.post('/api/messages', (req, res) => {
  const { conversationId, senderId, content } = req.body;
  
  const conversation = conversations.find(c => c.id === parseInt(conversationId));
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const newMessage = {
    id: conversation.messages.length + 1,
    senderId: parseInt(senderId),
    content,
    timestamp: new Date().toISOString(),
    aiSuggested: false
  };

  conversation.messages.push(newMessage);
  res.status(201).json(newMessage);
});

// Mock smartwatch data endpoint
app.get('/api/smartwatch/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Simulate smartwatch data
  const mockData = {
    heartRate: Math.floor(Math.random() * 30) + 70, // 70-100 BPM
    stressLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    activity: ['sitting', 'walking', 'standing'][Math.floor(Math.random() * 3)],
    timestamp: new Date().toISOString(),
    batteryLevel: Math.floor(Math.random() * 100),
    screenshot: `data:image/png;base64,mockbase64data${Date.now()}`
  };

  res.json(mockData);
});

app.listen(PORT, () => {
  console.log(`CareAware backend running on port ${PORT}`);
}); 