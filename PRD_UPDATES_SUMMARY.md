# 🔄 PRD Updates Summary - Critical Requirements

## 📋 **Key Changes Made**

### **1. 🤖 Dynamic Question Generation Only**
- **OLD**: Static questions with LLM fallback
- **NEW**: 100% AI-generated questions via AWS Bedrock
- **Impact**: Every question is fresh and unique
- **Implementation**: Remove static fallback, show "Generating Question..." animation

### **2. ⏰ Enhanced Timer Requirements**
- **NEW**: Configurable timer in settings page (15s, 30s, 45s, 60s)
- **NEW**: Prominent timer display visible from 6+ feet away
- **NEW**: "TIME'S UP!" message when timer expires
- **NEW**: Timer stops at 00:00, waits for moderator reveal
- **Impact**: Critical for booth experience and audience engagement

### **3. 📺 TV-Friendly Design Emphasis**
- **NEW**: 100% fullscreen with no browser UI
- **NEW**: Large fonts minimum 36px for poems, 48px for answers
- **NEW**: High contrast dark mode optimized for booth lighting
- **NEW**: All elements readable from 6+ feet away
- **Impact**: Core requirement for 50+ inch display usage

### **4. 🔊 Automatic Text-to-Speech**
- **NEW**: Voice starts immediately after poem loads (no manual trigger)
- **NEW**: Indian English (en-IN) accent preference
- **NEW**: Voice-over completes before or during timer countdown
- **Impact**: Moved from medium to critical priority

### **5. ✨ Loading States & Animations**
- **NEW**: "Generating Question..." with spinner animation
- **NEW**: Poem fade-in animation after AI generation
- **NEW**: Smooth transitions between game states
- **Impact**: Professional booth experience

### **6. ⚙️ Settings Page Priority**
- **NEW**: Essential for timer configuration
- **NEW**: Must include timer duration presets
- **NEW**: Language and difficulty defaults
- **Impact**: Moved from medium to critical (needed for timer)

---

## 🎯 **Updated Task Priorities**

### **🔴 CRITICAL (Week 1 MVP)**
1. **TV-Friendly Game Interface** (20h) - 100% fullscreen, large fonts
2. **Moderator Control Panel** (12h) - Game controls and state management
3. **Game State Management** (10h) - Flow between screens
4. **Dynamic Question Generation** (10h) - AI-only with loading animations
5. **Enhanced Timer System** (12h) - Configurable, prominent display
6. **Automatic Text-to-Speech** (8h) - Immediate voice-over
8. **Settings Configuration Page** (8h) - Timer and game settings

### **🟡 MEDIUM (Week 2 Polish)**
7. **Fuzzy Answer Matching** (8h) - Guess feedback system
9. **Visual Animations** (6h) - Polish and effects
10. **Large Display Optimization** (4h) - 50+ inch screen testing

---

## 📊 **Development Impact**

### **Timeline Changes**
- **Week 1**: Increased from 46h to 80h (more comprehensive MVP)
- **Focus**: All critical booth experience features in Week 1
- **Total**: 107-124 hours (vs previous 93-110 hours)

### **Priority Shifts**
- **Text-to-Speech**: Medium → Critical (automatic requirement)
- **Settings Page**: Medium → Critical (needed for timer)
- **Timer System**: Enhanced with prominent display requirements
- **Question Generation**: No more static fallback, AI-only

### **New Requirements**
- Loading animations for question generation
- Timer configuration in settings
- Automatic voice-over (no manual trigger)
- 100% fullscreen TV optimization
- "TIME'S UP!" prominent message display

---

## ✅ **Updated Acceptance Criteria**

### **Game Flow Requirements**
1. ✅ Moderator clicks "Next" → "Generating Question..." animation shows
2. ✅ AI generates fresh poem via Bedrock (no static questions)
3. ✅ Poem appears with fade-in animation
4. ✅ Voice-over starts immediately in Indian English accent
5. ✅ Configurable timer starts countdown (15s-60s from settings)
6. ✅ Timer expires → "TIME'S UP!" message displays prominently
7. ✅ Moderator clicks "Reveal" → Answer shows with animation

### **Display Requirements**
1. ✅ 100% fullscreen with no browser UI visible
2. ✅ Large fonts (≥36px poems, 48px answers)
3. ✅ High contrast dark theme
4. ✅ Readable from 6+ feet away on 50+ inch displays
5. ✅ Timer prominently visible to audience
6. ✅ Loading states provide smooth user experience

### **Settings Requirements**
1. ✅ Timer duration configuration (15s, 30s, 45s, 60s presets)
2. ✅ Language and difficulty defaults
3. ✅ LLM provider selection
4. ✅ Settings persist across sessions
5. ✅ Changes take effect immediately

---

## 🚀 **Next Actions**

### **Immediate Priority**
1. **Start Task 1**: Begin TV-friendly game interface development
2. **Set up component structure**: Create game screen layouts
3. **Implement loading states**: Question generation animations
4. **Test on large displays**: Verify readability and contrast

### **Week 1 Goals**
- Functional game playable on TV display
- All critical features implemented
- Timer system working with settings integration
- Automatic text-to-speech operational
- Professional loading animations

**Ready to begin implementation with updated requirements! 🎯**
