const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;
const axios = require('axios');

// Configure multer for audio file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Middleware
app.use(cors());
app.use(express.json());

// Store active calls
const activeCalls = new Map();

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

    // Check if recipient has social media integration and scrape if needed
    let scrapedData = [];
    if (recipient.integrationSettings && recipient.integrationSettings.twitter && recipient.integrationSettings.twitter.username) {
        try {
            const scrapeResponse = await axios.post(`http://localhost:5000/api/scrape/${recipient.username}`);
            if (scrapeResponse.data && scrapeResponse.data.user && scrapeResponse.data.user.socialData) {
                scrapedData = scrapeResponse.data.user.socialData.twitter_scraped || [];
            }
        } catch (scrapeError) {
            console.error('Scraping failed during analysis:', scrapeError.message);
        }
    }

    // Combine all recipient data
    const allRecipientData = [
      ...recipientPosts,
      ...(scrapedData || []).map(post => `"${post.content}" (from Twitter)`)
    ].join('; ');

    const systemPrompt = `You are an empathetic AI assistant for CareAware, a mental health-aware social network. Your job is to analyze a user's message to a recipient and the recipient's recent activity to provide helpful feedback.

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

// Speech-to-text endpoint
app.post('/api/speech-to-text', upload.single('audio'), (req, res) => {
  console.log('🎤 [SPEECH-TO-TEXT] Request received');
  
  if (!req.file) {
    console.log('❌ [SPEECH-TO-TEXT] No audio file provided');
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const audioPath = req.file.path;
  const audioSize = req.file.size;
  const pythonArgs = [path.join(__dirname, 'speech_to_text.py'), audioPath];

  console.log(`🎤 [SPEECH-TO-TEXT] Processing audio file: ${audioPath} (${audioSize} bytes)`);

  const pythonProcess = spawn('python', pythonArgs);
  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
    console.log(`🎤 [SPEECH-TO-TEXT] Python stdout: ${data.toString().trim()}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
    console.log(`🎤 [SPEECH-TO-TEXT] Python stderr: ${data.toString().trim()}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`🎤 [SPEECH-TO-TEXT] Python process exited with code: ${code}`);
    
    // Clean up uploaded file
    fs.unlink(audioPath, (unlinkErr) => {
      if (unlinkErr) console.error('❌ [SPEECH-TO-TEXT] Error deleting audio file:', unlinkErr);
      else console.log(`🗑️ [SPEECH-TO-TEXT] Cleaned up audio file: ${audioPath}`);
    });

    if (code !== 0) {
      console.log(`❌ [SPEECH-TO-TEXT] Speech recognition failed with error: ${error}`);
      return res.status(500).json({ 
        error: 'Speech recognition failed', 
        details: error 
      });
    }

    try {
      const transcriptionResult = JSON.parse(result);
      console.log(`✅ [SPEECH-TO-TEXT] Success:`, transcriptionResult);
      res.json(transcriptionResult);
    } catch (parseError) {
      console.log(`❌ [SPEECH-TO-TEXT] Failed to parse result: ${parseError.message}`);
      res.status(500).json({ error: 'Failed to parse transcription result' });
    }
  });
});

// Text-to-speech endpoint
app.post('/api/text-to-speech', (req, res) => {
  const { text, voice = 'lily' } = req.body;
  
  console.log(`🔊 [TEXT-TO-SPEECH] Request received for text: "${text?.substring(0, 100)}..." with voice: ${voice}`);

  if (!text || !text.trim()) {
    console.log('❌ [TEXT-TO-SPEECH] No text provided');
    return res.status(400).json({ error: 'No text provided' });
  }

  // Create temporary JSON input file
  const inputPath = path.join(__dirname, `tts_input_${Date.now()}.json`);
  const outputPath = path.join(__dirname, `tts_output_${Date.now()}.wav`);

  console.log(`🔊 [TEXT-TO-SPEECH] Creating temp files: ${inputPath} -> ${outputPath}`);

  fs.writeFileSync(inputPath, JSON.stringify({ text }));

  const pythonArgs = [path.join(__dirname, 'text_to_speech.py'), inputPath, outputPath, voice];

  console.log(`🔊 [TEXT-TO-SPEECH] Starting Python process with args:`, pythonArgs);

  const pythonProcess = spawn('python', pythonArgs);
  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
    console.log(`🔊 [TEXT-TO-SPEECH] Python stdout: ${data.toString().trim()}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
    console.log(`🔊 [TEXT-TO-SPEECH] Python stderr: ${data.toString().trim()}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`🔊 [TEXT-TO-SPEECH] Python process exited with code: ${code}`);
    
    // Clean up input file
    fs.unlink(inputPath, (unlinkErr) => {
      if (unlinkErr) console.error('❌ [TEXT-TO-SPEECH] Error deleting input file:', unlinkErr);
      else console.log(`🗑️ [TEXT-TO-SPEECH] Cleaned up input file: ${inputPath}`);
    });

    if (code !== 0) {
      console.log(`❌ [TEXT-TO-SPEECH] TTS failed with error: ${error}`);
      return res.status(500).json({ 
        error: 'Text-to-speech failed', 
        details: error 
      });
    }

    try {
      const ttsResult = JSON.parse(result);
      console.log(`🔊 [TEXT-TO-SPEECH] Python result:`, ttsResult);
      
      if (ttsResult.success) {
        console.log(`🔊 [TEXT-TO-SPEECH] Reading audio file: ${outputPath}`);
        // Read the audio file and send as base64
        fs.readFile(outputPath, (readErr, audioData) => {
          if (readErr) {
            console.log(`❌ [TEXT-TO-SPEECH] Failed to read audio file: ${readErr.message}`);
            return res.status(500).json({ error: 'Failed to read audio file' });
          }

          const audioBase64 = audioData.toString('base64');
          console.log(`✅ [TEXT-TO-SPEECH] Audio file read successfully (${audioData.length} bytes)`);
          
          // Clean up output file
          fs.unlink(outputPath, (unlinkErr) => {
            if (unlinkErr) console.error('❌ [TEXT-TO-SPEECH] Error deleting output file:', unlinkErr);
            else console.log(`🗑️ [TEXT-TO-SPEECH] Cleaned up output file: ${outputPath}`);
          });

          res.json({
            ...ttsResult,
            audioData: `data:audio/wav;base64,${audioBase64}`
          });
        });
      } else {
        console.log(`❌ [TEXT-TO-SPEECH] TTS was not successful:`, ttsResult);
        res.json(ttsResult);
      }
    } catch (parseError) {
      console.log(`❌ [TEXT-TO-SPEECH] Failed to parse result: ${parseError.message}`);
      res.status(500).json({ error: 'Failed to parse TTS result' });
    }
  });
});

// Call speech analysis endpoint
app.post('/api/analyze-call-speech', async (req, res) => {
  const { callerId, recipientId, transcription, biometricData } = req.body;
  
  console.log(`🧠 [AI-ANALYSIS] Request received:`);
  console.log(`   Caller ID: ${callerId}`);
  console.log(`   Recipient ID: ${recipientId}`);
  console.log(`   Transcription: "${transcription}"`);
  console.log(`   Biometric Data:`, biometricData);

  try {
    // Get both users' data
    const caller = users.find(u => u.id === parseInt(callerId));
    const recipient = users.find(u => u.id === parseInt(recipientId));

    if (!caller || !recipient) {
      console.log(`❌ [AI-ANALYSIS] User not found - Caller: ${caller?.name}, Recipient: ${recipient?.name}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`🧠 [AI-ANALYSIS] Found users - Caller: ${caller.name}, Recipient: ${recipient.name}`);

    // Get recipient's recent posts and activity
    const recipientPosts = posts.filter(p => p.userId === parseInt(recipientId))
      .slice(0, 3)
      .map(p => `"${p.content}"`);

    // Combine recipient data
    const recipientContext = [
      `Recent mood: ${recipient.recentActivity?.mood || 'unknown'}`,
      `Recent heart rate: ${recipient.recentActivity?.heartRate || 'unknown'} BPM`,
      `Recent posts: ${recipientPosts.join('; ')}`,
      `Bio: ${recipient.bio}`,
      `Interests: ${recipient.interests?.join(', ') || 'none listed'}`
    ].join('\n');

    console.log(`🧠 [AI-ANALYSIS] Recipient context:`, recipientContext);

    // Add biometric context if provided
    let biometricContext = '';
    if (biometricData) {
      biometricContext = `Current biometric data: Heart rate: ${biometricData.heartRate || 'unknown'} BPM, Stress level: ${biometricData.stressLevel || 'unknown'}, Activity: ${biometricData.activity || 'unknown'}`;
      console.log(`🧠 [AI-ANALYSIS] Biometric context:`, biometricContext);
    }

    const systemPrompt = `You are an empathetic AI assistant for CareAware, a mental health-aware social network. You're analyzing speech during a live call to provide real-time guidance.

CRITICAL: You must respond with valid JSON in this exact format:
{
  "alert": "Alert message if the speech might be insensitive or inappropriate",
  "suggestion": "Suggested response or conversation direction",
  "biometricAlert": "Alert about concerning biometric data",
  "shouldRespond": true/false
}

Rules:
- If the transcribed speech seems insensitive given the recipient's context, provide an "alert"
- Always provide a "suggestion" for how to continue the conversation empathetically
- If biometric data shows stress/concern, provide a "biometricAlert"
- Set "shouldRespond" to true if immediate guidance is needed, false for normal conversation flow
- Keep responses concise and actionable for real-time use
- Focus on mental health awareness and empathy

Caller: ${caller.name}
Recipient context: ${recipientContext}
${biometricContext}
Transcribed speech: "${transcription}"`;

    console.log(`🧠 [AI-ANALYSIS] Sending request to OpenRouter...`);

    const requestBody = {
      model: "google/gemma-2-9b-it",
      messages: [
        {
          role: "user",
          content: systemPrompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    };

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', requestBody, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'CareAware'
      }
    });

    const llmResponse = response.data.choices[0].message.content.trim();
    console.log(`🧠 [AI-ANALYSIS] LLM raw response:`, llmResponse);
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(llmResponse);
      console.log(`✅ [AI-ANALYSIS] Parsed response:`, parsedResponse);
    } catch (parseError) {
      console.log(`❌ [AI-ANALYSIS] Failed to parse LLM response: ${parseError.message}`);
      parsedResponse = { 
        alert: null, 
        suggestion: "Continue the conversation with empathy and understanding.",
        biometricAlert: null,
        shouldRespond: false
      };
    }

    console.log(`🧠 [AI-ANALYSIS] Sending final response:`, parsedResponse);
    res.json(parsedResponse);

  } catch (error) {
    console.error('❌ [AI-ANALYSIS] Error in call speech analysis:', error.message);
    console.error('❌ [AI-ANALYSIS] Full error:', error);
    res.status(500).json({
      alert: null,
      suggestion: "Continue the conversation with empathy and understanding.",
      biometricAlert: null,
      shouldRespond: false
    });
  }
});

