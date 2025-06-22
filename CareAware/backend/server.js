const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require('axios');
const BiometricMonitor = require('./biometric-monitor');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Initialize Geby's biometric monitor
const gebyMonitor = new BiometricMonitor();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from pfps directory
app.use('/pfps', express.static(path.join(__dirname, 'pfps')));

// Mock data for demo purposes
let users = [
  {
    id: 1,
    name: "Geby",
    username: "geby",
    avatar: "http://localhost:5000/pfps/Geby.png",
    bio: "CS student at the University of Illinois. Building cool things for hackathons.",
    interests: ["Coding", "AI", "Hackathons", "Music"],
    integrationSettings: {
      twitter: { username: 'GebyCodes' },
      reddit: { username: 'geby_on_reddit' }
    },
    recentActivity: {
      mood: "focused",
      heartRate: 75,
      lastActive: new Date().toISOString()
    },
    socialData: {
      reddit: ["Active in r/programming and r/UIUC"],
      instagram: ["Posted about a new coding project"],
      discord: ["Talking about hackathon ideas"]
    }
  },
  {
    id: 2,
    name: "Connie",
    username: "connie_c",
    avatar: "https://i.pravatar.cc/100?img=5",
    bio: "Designer, artist, and professional vibe checker.",
    interests: ["Graphic Design", "Art History", "Photography", "Books"],
    integrationSettings: {
      instagram: { username: 'connie_designs' }
    },
    recentActivity: {
      mood: "calm",
      heartRate: 68,
      lastActive: new Date().toISOString()
    },
    socialData: {
      reddit: ["Posted in r/design"],
      instagram: ["Shared new digital art"],
      discord: ["Discussing color theory in a design server"]
    }
  },
  {
    id: 3,
    name: "William",
    username: "will_w",
    avatar: "http://localhost:5000/pfps/William.jpg",
    bio: "Explorer of mountains and code. Always looking for the next adventure.",
    interests: ["Hiking", "Rock Climbing", "Tech", "Travel"],
    integrationSettings: {},
    recentActivity: {
      mood: "energetic",
      heartRate: 80,
      lastActive: new Date().toISOString()
    },
    socialData: {
      reddit: ["Asking for trail recommendations in r/hiking"],
      instagram: ["Posted photos from a recent climbing trip"],
      discord: ["Planning a weekend trip with friends"]
    }
  },
  {
    id: 4,
    name: "Caeden",
    username: "caeden_sigma",
    avatar: "https://i.pravatar.cc/100?img=12",
    bio: "CEO @ Sigma | Building the future of agentic AI for education.",
    interests: ["AI", "EdTech", "Startups", "Machine Learning"],
    integrationSettings: {
      twitter: { username: 'caedensigma' }
    },
    recentActivity: {
      mood: "excited",
      heartRate: 82,
      lastActive: new Date().toISOString()
    },
    socialData: {
      reddit: ["Discussing the future of AI in r/futurology"],
      instagram: ["Posted team photos from the office"],
      discord: ["Hosting an AMA on AI in education"]
    }
  },
  {
    id: 5,
    name: "Laura Miller",
    username: "laura_m",
    avatar: "https://i.pravatar.cc/100?img=15",
    bio: "Photographer and nature lover.",
    interests: ["Photography", "Nature", "Hiking"],
    integrationSettings: {},
    recentActivity: { mood: "calm", heartRate: 65, lastActive: new Date().toISOString() },
    socialData: { reddit: [], instagram: ["Posting sunset photos"], discord: [] }
  },
  {
    id: 6,
    name: "David Kim",
    username: "david_k",
    avatar: "https://i.pravatar.cc/100?img=18",
    bio: "Software engineer focused on open source.",
    interests: ["Open Source", "Linux", "DevOps"],
    integrationSettings: {},
    recentActivity: { mood: "focused", heartRate: 70, lastActive: new Date().toISOString() },
    socialData: { reddit: ["Active in r/opensource"], instagram: [], discord: [] }
  }
];

