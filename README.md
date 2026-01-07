# Space Invaders - Retro 8-Bit Arcade Game

A fully-featured, arcade-style Space Invaders game with modern web technologies, anonymous gameplay, and global leaderboards.

## Features

### Game Features
- **Classic Gameplay**: Authentic Space Invaders mechanics with player ship vs. descending alien waves
- **Retro 8-Bit Graphics**: Vibrant pixel art style with neon colors reminiscent of 1980s arcade games
- **Progressive Difficulty**: Aliens speed up AND shoot more frequently with each wave for extreme challenge
- **Destructible Bases**: 4 protective bases that take permanent damage across all waves
- **Bullet-on-Bullet Combat**: Shoot enemy bullets to defend yourself - adds strategic depth
- **Power-Ups System**:
  - **Multi-Shot**: Fire three bullets simultaneously
  - **Rapid Fire**: Increased shooting speed
  - **Shield**: Temporary invincibility
  - **Must earn them**: Requires defeating 15+ aliens, only 5% drop chance
- **Lives System**: 3 lives with visual indicators
- **Particle Effects**: Explosive visual feedback on alien destruction
- **CRT Effect**: Authentic scanlines for retro authenticity
- **Chiptune Audio**: 8-bit sound effects for shooting, explosions, and power-ups
- **Arcade-Style Name Entry**: Enter your initials after game over, just like the classic arcades

### Leaderboard
- **No Login Required**: Play instantly, enter name after game over
- **Global Rankings**: Top 10 high scores displayed with player names
- **Detailed Stats**: Score, wave reached, aliens defeated, and date achieved
- **Real-time Updates**: Instant leaderboard updates after each game

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive styling
- **HTML5 Canvas** for game rendering
- **Web Audio API** for sound effects

### Backend & Database
- **Supabase** for:
  - PostgreSQL database
  - Anonymous score submission
  - Row Level Security (RLS)
  - Real-time leaderboard

### Libraries
- **@supabase/supabase-js**: Supabase client library
- **lucide-react**: Icon components
- **TypeScript**: Type-safe development

## Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/kilosayaw/retro-space-invaders.git
cd retro-space-invaders
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Add your Supabase credentials to Netlify (or create `.env` locally):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database setup**

Run this SQL in your Supabase SQL Editor:

```sql
-- Create high_scores table
CREATE TABLE high_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  wave_reached INTEGER NOT NULL,
  aliens_defeated INTEGER NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_high_scores_score ON high_scores(score DESC);

-- Enable RLS
ALTER TABLE high_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert
CREATE POLICY "Anyone can insert high scores"
  ON high_scores FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view
CREATE POLICY "Anyone can view high scores"
  ON high_scores FOR SELECT
  USING (true);
```

5. **Run the development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
```

7. **Preview production build**
```bash
npm run preview
```

## Game Controls

| Action | Keys |
|--------|------|
| **Move Left** | Left Arrow or A |
| **Move Right** | Right Arrow or D |
| **Shoot** | Spacebar |
| **Pause** | P |
| **Start Game** | Spacebar |
| **Skip Name Entry** | ESC |

## Database Schema

### Tables

#### high_scores
- `id` (uuid): Score entry ID
- `user_id` (uuid): Optional - for future auth support
- `username` (text): Player name (entered after game over)
- `score` (integer): Final game score
- `wave_reached` (integer): Highest wave achieved
- `aliens_defeated` (integer): Total aliens destroyed
- `achieved_at` (timestamptz): Score submission date

### Security

Row Level Security (RLS) policies:
- Anyone can insert high scores (anonymous gameplay)
- Leaderboard is publicly readable
- No authentication required

## Project Structure

```
space-invaders/
├── src/
│   ├── components/          # React components
│   │   ├── NameEntryModal.tsx  # Arcade-style name entry
│   │   └── Leaderboard.tsx     # High scores display
│   ├── game/                # Game engine
│   │   ├── Game.ts          # Main game logic
│   │   ├── entities.ts      # Game objects (player, aliens, bullets, bases)
│   │   ├── constants.ts     # Game configuration
│   │   └── audio.ts         # Sound effects manager
│   ├── lib/                 # Utilities and API
│   │   ├── supabase.ts      # Supabase client setup
│   │   └── gameData.ts      # Score submission API
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── supabase/migrations/     # Database migrations
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Game Mechanics

