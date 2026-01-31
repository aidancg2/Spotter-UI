import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Flame, Trophy, Camera, Dumbbell, Edit, Users, Target, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

// Mock data
const CURRENT_STREAK = 23;
const WEEKLY_GOAL = 5; // workouts per week
const WEEKLY_PROGRESS = 4; // workouts completed this week
const LONGEST_STREAK = 47;
const TOTAL_WORKOUTS = 156;

const ACHIEVEMENTS = [
  { 
    id: 1, 
    title: 'First Check-in', 
    description: 'Complete your first quick check-in', 
    icon: Camera, 
    unlocked: true,
    unlockedDate: '3 weeks ago'
  },
  { 
    id: 2, 
    title: '10 Day Streak', 
    description: 'Maintain a 10 day workout streak', 
    icon: Flame, 
    unlocked: true,
    unlockedDate: '1 week ago'
  },
  { 
    id: 3, 
    title: 'Social Butterfly', 
    description: 'Make 10 posts', 
    icon: Edit, 
    unlocked: true,
    unlockedDate: '2 days ago'
  },
  { 
    id: 4, 
    title: 'Workout Warrior', 
    description: 'Log 50 workouts', 
    icon: Dumbbell, 
    unlocked: true,
    unlockedDate: 'Yesterday'
  },
  { 
    id: 5, 
    title: '30 Day Legend', 
    description: 'Maintain a 30 day workout streak', 
    icon: Trophy, 
    unlocked: false,
    progress: 23,
    total: 30
  },
  { 
    id: 6, 
    title: 'Century Club', 
    description: 'Log 100 workouts', 
    icon: Target, 
    unlocked: false,
    progress: 156,
    total: 100,
    complete: true
  },
];

const GROUP_STREAKS = [
  { 
    id: 1, 
    name: 'Powerlifting Squad', 
    streak: 15, 
    members: 8,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 2, 
    name: 'Morning Grinders', 
    streak: 31, 
    members: 12,
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 3, 
    name: 'Leg Day Lovers', 
    streak: 8, 
    members: 6,
    color: 'from-cyan-500 to-blue-500'
  },
];

export function Streaks() {
  const navigate = useNavigate();
  const [leopardMood, setLeopardMood] = useState<'happy' | 'sad'>('happy');
  const [showConfetti, setShowConfetti] = useState(false);

  const streakAlive = CURRENT_STREAK > 0 && WEEKLY_PROGRESS >= 3;

  useEffect(() => {
    setLeopardMood(streakAlive ? 'happy' : 'sad');
    if (streakAlive) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [streakAlive]);

  const weeklyProgress = (WEEKLY_PROGRESS / WEEKLY_GOAL) * 100;

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#06b6d4', '#8b5cf6', '#f97316', '#ec4899'][i % 4],
                left: `${Math.random() * 100}%`,
                top: '-10px',
              }}
              animate={{
                y: [0, window.innerHeight + 100],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, 360],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-neutral-900/95 backdrop-blur border-b border-neutral-800 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Your Streaks</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Snow Leopard Mascot */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6
          }}
          className="text-center"
        >
          <motion.div
            animate={streakAlive ? {
              y: [0, -20, 0],
            } : {
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: streakAlive ? 2 : 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-9xl mb-4"
          >
            {leopardMood === 'happy' ? '🐆' : '😿'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            {streakAlive ? "You're crushing it!" : "Don't break the chain!"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-neutral-400"
          >
            {streakAlive 
              ? `Keep going! ${WEEKLY_GOAL - WEEKLY_PROGRESS} more workout${WEEKLY_GOAL - WEEKLY_PROGRESS === 1 ? '' : 's'} to reach your weekly goal.`
              : `You need ${WEEKLY_GOAL - WEEKLY_PROGRESS} more workout${WEEKLY_GOAL - WEEKLY_PROGRESS === 1 ? '' : 's'} to keep your streak alive!`
            }
          </motion.p>
        </motion.div>

        {/* Current Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/30 rounded-2xl p-6 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                  <Flame size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Current Streak</h3>
                  <p className="text-sm text-neutral-400">Keep it burning!</p>
                </div>
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl font-bold text-orange-400"
              >
                {CURRENT_STREAK}
              </motion.div>
            </div>

            {/* Weekly Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Weekly Goal Progress</span>
                <span className="font-semibold">{WEEKLY_PROGRESS}/{WEEKLY_GOAL} workouts</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${weeklyProgress}%` }}
                  transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={20} className="text-purple-400" />
              <span className="text-sm text-neutral-400">Longest Streak</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{LONGEST_STREAK}</div>
            <div className="text-xs text-neutral-500 mt-1">days</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell size={20} className="text-cyan-400" />
              <span className="text-sm text-neutral-400">Total Workouts</span>
            </div>
            <div className="text-3xl font-bold text-cyan-400">{TOTAL_WORKOUTS}</div>
            <div className="text-xs text-neutral-500 mt-1">logged</div>
          </div>
        </motion.div>

        {/* Group Streaks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-cyan-400" />
            <h3 className="font-bold">Group Streaks</h3>
          </div>
          <div className="space-y-3">
            {GROUP_STREAKS.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${group.color} rounded-full flex items-center justify-center font-bold text-2xl shadow-lg`}>
                      {group.streak}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{group.name}</h4>
                      <p className="text-sm text-neutral-400">{group.members} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame size={24} className="text-orange-400" />
                    <span className="text-xl font-bold text-orange-400">{group.streak}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={20} className="text-orange-400" />
            <h3 className="font-bold">Achievements</h3>
            <span className="ml-auto text-sm text-neutral-400">
              {ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.05 }}
                  whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/40'
                      : 'bg-neutral-900 border-neutral-800 opacity-60'
                  }`}
                >
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.05, type: "spring" }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs"
                    >
                      ✓
                    </motion.div>
                  )}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    achievement.unlocked ? 'bg-cyan-500/20' : 'bg-neutral-800'
                  }`}>
                    <Icon size={24} className={achievement.unlocked ? 'text-cyan-400' : 'text-neutral-600'} />
                  </div>
                  <h4 className={`font-semibold text-sm mb-1 ${achievement.unlocked ? '' : 'text-neutral-500'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mb-2">{achievement.description}</p>
                  {achievement.unlocked && (
                    <p className="text-xs text-cyan-400">{achievement.unlockedDate}</p>
                  )}
                  {!achievement.unlocked && achievement.progress && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                        <span>{achievement.progress}/{achievement.total}</span>
                        <span>{Math.round((achievement.progress / achievement.total) * 100)}%</span>
                      </div>
                      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}