let posts = [
  {
    id: 1,
    userId: 4,
    content: "Excited to announce Sigma's new platform for personalized, agentic learning. The future of education is here. #AI #EdTech #Innovation",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    likes: 152,
    comments: 45
  },
  {
    id: 2,
    userId: 1,
    content: "Hackathon mode: ON. Let's see what we can build this weekend! #coding #hackathon",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 25,
    comments: 10
  },
  {
    id: 3,
    userId: 5,
    content: "The golden hour light was perfect this evening. Capturing moments like these is why I love photography. #photography #sunset",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    likes: 58,
    comments: 12
  },
  {
    id: 4,
    userId: 2,
    content: "Just finished a new piece of digital art. The autumn color palette was so inspiring! #art #design #autumn",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    likes: 78,
    comments: 22
  },
  {
    id: 5,
    userId: 3,
    content: "Found an incredible hiking trail today. Nothing beats the fresh mountain air. #hiking #adventure #nature",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 42,
    comments: 9
  },
  {
    id: 6,
    userId: 6,
    content: "Just contributed to a really interesting open-source project. Love the collaborative spirit of the community. #opensource #programming",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    likes: 31,
    comments: 7
  }
];

let conversations = [
  {
    id: 1,
    participants: [1, 2], // Geby and Connie
    messages: [
      {
        id: 1,
        senderId: 2,
        content: "Hey Geby, you ready to win this hackathon?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        aiSuggested: false
      }
    ]
  },
  {
    id: 2,
    participants: [1, 3], // Geby and William
    messages: []
  },
  {
    id: 3,
    participants: [2, 3], // Connie and William
    messages: []
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
        id: user.id,
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
  posts.unshift(newPost);
  res.status(201).json(newPost);
});

// Update integration settings for a user
app.post('/api/users/:userId/integration-settings', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { integrationId, username } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.integrationSettings) {
    user.integrationSettings = {};
  }
  if (!user.integrationSettings[integrationId]) {
    user.integrationSettings[integrationId] = {};
  }
  user.integrationSettings[integrationId].username = username;

  console.log(`Updated ${integrationId} username for user ${userId} to ${username}`);
  res.json({ message: 'Settings updated successfully', user });
});

// Scrape user data from social media using CDP (Chrome DevTools Protocol)
app.post('/api/scrape/:username', (req, res) => {
    const { username } = req.params; // This is the CareAware username
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Get the specific Twitter username from the user's settings
    const twitterUsername = user.integrationSettings?.twitter?.username;

    if (!twitterUsername) {
        return res.status(400).json({ error: 'Twitter username is not set for this user. Please set it in Settings.' });
    }

    console.log(`Starting CDP-based scrape for Twitter user: ${twitterUsername}`);

    // Use CDP port (default 9222) instead of Chrome profile directory
    const cdpPort = process.env.CDP_PORT || 9222;
    const pythonArgs = [
        path.join(__dirname, 'scrape.py'),
        twitterUsername,
        cdpPort.toString()
    ];

    console.log('Launching Python scraper with CDP connection:', pythonArgs.join(' '));
    console.log(`Note: Make sure Chrome is running with --remote-debugging-port=${cdpPort}`);

    const pythonProcess = spawn('python', pythonArgs);

    let scriptOutput = "";
    let scriptError = "";

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        scriptOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        scriptError += data.toString();
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code !== 0) {
            return res.status(500).json({ 
                error: 'Failed to scrape data.', 
                details: scriptError 
            });
        }

        const dataFilePath = path.join(__dirname, `${twitterUsername}_data.json`);
        fs.readFile(dataFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading scraped data file:', err);
                return res.status(500).json({ error: 'Failed to read scraped data.' });
            }

            try {
                const scrapedData = JSON.parse(data);
                
                console.log('--- Scraped Data Received ---');
                console.log(JSON.stringify(scrapedData, null, 2));
                console.log('-----------------------------');

                // Update user's socialData
                if (!user.socialData) {
                    user.socialData = {};
                }
                user.socialData.twitter_scraped = scrapedData.twitter;
                user.socialData.speakeasy_posts = scrapedData.speakeasy.posts;

                // Clean up the JSON file
                fs.unlink(dataFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting scraped data file:', unlinkErr);
                    }
                });

                res.json({ 
                    message: `Successfully scraped and updated data for ${username}.`,
                    user: user
                });
            } catch (parseErr) {
                console.error('Error parsing scraped data:', parseErr);
                res.status(500).json({ error: 'Failed to parse scraped data.' });
            }
        });
    });
});

