# Space Invaders - Retro 8-Bit Arcade Game

A fully-featured, production-ready Space Invaders game with modern web technologies, user authentication, leaderboards, and player statistics tracking.

## Features

### Game Features
- **Classic Gameplay**: Authentic Space Invaders mechanics with player ship vs. descending alien waves
- **Retro 8-Bit Graphics**: Vibrant pixel art style with neon colors reminiscent of 1980s arcade games
- **Progressive Difficulty**: Aliens speed up with each wave for increasing challenge
- **Power-Ups System**:
  - **Multi-Shot**: Fire three bullets simultaneously
  - **Rapid Fire**: Increased shooting speed
  - **Shield**: Temporary invincibility
- **Lives System**: 3 lives with visual indicators
- **Particle Effects**: Explosive visual feedback on alien destruction
- **CRT Effect**: Authentic scanlines for retro authenticity
- **Chiptune Audio**: 8-bit sound effects for shooting, explosions, and power-ups

### User System
- **Secure Authentication**: Email/password registration and login via Supabase
- **User Profiles**: Personalized usernames and player identification
- **Session Management**: Persistent login across page refreshes

### Leaderboard
- **Global Rankings**: Top 10 high scores displayed with player names
- **Detailed Stats**: Score, wave reached, aliens defeated, and date achieved
- **Real-time Updates**: Instant leaderboard updates after each game

### Player Statistics
- **Games Played**: Total number of completed games
- **Best Score**: Personal high score tracking
- **Total Aliens Defeated**: Lifetime alien kill count
- **Waves Completed**: Total waves cleared across all games
- **Last Played**: Timestamp of most recent game session
- **Average Performance**: Calculated statistics like aliens per game

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
  - User authentication
  - Row Level Security (RLS)
  - Real-time data synchronization

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
git clone <repository-url>
cd space-invaders
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

The `.env` file should already contain your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database setup**

The database schema has been applied automatically via migration. It includes:
- `profiles` table for user data
- `high_scores` table for leaderboard
- `player_stats` table for statistics
- Row Level Security policies for data protection

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
| **Start Game** | Spacebar (when logged in) |

## Database Schema

### Tables

#### profiles
- `id` (uuid): User ID linked to auth.users
- `username` (text): Unique player display name
- `created_at` (timestamptz): Account creation date

#### high_scores
- `id` (uuid): Score entry ID
- `user_id` (uuid): References profiles.id
- `username` (text): Player name (denormalized)
- `score` (integer): Final game score
- `wave_reached` (integer): Highest wave achieved
- `aliens_defeated` (integer): Total aliens destroyed
- `achieved_at` (timestamptz): Score submission date

#### player_stats
- `user_id` (uuid): References profiles.id
- `games_played` (integer): Total games completed
- `best_score` (integer): Personal high score
- `total_aliens_defeated` (integer): Lifetime alien kills
- `total_waves_completed` (integer): Lifetime waves cleared
- `last_played` (timestamptz): Most recent game
- `updated_at` (timestamptz): Last stats update

### Security

All tables use Row Level Security (RLS):
- Users can only modify their own data
- Leaderboard is publicly readable
- Stats are private to each user

## Project Structure

```
space-invaders/
├── src/
│   ├── components/          # React components
│   │   ├── AuthModal.tsx    # Login/signup modal
│   │   ├── Leaderboard.tsx  # High scores display
│   │   └── StatsPanel.tsx   # Player statistics
│   ├── game/                # Game engine
│   │   ├── Game.ts          # Main game logic
│   │   ├── entities.ts      # Game objects (player, aliens, bullets)
│   │   ├── constants.ts     # Game configuration
│   │   └── audio.ts         # Sound effects manager
│   ├── lib/                 # Utilities and API
│   │   ├── supabase.ts      # Supabase client setup
│   │   ├── auth.ts          # Authentication functions
│   │   └── gameData.ts      # Game data API
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env                     # Environment variables
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Game Mechanics

### Scoring System
- **Top Row Aliens** (Pink): 30 points
- **Middle Row Aliens** (Cyan): 20 points
- **Bottom Row Aliens** (Yellow): 10 points

### Wave Progression
- Each cleared wave spawns a new set of aliens
- Alien speed increases by 10% per wave
- Wave number displayed in UI

### Power-Ups
- 15% chance to drop from destroyed aliens
- Duration: 10 seconds (600 frames)
- Visual timer bar shows remaining duration
- Three types with distinct colors and effects

### Lives and Game Over
- Start with 3 lives
- Lose a life when hit by alien bullets (unless shielded)
- Game over when all lives are lost
- Scores and stats automatically saved for logged-in users

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

## Security Features

- Password requirements: Minimum 6 characters
- Row Level Security on all database tables
- Input validation and sanitization
- Secure session management
- No exposed credentials in client code

## Browser Compatibility

- Modern browsers with HTML5 Canvas support
- Web Audio API support required for sound
- Responsive design for desktop and tablet
- Optimized performance with requestAnimationFrame

## Performance Optimizations

- Efficient collision detection
- Particle system with automatic cleanup
- Optimized rendering with Canvas API
- Minimal re-renders in React components
- Database queries optimized with indexes

## Troubleshooting

### Game won't start
- Ensure you're logged in (click LOGIN button)
- Check browser console for errors
- Verify Supabase connection in .env

### No sound
- Check browser audio permissions
- Click the sound toggle button (speaker icon)
- Some browsers require user interaction before playing audio

### Leaderboard not loading
- Verify Supabase connection
- Check RLS policies are properly configured
- Ensure user is authenticated

## Future Enhancements

Potential features for future versions:
- Mobile touch controls
- Additional alien types
- Boss battles
- Achievements system
- Social features (friends, challenges)
- Game replays
- Custom themes and color schemes
- Difficulty settings

## Credits

- Game Design: Based on the classic Space Invaders by Tomohiro Nishikado
- Sound Effects: Web Audio API synthesized sounds
- Graphics: Custom pixel art rendering

## License

This project is for educational and portfolio purposes.

---

Built with React, TypeScript, Vite, and Supabase
