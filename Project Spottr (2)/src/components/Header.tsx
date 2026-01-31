import { Flame, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface HeaderProps {
  onProfileClick?: () => void;
  showSearch?: boolean;
}

export function Header({ onProfileClick, showSearch = false }: HeaderProps) {
  const navigate = useNavigate();
  const [showStreakTooltip, setShowStreakTooltip] = useState(false);
  const currentStreak = 23;
  const weeklyGoal = 5;

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur border-b border-neutral-800">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold">
              S
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Spottr
            </h1>
          </div>
          
          {/* Search Bar (only on Feed page) */}
          {showSearch && (
            <div className="flex-1 relative min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          {/* Right side: Streak + Profile */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Streak */}
            <div className="relative">
              <button
                onClick={() => navigate('/streaks')}
                onMouseEnter={() => setShowStreakTooltip(true)}
                onMouseLeave={() => setShowStreakTooltip(false)}
                className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5 hover:bg-orange-500/20 hover:border-orange-500/30 transition-all cursor-pointer"
              >
                <Flame size={16} className="text-orange-500" />
                <span className="text-sm font-bold text-orange-500">{currentStreak}</span>
              </button>

              {/* Tooltip */}
              {showStreakTooltip && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-start gap-2 mb-2">
                    <Flame size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm mb-1">
                        {currentStreak} Day Streak! 🔥
                      </p>
                      <p className="text-xs text-neutral-400">
                        Keep hitting your weekly goal of {weeklyGoal} workouts to maintain your streak!
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-cyan-400 text-right mt-2">
                    Click to view details →
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <button 
              onClick={onProfileClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg">
                🏋️
              </div>
              <span className="text-sm font-semibold hidden sm:block">You</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}