### Scoring System
- **Top Row Aliens** (Pink): 30 points
- **Middle Row Aliens** (Cyan): 20 points
- **Bottom Row Aliens** (Yellow): 10 points

### Progressive Difficulty (NEW!)

The game gets significantly harder with each wave:

| Wave | Alien Speed | Shoot Frequency | Power-Up Availability |
|------|-------------|-----------------|----------------------|
| 1    | 0.50        | 0.0003          | After 15 kills (5%) |
| 5    | 1.10        | 0.0011          | After 15 kills (5%) |
| 10   | 1.85        | 0.0021          | After 15 kills (5%) |
| 15   | 2.60        | 0.0031          | After 15 kills (5%) |
| 20+  | 3.35+       | 0.0041+         | After 15 kills (5%) |

### Destructible Bases (NEW!)
- **4 bases** positioned in front of the player
- **Permanent damage**: Bases DO NOT regenerate between waves
- **Strategic element**: Protect bases as they're your only defense
- Classic dome-shaped design with pixel-by-pixel destruction
- Both player and alien bullets damage bases

### Bullet Combat (NEW!)
- **Shoot enemy bullets**: Your bullets can destroy incoming alien fire
- Adds defensive gameplay layer
- Creates mini particle effects on collision
- Requires quick reflexes and aim

### Power-Ups (HARDER TO EARN!)
- **5% drop chance** (reduced from 15%)
- **Requires 15+ alien kills** before any power-up can drop
- Duration: 10 seconds (600 frames)
- Visual timer bar shows remaining duration
- Three types: Multi-Shot, Rapid Fire, Shield

### Lives and Game Over
- Start with 3 lives
- **Precise hitbox**: 4-pixel margin for fairer gameplay
- Lose a life when hit by alien bullets (unless shielded)
- Bases can block bullets
- Game over when all lives are lost
- Enter name for leaderboard

### Wave Progression
- Each cleared wave spawns a new set of aliens
- **Alien speed increases** by 0.15 per wave (50% faster escalation)
- **Shooting frequency increases** by 0.0002 per wave
- **Bases persist** with all damage from previous waves
- Wave number displayed in UI

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript type checking

### Code Quality

The project follows best practices:
- TypeScript for type safety
- ESLint for code quality
- Modular architecture with separation of concerns
- Clean code with clear naming conventions

## Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Add environment variables in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Automatic deployments on every push

### Deploy to Vercel

1. Import GitHub repository to Vercel
2. Add environment variables
3. Deploy (auto-detects Vite settings)

## Browser Compatibility

- Modern browsers with HTML5 Canvas support
- Web Audio API support required for sound
- Responsive design for desktop and tablet
- Optimized performance with requestAnimationFrame

## Performance Optimizations

- Efficient collision detection with precise hitboxes
- Particle system with automatic cleanup
- Optimized rendering with Canvas API
- Minimal re-renders in React components
- Database queries optimized with indexes

## Troubleshooting

### Game won't start
- Check browser console for errors
- Verify Supabase connection
- Make sure environment variables are set in Netlify

### Failed to save score
- Verify Supabase database table exists
- Check RLS policies are properly configured
- Ensure environment variables are correct

### No sound
- Check browser audio permissions
- Click the sound toggle button (speaker icon)
- Some browsers require user interaction before playing audio

### Leaderboard not loading
- Verify Supabase connection
- Check RLS policies allow public SELECT
- Look for errors in browser console

## Gameplay Strategy Tips

### Surviving Higher Waves
1. **Protect your bases** - they don't regenerate!
2. **Shoot enemy bullets** - use this defensively
3. **Earn power-ups wisely** - they're rare, make them count
4. **Stay mobile** - aliens get MUCH faster
5. **Manage base damage** - position yourself where bases are strongest

### High Score Tips
- Kill top-row aliens first (30 points vs 10)
- Use bases strategically - they're temporary shields
- Save power-ups for difficult waves
- Practice bullet-on-bullet defense
- Survive to wave 10+ for major points

## Credits

- **Game Design**: Based on the classic Space Invaders by Tomohiro Nishikado
- **Sound Effects**: Web Audio API synthesized sounds
- **Graphics**: Custom pixel art rendering
- **Gameplay Enhancements**: Modern difficulty curve and strategic elements

## License

This project is for educational and portfolio purposes.

---

**Built with React, TypeScript, Vite, and Supabase**

**Play now**: [80sspaceinvaders.netlify.app](https://80sspaceinvaders.netlify.app)