// AI Analysis endpoint
app.post('/api/analyze-message', async (req, res) => {
  const { recipientId, messageContent } = req.body;

  try {
    // Get recipient data
    const recipient = users.find(u => u.id === parseInt(recipientId));
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Get recipient's CareAware posts
    const recipientPosts = posts.filter(p => p.userId === parseInt(recipientId))
      .slice(0, 3) // Latest 3 posts
      .map(p => `"${p.content}"`);

    // Use existing scraped data if available, no new scraping
    let scrapedData = [];
    if (recipient.socialData && recipient.socialData.twitter_scraped) {
        scrapedData = recipient.socialData.twitter_scraped.tweets || [];
    }

    // Combine all recipient data
    const allRecipientData = [
      ...recipientPosts,
      ...(scrapedData || []).map(post => `"${post.text}" (from Twitter)`)
    ].join('; ');

    const systemPrompt = `You are an deadpan but humorous AI assistant for CareAware, a mental health-aware social network. Your job is to analyze a user's message to a recipient and the recipient's recent activity to provide helpful feedback.

CRITICAL: You must respond with valid JSON in this exact format:
{
  "alert": "Empathy Alert: [specific reason why this message might be insensitive, explain the reason clearly]" ,
  "suggestion": "[A more empathetic and engaging message suggestion]",
  "biometricAlert": "Biometric Alert: [specific concern about their health data]"
}

Rules:
- If you detect potential insensitivity, set "alert" with a specific, clear reason.
- If the message is generic/boring, provide a "suggestion" with a better alternative.
- Only one of "alert" or "suggestion" should be non-null.
- If the user's message seems to ask for help or information, provide the answer in the "suggestion" field.
- Keep suggestions warm, natural, and constructive.
- Respond ONLY with the JSON object, no other text or explanations.
- be helpful but be funny in a lowkey way, maybe some sarcasm(to the user) like your respond should be the quote they should say and then after *say this unless you want her to block you* etc idk sarcasm

Recipient's name: ${recipient.name}
Recipient's recent activity: ${allRecipientData || 'No recent activity found.'}
User's message to send: "${messageContent}"`;

    const requestBody = {
      model: "google/gemma-2-9b-it",
      messages: [
        {
          role: "user",
          content: systemPrompt
        }
      ],
      max_tokens: 200,
      temperature: 0.75
    };

    console.log('Sending request to OpenRouter...');
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', requestBody, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'CareAware'
      }
    });

    console.log('Received response from OpenRouter.');
    const llmResponse = response.data.choices[0].message.content.trim();
    console.log('Raw response content:', llmResponse);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(llmResponse);
      console.log('Parsed LLM response:', parsedResponse);
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError);
      parsedResponse = { alert: "Error: The AI's response was not valid.", suggestion: null, biometricAlert: null };
    }

    // Format the response to match frontend expectations
    const formattedResponse = {
      alert: parsedResponse.alert ? { message: parsedResponse.alert, severity: 'warning' } : null,
      suggestion: parsedResponse.suggestion ? { message: parsedResponse.suggestion, severity: 'info' } : null,
      biometricAlert: parsedResponse.biometricAlert ? { message: parsedResponse.biometricAlert, severity: 'danger' } : null,
      recipientMood: recipient.recentActivity?.mood || 'calm',
      confidence: 0.95
    };

    console.log('Final formatted response being sent:', formattedResponse);
    res.json(formattedResponse);

  } catch (error) {
    console.error('Error in AI analysis:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    // Fallback response
    res.status(500).json({
      alert: { message: "An error occurred while analyzing the message.", severity: 'danger' },
      suggestion: null,
      biometricAlert: null,
      recipientMood: 'unknown',
      confidence: 0
    });
  }
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
  
  let conversation = conversations.find(c => c.id === parseInt(conversationId));
  
  // If no conversationId, create a new one
  if (!conversation && req.body.recipientId) {
    const recipientId = parseInt(req.body.recipientId);
    const existingConversation = conversations.find(c => 
      c.participants.includes(senderId) && c.participants.includes(recipientId)
    );

    if (existingConversation) {
      conversation = existingConversation;
    } else {
      const newConversation = {
        id: conversations.length + 1,
        participants: [senderId, recipientId],
        messages: []
      };
      conversations.push(newConversation);
      conversation = newConversation;
    }
  }

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found and recipientId not provided.' });
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

// Smartwatch data endpoint - real data for Geby, mock for others
app.get('/api/smartwatch/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Use real data for Geby if monitor is connected
  if (userId === 1 && gebyMonitor.isActive()) {
    const realData = gebyMonitor.getLatestData();
    const smartwatchData = {
      heartRate: realData.heartRate,
      stressLevel: realData.stressLevel,
      activity: realData.activity,
      temperature: realData.temperature,
      humidity: realData.humidity,
      timestamp: realData.timestamp,
      batteryLevel: Math.floor(Math.random() * 20) + 80, // Assume good battery
      screenshot: `data:image/png;base64,mockbase64data${Date.now()}`,
      isRealData: true,
      alerts: realData.alerts || []
    };
    
    console.log(`[Server] 📱 Serving real biometric data for Geby: ${realData.heartRate} BPM`);
    res.json(smartwatchData);
  } else {
    // Mock data for other users or when Geby's monitor is offline
    const mockData = {
      heartRate: Math.floor(Math.random() * 30) + 70, // 70-100 BPM
      stressLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      activity: ['sitting', 'walking', 'standing'][Math.floor(Math.random() * 3)],
      temperature: Math.random() * 2 + 36.5, // 36.5-38.5°C
      humidity: Math.floor(Math.random() * 20) + 40, // 40-60%
      timestamp: new Date().toISOString(),
      batteryLevel: Math.floor(Math.random() * 100),
      screenshot: `data:image/png;base64,mockbase64data${Date.now()}`,
      isRealData: false,
      alerts: []
    };
    
    res.json(mockData);
  }
});