// Socket.IO for real-time call communication
io.on('connection', (socket) => {
  console.log('🔌 [SOCKET] User connected:', socket.id);

  // Join a call room
  socket.on('join-call', (data) => {
    const { callerId, recipientId, callId } = data;
    const roomId = `call-${callId}`;
    
    socket.join(roomId);
    
    // Store call info
    activeCalls.set(socket.id, {
      callerId,
      recipientId,
      callId,
      roomId,
      joinedAt: new Date()
    });

    console.log(`🔌 [SOCKET] User ${callerId} joined call ${callId} in room ${roomId}`);
    socket.to(roomId).emit('user-joined-call', { userId: callerId });
  });

  // Handle real-time speech transcription
  socket.on('speech-transcribed', async (data) => {
    const { transcription, biometricData } = data;
    const callInfo = activeCalls.get(socket.id);

    console.log(`🔌 [SOCKET] Speech transcribed from user ${socket.id}:`, transcription);

    if (!callInfo) {
      console.log(`❌ [SOCKET] No call info found for socket ${socket.id}`);
      return;
    }

    console.log(`🔌 [SOCKET] Call info:`, callInfo);

    try {
      // Analyze the speech in real-time
      console.log(`🔌 [SOCKET] Sending analysis request...`);
      const analysisResponse = await axios.post(`http://localhost:${PORT}/api/analyze-call-speech`, {
        callerId: callInfo.callerId,
        recipientId: callInfo.recipientId,
        transcription,
        biometricData
      });

      const analysis = analysisResponse.data;
      console.log(`✅ [SOCKET] Analysis completed:`, analysis);

      // Send analysis back to the caller
      socket.emit('speech-analysis', {
        transcription,
        analysis,
        timestamp: new Date().toISOString()
      });

      console.log(`🔌 [SOCKET] Sent speech-analysis event to caller`);

      // If there's an alert or important suggestion, also notify the room
      if (analysis.shouldRespond && (analysis.alert || analysis.biometricAlert)) {
        console.log(`🚨 [SOCKET] Sending call alert to room ${callInfo.roomId}`);
        socket.to(callInfo.roomId).emit('call-alert', {
          type: analysis.alert ? 'speech' : 'biometric',
          message: analysis.alert || analysis.biometricAlert,
          severity: 'warning'
        });
      }

    } catch (error) {
      console.error('❌ [SOCKET] Error analyzing speech:', error.message);
      socket.emit('speech-analysis-error', { error: 'Failed to analyze speech' });
    }
  });

  // Handle leaving call
  socket.on('leave-call', () => {
    const callInfo = activeCalls.get(socket.id);
    if (callInfo) {
      socket.to(callInfo.roomId).emit('user-left-call', { userId: callInfo.callerId });
      activeCalls.delete(socket.id);
      console.log(`🔌 [SOCKET] User ${callInfo.callerId} left call ${callInfo.callId}`);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const callInfo = activeCalls.get(socket.id);
    if (callInfo) {
      socket.to(callInfo.roomId).emit('user-left-call', { userId: callInfo.callerId });
      activeCalls.delete(socket.id);
    }
    console.log('🔌 [SOCKET] User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`CareAware backend running on port ${PORT}`);
  console.log(`Socket.IO server ready for real-time call features`);
}); 