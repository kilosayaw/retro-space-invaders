# Changelog

## Wave Progression & Stats Update (Latest)

### Fixed Issues

#### 1. Stats Update After Each Wave
- **Problem**: Player statistics only updated when game ended, showing 0 while actively playing
- **Solution**: Added `onWaveComplete` callback that fires after each wave completion
- **Result**: Stats panel now updates in real-time after completing each wave, showing current progress

#### 2. Leaderboard Updates on Game Over
- **Problem**: Leaderboard wasn't showing latest scores
- **Solution**: Maintained `onGameOver` callback to submit final score to leaderboard
- **Result**: High scores are properly saved and displayed when game ends

#### 3. Power-Ups Resetting Between Waves
- **Problem**: Power-ups were inconsistently cleared between waves, even when player wasn't hit
- **Solution**: Removed `this.powerUps = []` from wave transition logic - only clear bullets and alien bullets
- **Result**: Players now retain power-ups between waves if they complete the wave without taking damage

#### 4. Continuous Rapid Fire
- **Problem**: Had to repeatedly press spacebar to shoot, even with rapid fire power-up
- **Solution**:
  - Changed shooting mechanism to check if spacebar is held down in the update loop
  - Removed one-time shoot trigger from keydown event
  - Rapid fire power-up reduces cooldown from 20 frames to 10 frames
- **Result**: Hold spacebar for continuous firing. Rapid fire power-up makes it shoot twice as fast.

### Technical Changes

**Game.ts:**
- Added `onWaveComplete` callback property
- Modified wave transition to preserve power-ups and only clear projectiles
- Changed keydown event to only track key state, not trigger shooting
- Added spacebar check in update loop for continuous shooting
- Fire `onWaveComplete` callback when wave is completed

**App.tsx:**
- Added `game.onWaveComplete` handler that updates player stats after each wave
- Maintains `game.onGameOver` handler for final score submission to leaderboard

### Gameplay Impact

**Progressive Difficulty:**
- Each wave increases alien speed by 10%
- Power-ups persist between waves (if player doesn't take damage)
- Players can build up stronger firepower as they progress

**Stats Tracking:**
- Real-time updates after each wave completion
- Accurate tracking of games played, aliens defeated, and waves completed
- Stats panel reflects current game progress

**Shooting Mechanics:**
- Hold spacebar for continuous fire
- Rapid fire power-up doubles shooting rate
- Multi-shot power-up fires 3 bullets simultaneously
- Both power-ups can work together for maximum firepower
