# Sound Effects for GuessOps

## Required Audio Files

### timeout-buzz.mp3
- **Purpose**: Played when timer expires
- **Duration**: 2-3 seconds
- **Volume**: Medium (not too loud for booth environment)
- **Type**: Alert/buzz sound to indicate time is up
- **Format**: MP3 for broad browser support

## Audio Implementation

The game uses the Web Audio API to play sound effects:
- Timeout sound plays when timer reaches zero
- Volume is set to 70% to avoid being overwhelming
- Sound effects can be toggled on/off in settings
- Fallback gracefully if audio files are missing

## Adding Custom Sounds

1. Add MP3 files to this directory
2. Update the component imports to reference new files
3. Test on actual booth hardware for appropriate volume levels

## Browser Compatibility

- Chrome: Full support
- Firefox: Full support  
- Safari: Full support
- Edge: Full support

All modern browsers support MP3 playback through the Audio API.
