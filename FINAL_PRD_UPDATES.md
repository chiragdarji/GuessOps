# 🎯 Final PRD Updates - Simplified Architecture

## 📋 **Key Architectural Changes**

### **🔄 Timer Behavior**
- **OLD**: Timer always visible, shows 00:00 when expired
- **NEW**: Timer appears only during questions, disappears when expired
- **Impact**: Cleaner UI, less visual clutter during reveal phase

### **🔊 Voice System**
- **OLD**: Web Speech API primary, Polly optional
- **NEW**: AWS Polly primary, Web Speech API fallback
- **Impact**: Higher quality narration, better AWS integration

### **💾 Data Storage**
- **OLD**: DynamoDB, IndexedDB, offline caching
- **NEW**: No storage required - fully stateless application
- **Impact**: Significantly simplified architecture, faster deployment

### **🌐 Connectivity**
- **OLD**: Offline support with PWA features
- **NEW**: Internet required for all AWS services
- **Impact**: Removes complex offline logic, reduces development time

### **⏱️ Session Management**
- **OLD**: Session timeouts, automatic endings
- **NEW**: Runs continuously until manually closed
- **Impact**: Perfect for booth environment, no interruptions

---

## 🎯 **Updated Core Features**

### **Dynamic Timer Display**
- ✅ Appears only when question starts
- ✅ Prominent countdown during question
- ✅ Disappears when timer expires ("TIME'S UP!" message)
- ✅ Remains hidden during reveal state
- ✅ Reappears with next question

### **AWS Polly Integration**
- ✅ Primary narration using Neural Voices (Kajal/Raveena/Aditi)
- ✅ High-quality Indian English pronunciation
- ✅ Voice selection in settings
- ✅ Web Speech API fallback if Polly fails
- ✅ Automatic narration start

### **Stateless Architecture**
- ✅ No database or persistent storage
- ✅ All questions generated dynamically
- ✅ Settings persist only during session
- ✅ No user data collection or storage
- ✅ Fully in-memory operation

### **Continuous Operation**
- ✅ No automatic session timeouts
- ✅ Runs until manually closed by moderator
- ✅ Perfect for booth environment
- ✅ No interruptions during busy periods

---

## 📊 **Development Impact**

### **Removed Tasks (19 hours saved):**
- ❌ **Offline Support** (8h) - Not needed with AWS services
- ❌ **Fuzzy Answer Matching** (8h) - Simplified moderator workflow  
- ❌ **Complex Storage** (3h) - No persistence required

### **Simplified Tasks:**
- 🔄 **Timer System**: 12h → 10h (simpler visibility logic)
- 🔄 **Settings Page**: 6h → 5h (no storage persistence)
- 🔄 **Deployment**: 6h → 4h (no database setup)

### **Enhanced Tasks:**
- 🔼 **AWS Polly Integration**: 8h → 10h (primary voice system)

### **New Timeline:**
```
Week 1 (MVP): 75 hours - Core functionality
Week 2 (Polish): 10 hours - Visual enhancements  
Week 3 (Deploy): 7 hours - Production deployment
Total: 92 hours (19 hours saved)
```

---

## 🏗️ **Technical Architecture**

### **Frontend Stack:**
- **React + Next.js** (SPA, not PWA)
- **No service workers** or offline caching
- **Session-only state management**
- **AWS SDK integration** for Polly + Bedrock

### **AWS Services:**
- **AWS Bedrock** - Question/poem generation
- **AWS Polly** - High-quality text-to-speech
- **AWS Amplify** - Static hosting
- **AWS Parameter Store** - Secure configuration

### **No Storage Layer:**
- ❌ No DynamoDB
- ❌ No IndexedDB  
- ❌ No local storage
- ✅ Fully stateless operation

---

## ✅ **Updated Success Criteria**

### **Game Flow:**
1. ✅ Click "Next" → Loading animation → AI generates poem
2. ✅ Poem appears → AWS Polly narration starts → **Timer appears**
3. ✅ Timer counts down prominently
4. ✅ Timer expires → **Timer disappears** → "TIME'S UP!" message
5. ✅ Click "Reveal" → Answer shows → **Timer stays hidden**
6. ✅ Click "Next" → **Timer reappears** → Cycle repeats

### **Quality Standards:**
- ✅ High-quality AWS Polly narration (primary)
- ✅ Clean timer visibility (only when needed)
- ✅ No storage dependencies
- ✅ Continuous operation until manually closed
- ✅ TV-optimized display (50+ inch screens)

---

## 🚀 **Benefits of Simplified Architecture**

### **Development:**
- 🏃‍♂️ **Faster development** (19 hours saved)
- 🎯 **Simpler codebase** (no offline/storage complexity)
- 🔧 **Easier maintenance** (fewer moving parts)
- 📦 **Simpler deployment** (no database setup)

### **Booth Operation:**
- 🎪 **Reliable operation** (no offline sync issues)
- ⚡ **Fast performance** (no local storage overhead)  
- 🔄 **Continuous running** (no session timeouts)
- 🎵 **High-quality audio** (AWS Polly primary)

### **User Experience:**
- 📺 **Cleaner UI** (timer only when needed)
- 🔊 **Better narration** (professional voice quality)
- ⚡ **Faster loading** (no offline cache management)
- 🎯 **Focused experience** (no unnecessary features)

---

## 🎯 **Ready for Implementation**

**All documentation updated:**
- ✅ PRD reflects simplified architecture
- ✅ Project roadmap updated with new timeline
- ✅ Technical requirements clarified
- ✅ 19 hours saved in development time

**Next Steps:**
1. **Begin Task 1**: TV-Friendly Game Interface with dynamic timer
2. **AWS Integration**: Set up Polly and Bedrock services
3. **Stateless Design**: Build components without storage dependencies
4. **Continuous Operation**: Design for booth environment

**The simplified architecture will deliver a more reliable, maintainable, and cost-effective solution! 🎯**
