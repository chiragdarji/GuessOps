# 🎯 GuessOps - Visual Booth Mockup

## 📱 **Booth Setup Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                     🎪 AWS Community Day Booth                  │
│                                                                 │
│  👥 Visitors Queue    📺 55" TV Display    🎮 Moderator Station │
│                                                                 │
│      👤                 ┌─────────────┐         💻             │
│      👤      →         │   GUESSOPS   │    ←    Laptop/Tablet   │
│      👤                 │    GAME      │                        │
│                        │   SCREEN     │    🎤 Microphone       │
│      🟩 Standing       └─────────────┘                        │
│      Square Box                                🎁 Swag Table   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ **TV Screen Mockups (Dark Theme)**

### **Screen 1: Welcome/Setup**
```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║                    🎯 GUESSOPS                                    ║
║               AWS Cloud Game Booth                                ║
║                                                                   ║
║              🎪 AWS Community Day Vadodara                        ║
║                                                                   ║
║                                                                   ║
║                  🎮 Ready to Start!                               ║
║                                                                   ║
║           Language: 🇬🇧 EN  🇮🇳 HI  ગુ GU                          ║
║           Difficulty: 🟢 Easy  🟡 Medium  🔴 Hard                  ║
║                                                                   ║
║                                                                   ║
║              [Moderator: Press SPACE to start]                   ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

### **Screen 2: Poem Display (Active Game)**
```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║                     🎵 AWS Service Riddle                        ║
║                                                                   ║
║                                                                   ║
║            "In buckets vast your data reside,                    ║
║             A shoreless lake where bytes abide.                  ║
║             Simple Storage Service, they say,                    ║
║             Your files are safe, come what may."                 ║
║                                                                   ║
║                                                                   ║
║                    ⏱️  Timer: 23 seconds                          ║
║                      🔊 Now playing...                           ║
║                                                                   ║
║                                                                   ║
║                  💭 What AWS service is this?                    ║
║                                                                   ║
║     [Moderator Panel: Type guess for fuzzy matching]             ║
╚═══════════════════════════════════════════════════════════════════╝
```

### **Screen 3: Fuzzy Guess Feedback**
```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║                     🎵 AWS Service Riddle                        ║
║                                                                   ║
║            "In buckets vast your data reside,                    ║
║             A shoreless lake where bytes abide.                  ║
║             Simple Storage Service, they say,                    ║
║             Your files are safe, come what may."                 ║
║                                                                   ║
║                    ⏱️  Timer: 15 seconds                          ║
║                                                                   ║
║                  💭 Guess: "S3 Storage"                          ║
║                    🎯 Very Close!                                ║
║                                                                   ║
║     [Moderator: R to Reveal | N for Next | Space to continue]    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### **Screen 4: Reveal Answer**
```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║                        ✅ CORRECT!                               ║
║                                                                   ║
║                      🎯 Amazon S3                                ║
║                                                                   ║
║                                                                   ║
║                     💡 Explanation:                              ║
║                                                                   ║
║          "Amazon S3 is an object storage service                 ║
║           to store and retrieve any amount of data               ║
║           from anywhere on the web."                             ║
║                                                                   ║
║                                                                   ║
║                   🎁 Grab your AWS swag! 🎁                      ║
║                                                                   ║
║              [Moderator: N for Next Question]                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### **Screen 5: Time's Up**
```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║                        ⏰ TIME'S UP!                             ║
║                                                                   ║
║                      🎯 Amazon S3                                ║
║                                                                   ║
║                                                                   ║
║                     💡 Explanation:                              ║
║                                                                   ║
║          "Amazon S3 is an object storage service                 ║
║           to store and retrieve any amount of data               ║
║           from anywhere on the web."                             ║
║                                                                   ║
║                                                                   ║
║               🎁 Thanks for playing! Grab swag! 🎁               ║
║                                                                   ║
║              [Moderator: N for Next Question]                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 🎮 **Moderator Control Panel (Laptop/Tablet)**

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 GuessOps Moderator Panel                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Current: Question 3/∞  │  Language: EN  │  Difficulty: 🟢  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Fuzzy Guess Input:                                     │ │
│  │  [Simple Storage____________]  → 🎯 Very Close!         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  🎮 Controls:                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │  NEXT  │ │ REVEAL │ │  SKIP  │ │ TIMER+ │ │ TIMER- │    │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
│                                                             │
│  🔧 Settings:                                               │
│  Language: [EN] [HI] [GU]    Difficulty: [Easy] [Med] [Hard] │
│  Timer: [15s] [30s] [45s] [60s]    🔊 TTS: [ON] [OFF]       │
│                                                             │
│  📊 Session Stats:                                          │
│  Questions Asked: 12  │  Avg Time: 28s  │  Swag Given: 8   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎪 **Booth Experience Flow**

### **Visitor Journey:**
1. **👀 Attraction**: Sees colorful screen with "GuessOps" branding
2. **🚶 Approach**: Walks to booth, moderator welcomes them
3. **📍 Position**: Stands on designated square box facing TV
4. **🎵 Listen**: Hears poem being read aloud in chosen language
5. **💭 Think**: Processes the riddle clues (30-60 seconds)
6. **🗣️ Guess**: Says their guess aloud to moderator
7. **🎯 Feedback**: Sees "Close/Very Close/Not Close" on screen
8. **✅ Reveal**: Learns the correct answer and explanation
9. **🎁 Reward**: Gets AWS swag (stickers, badges, etc.)
10. **🔄 Continue**: Option to play another round or move on

### **Moderator Actions:**
- **Welcome** visitors and explain the game briefly
- **Start** new questions with spacebar/click
- **Type** visitor guesses for fuzzy matching
- **Control** reveal timing based on engagement
- **Distribute** swag and encourage learning
- **Adjust** difficulty/language based on audience

---

## 🎨 **Visual Design Elements**

### **Color Scheme:**
- **Background**: Dark navy (#1a1a2e)
- **Primary**: AWS Orange (#ff9900)
- **Secondary**: Electric Blue (#00d4ff)
- **Success**: Green (#4caf50)
- **Warning**: Amber (#ffc107)
- **Text**: White/Light gray

### **Typography:**
- **Poems**: 48px, Serif font (readable, poetic)
- **Answers**: 64px, Bold Sans-serif
- **Explanations**: 36px, Regular Sans-serif
- **Timer**: 42px, Monospace
- **Controls**: 24px, Medium Sans-serif

### **Animations:**
- **Poem Fade-in**: 0.8s smooth entrance
- **Timer Ring**: Circular countdown animation
- **Reveal Effect**: Answer slides up with glow
- **Success Celebration**: Confetti or sparkle effect

---

## 🚀 **Implementation Priority**

### **Phase 1 (MVP)**: 
- ✅ Basic poem display
- ✅ Timer functionality  
- ✅ Reveal mechanism
- ✅ Static question bank

### **Phase 2 (Enhanced)**:
- 🔄 Fuzzy guess matching
- 🔊 Text-to-Speech integration
- 🎨 Smooth animations
- 📱 Moderator panel

### **Phase 3 (Polish)**:
- 🌐 Multi-language TTS
- 🎵 Background music/sounds
- 📊 Session analytics
- 🎁 Swag tracking

---

**This mockup shows exactly how GuessOps will look and feel at the AWS Community Day booth! 🎪**