// Biometric monitor status endpoint
app.get('/api/biometric-status', (req, res) => {
  res.json({
    isConnected: gebyMonitor.isActive(),
    userId: 1, // Geby
    lastUpdate: gebyMonitor.getLatestData().timestamp,
    connectionStatus: gebyMonitor.isActive() ? 'Connected to COM5' : 'Disconnected'
  });
});

// Real-time biometric alerts endpoint
app.get('/api/biometric-alerts/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  
  if (userId === 1 && gebyMonitor.isActive()) {
    const data = gebyMonitor.getLatestData();
    res.json({
      alerts: data.alerts || [],
      vitals: {
        heartRate: data.heartRate,
        temperature: data.temperature,
        stressLevel: data.stressLevel,
        activity: data.activity
      },
      timestamp: data.timestamp
    });
  } else {
    res.json({
      alerts: [],
      vitals: null,
      timestamp: new Date().toISOString()
    });
  }
});

// Update user's biometric data in real-time
gebyMonitor.setDataCallback((data) => {
  // Update Geby's user data with real biometric info
  const geby = users.find(u => u.id === 1);
  if (geby) {
    geby.recentActivity = {
      mood: data.stressLevel === 'high' ? 'stressed' : 
            data.stressLevel === 'medium' ? 'focused' : 'calm',
      heartRate: data.heartRate,
      lastActive: data.timestamp,
      temperature: data.temperature,
      humidity: data.humidity,
      activity: data.activity
    };
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 CareAware backend running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`📁 Static files: http://localhost:${PORT}/pfps/`);
  
  // Try to connect to Geby's biometric monitor
  console.log(`🔌 Attempting to connect to Geby's monitor...`);
  const connected = await gebyMonitor.connect('COM5', 115200);
  
  if (connected) {
    console.log(`✅ Successfully connected to Geby's biometric monitor!`);
    console.log(`📡 Real-time health data will be available for Geby (User ID: 1)`);
  } else {
    console.log(`⚠️  Could not connect to GPIO monitor. Using mock data for all users.`);
    console.log(`💡 Make sure the device is connected to COM5 and test.py works first.`);
  }
}); 