import { useState } from 'react';
import { Trophy, TrendingUp, Crown, Medal, Award, MapPin } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  weeklyWorkouts: number;
  streak: number;
  isCurrentUser?: boolean;
}

// Gym leaderboard (when enrolled)
const gymLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Marcus Strong', avatar: '💪', level: 32, weeklyWorkouts: 7, streak: 92 },
  { rank: 2, name: 'Lisa Chen', avatar: '🔥', level: 28, weeklyWorkouts: 6, streak: 67 },
  { rank: 3, name: 'Jake Power', avatar: '⚡', level: 26, weeklyWorkouts: 6, streak: 53 },
  { rank: 4, name: 'Sarah Fit', avatar: '💎', level: 24, weeklyWorkouts: 5, streak: 45 },
  { rank: 5, name: 'Tom Lift', avatar: '🎯', level: 22, weeklyWorkouts: 5, streak: 38 },
  { rank: 6, name: 'You', avatar: '🏋️', level: 12, weeklyWorkouts: 4, streak: 23, isCurrentUser: true },
  { rank: 7, name: 'Nina Strong', avatar: '✨', level: 18, weeklyWorkouts: 4, streak: 28 },
  { rank: 8, name: 'Chris Bulk', avatar: '⭐', level: 17, weeklyWorkouts: 3, streak: 22 },
];

const friendsLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Ryan Mitchell', avatar: '🔥', level: 15, weeklyWorkouts: 6, streak: 32 },
  { rank: 2, name: 'Emma Davis', avatar: '💫', level: 14, weeklyWorkouts: 5, streak: 28 },
  { rank: 3, name: 'Chris Brown', avatar: '⚡', level: 13, weeklyWorkouts: 5, streak: 25 },
  { rank: 4, name: 'You', avatar: '🏋️', level: 12, weeklyWorkouts: 4, streak: 23, isCurrentUser: true },
  { rank: 5, name: 'Olivia Wilson', avatar: '✨', level: 11, weeklyWorkouts: 3, streak: 18 },
  { rank: 6, name: 'Jake Taylor', avatar: '🎯', level: 10, weeklyWorkouts: 3, streak: 12 },
];

export function Leaderboard() {
  const [view, setView] = useState<'gym' | 'friends'>('gym');
  const [isEnrolled, setIsEnrolled] = useState(true); // Change to false to see enrollment prompt
  
  const leaderboard = view === 'gym' ? gymLeaderboard : friendsLeaderboard;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-neutral-800">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy size={32} className="text-yellow-500" />
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>
        <p className="text-center text-neutral-400 text-sm">
          Compete with your gym and friends
        </p>
      </div>

      {/* Toggle */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex gap-2 bg-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setView('gym')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              view === 'gym'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Gym
          </button>
          <button
            onClick={() => setView('friends')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              view === 'friends'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Show enrollment prompt if not enrolled and gym view is selected */}
      {view === 'gym' && !isEnrolled ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <MapPin size={48} className="text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Enroll in a Gym</h3>
          <p className="text-neutral-400 text-center mb-6 max-w-sm">
            Join a gym to compete on their leaderboard and connect with other members
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold transition-colors">
            Find Gyms Near Me
          </button>
        </div>
      ) : (
        <>
          {/* Current Gym Badge (only show in gym view when enrolled) */}
          {view === 'gym' && isEnrolled && (
            <div className="px-4 pt-4">
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                <MapPin size={16} className="text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Gold's Gym</span>
              </div>
            </div>
          )}

          {/* Top 3 Podium */}
          <div className="p-6 bg-gradient-to-b from-neutral-800/50 to-transparent border-b border-neutral-800">
            <div className="flex items-end justify-center gap-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <Medal size={24} className="text-neutral-400 mb-2" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-400 to-neutral-500 flex items-center justify-center text-2xl mb-2 border-4 border-neutral-700">
                  {leaderboard[1].avatar}
                </div>
                <div className="text-xs font-semibold mb-1">{leaderboard[1].name}</div>
                <div className="text-xs text-neutral-400">Lv {leaderboard[1].level}</div>
                <div className="text-xs text-cyan-400">{leaderboard[1].weeklyWorkouts} workouts</div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center -mt-4">
                <Crown size={32} className="text-yellow-500 mb-2 animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl mb-2 border-4 border-yellow-500/50">
                  {leaderboard[0].avatar}
                </div>
                <div className="text-sm font-bold mb-1">{leaderboard[0].name}</div>
                <div className="text-xs text-neutral-400">Lv {leaderboard[0].level}</div>
                <div className="text-sm text-yellow-500 font-bold">{leaderboard[0].weeklyWorkouts} workouts</div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <Award size={24} className="text-orange-600 mb-2" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-2xl mb-2 border-4 border-orange-800">
                  {leaderboard[2].avatar}
                </div>
                <div className="text-xs font-semibold mb-1">{leaderboard[2].name}</div>
                <div className="text-xs text-neutral-400">Lv {leaderboard[2].level}</div>
                <div className="text-xs text-cyan-400">{leaderboard[2].weeklyWorkouts} workouts</div>
              </div>
            </div>
          </div>

          {/* Full Leaderboard */}
          <div className="divide-y divide-neutral-800">
            {leaderboard.slice(3).map((user) => (
              <div
                key={user.rank}
                className={`p-4 flex items-center gap-4 ${
                  user.isCurrentUser ? 'bg-cyan-500/5 border-y-2 border-cyan-500/20' : ''
                }`}
              >
                {/* Rank */}
                <div className="w-8 text-center">
                  <div className={`font-bold ${user.isCurrentUser ? 'text-cyan-400' : 'text-neutral-400'}`}>
                    #{user.rank}
                  </div>
                </div>

                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  user.isCurrentUser
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
                    : 'bg-gradient-to-br from-neutral-700 to-neutral-800'
                }`}>
                  {user.avatar}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${user.isCurrentUser ? 'text-cyan-400' : ''}`}>
                      {user.name}
                    </span>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                      Lv {user.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                    <span>{user.weeklyWorkouts} workouts</span>
                    <span>•</span>
                    <span className="text-orange-500">{user.streak}🔥</span>
                  </div>
                </div>

                {/* Trend */}
                {user.isCurrentUser && (
                  <div className="flex items-center gap-1 text-green-500">
                    <TrendingUp size={16} />
                    <span className="text-xs font-semibold">+1</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stats Card */}
          <div className="p-4 m-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg">
            <div className="text-center mb-3">
              <div className="text-sm text-neutral-400 mb-1">Your Rank</div>
              <div className="text-3xl font-bold text-cyan-400">
                #{view === 'gym' ? '6' : '4'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <div className="font-bold text-cyan-400">4</div>
                <div className="text-xs text-neutral-400">This Week</div>
              </div>
              <div>
                <div className="font-bold text-orange-500">23</div>
                <div className="text-xs text-neutral-400">Day Streak</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}