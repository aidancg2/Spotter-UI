import { Heart, MessageCircle, TrendingUp, MapPin, Flame, ThumbsUp, Zap, Send } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface WorkoutPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    streak: number;
  };
  type: 'workout' | 'pr' | 'streak' | 'checkin';
  timestamp: string;
  location?: string;
  content: string;
  workoutName?: string;
  image?: string;
  stats?: {
    exercises?: number;
    sets?: number;
    duration?: string;
  };
  prInfo?: {
    exercise: string;
    weight: string;
  };
  streakDays?: number;
  reactions: {
    heart: number;
    thumbsUp: number;
    flex: number;
    fire: number;
  };
  userReaction?: 'heart' | 'thumbsUp' | 'flex' | 'fire' | null;
  comments: number;
}

// Main feed - global posts from around the world
const mainFeedPosts: WorkoutPost[] = [
  {
    id: 'm1',
    user: { name: 'David Kim', avatar: '⚡', streak: 42 },
    type: 'workout',
    timestamp: '1h ago',
    location: 'Crunch Fitness - NYC',
    content: 'Early morning grind 💪',
    workoutName: 'Full Body',
    image: 'https://i.pinimg.com/736x/da/12/e9/da12e90c9495f9b7f695111c4b757b6b.jpg',
    reactions: { heart: 124, thumbsUp: 56, flex: 89, fire: 42 },
    userReaction: null,
    comments: 34,
  },
  {
    id: 'm2',
    user: { name: 'Jennifer Lopez', avatar: '🌟', streak: 100 },
    type: 'streak',
    timestamp: '3h ago',
    content: '100 days straight! Never giving up 🔥🔥',
    image: 'https://makeupandbeautyblog.com/wp-content/uploads/2018/04/winged-liner-k-gym-1.jpg',
    streakDays: 100,
    reactions: { heart: 256, thumbsUp: 145, flex: 78, fire: 189 },
    userReaction: 'fire',
    comments: 67,
  },
  {
    id: 'm3',
    user: { name: 'Carlos Rivera', avatar: '🏆', streak: 28 },
    type: 'pr',
    timestamp: '5h ago',
    location: 'Iron Temple Gym',
    content: 'Finally hit 500 lbs on squat! 🎯',
    workoutName: 'Leg Day',
    image: 'https://i.redd.it/ijh5z0d0ttia1.jpg',
    prInfo: { exercise: 'Squat', weight: '500 lbs' },
    reactions: { heart: 187, thumbsUp: 98, flex: 134, fire: 76 },
    userReaction: 'flex',
    comments: 45,
  },
];

// Friends feed - posts from friends only
const friendsFeedPosts: WorkoutPost[] = [
  {
    id: 'f1',
    user: { name: 'Alex Chen', avatar: '🏋️', streak: 23 },
    type: 'workout',
    timestamp: '2h ago',
    location: 'Gold\'s Gym',
    content: 'Day 23 - Chest and shoulders feeling strong today 💪',
    workoutName: 'Chest Day',
    image: 'https://images.unsplash.com/photo-1718474552749-b39aef858d6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwbWlycm9yJTIwc2VsZmllfGVufDF8fHx8MTc2OTU4OTAyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    stats: { exercises: 8, sets: 24, duration: '1h 15m' },
    reactions: { heart: 32, thumbsUp: 10, flex: 15, fire: 8 },
    userReaction: 'flex',
    comments: 12,
  },
  {
    id: 'f2',
    user: { name: 'Sarah Miller', avatar: '🏃‍♀️', streak: 50 },
    type: 'streak',
    timestamp: '4h ago',
    content: 'Hit 50 days in a row! Not stopping now 🔥',
    image: 'https://images.unsplash.com/photo-1767555257233-603bdfda72b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBydW5uaW5nJTIwb3V0ZG9vciUyMGZpdG5lc3N8ZW58MXx8fHwxNzY5NTgzNzQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    streakDays: 50,
    reactions: { heart: 45, thumbsUp: 20, flex: 12, fire: 32 },
    userReaction: 'fire',
    comments: 23,
  },
  {
    id: 'f3',
    user: { name: 'Marcus Johnson', avatar: '💪', streak: 15 },
    type: 'pr',
    timestamp: '6h ago',
    location: 'LA Fitness',
    content: 'New deadlift PR! Been working towards this for months',
    workoutName: 'Back & Deadlifts',
    image: 'https://images.unsplash.com/photo-1541600383005-565c949cf777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBkZWFkbGlmdCUyMHBvd2VybGlmdGluZyUyMGd5bXxlbnwxfHx8fDE3Njk1ODkwMzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prInfo: { exercise: 'Deadlift', weight: '405 lbs' },
    reactions: { heart: 60, thumbsUp: 35, flex: 48, fire: 25 },
    userReaction: 'heart',
    comments: 28,
  },
  {
    id: 'f4',
    user: { name: 'Emily Wong', avatar: '🎯', streak: 7 },
    type: 'checkin',
    timestamp: '8h ago',
    location: 'Equinox',
    content: 'Morning workout done ✅ Legs feeling it',
    workoutName: 'Leg Day',
    image: 'https://images.unsplash.com/photo-1609899517237-77d357b047cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGd5bSUyMGVxdWlwbWVudCUyMHdvcmtvdXR8ZW58MXx8fHwxNzY5NTg5MDMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: { exercises: 6, sets: 18, duration: '55m' },
    reactions: { heart: 28, thumbsUp: 18, flex: 10, fire: 8 },
    userReaction: null,
    comments: 8,
  },
  {
    id: 'f5',
    user: { name: 'Jake Anderson', avatar: '🔥', streak: 31 },
    type: 'workout',
    timestamp: '10h ago',
    location: 'Lifetime Fitness',
    content: 'Back and biceps day complete',
    workoutName: 'Pull Day',
    image: 'https://images.unsplash.com/photo-1711623350002-d97138f35bf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwcGVyc29uJTIwZ3ltJTIwd2VpZ2h0c3xlbnwxfHx8fDE3Njk1ODkwMjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: { exercises: 7, sets: 21, duration: '1h 5m' },
    reactions: { heart: 15, thumbsUp: 8, flex: 12, fire: 5 },
    userReaction: null,
    comments: 7,
  },
];

// Mock friend avatars for the Friends tab
const friendAvatars = ['🏋️', '🏃‍♀️', '💪'];

export function Feed() {
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<{ name: string; userName: string } | null>(null);
  const [activeFeed, setActiveFeed] = useState<'main' | 'friends'>('main');

  const currentPosts = activeFeed === 'main' ? mainFeedPosts : friendsFeedPosts;

  const getTotalReactions = (reactions: WorkoutPost['reactions']) => {
    return reactions.heart + reactions.thumbsUp + reactions.flex + reactions.fire;
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Feed Selector */}
      <div className="sticky top-[57px] z-40 bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => setActiveFeed('main')}
            className={`text-lg font-bold transition-colors ${
              activeFeed === 'main' ? 'text-white' : 'text-neutral-500'
            }`}
          >
            Main
          </button>
          <button
            onClick={() => setActiveFeed('friends')}
            className={`text-lg font-bold transition-colors ${
              activeFeed === 'friends' ? 'text-white' : 'text-neutral-500'
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-neutral-800">
        {currentPosts.map((post) => (
          <div key={post.id} className="p-4">
            {/* User Header */}
            <div className="flex items-center gap-3 mb-3">
              <button className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl hover:opacity-80 transition-opacity">
                {post.user.avatar}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <button className="font-semibold hover:text-cyan-400 transition-colors">
                    {post.user.name}
                  </button>
                  <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">
                    <Flame size={12} className="text-orange-500" />
                    <span className="text-xs font-semibold text-orange-500">{post.user.streak}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <span>{post.timestamp}</span>
                  {post.location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{post.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <p className="mb-3">
              {post.workoutName ? (
                <>
                  {post.content.split(post.workoutName)[0]}
                  <button 
                    onClick={() => setSelectedWorkout({ name: post.workoutName!, userName: post.user.name })}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    {post.workoutName}
                  </button>
                  {post.content.split(post.workoutName)[1]}
                </>
              ) : (
                post.content
              )}
            </p>

            {/* Daily Photo */}
            {post.image && (
              <div className="mb-3 rounded-lg overflow-hidden bg-neutral-800">
                <ImageWithFallback
                  src={post.image}
                  alt={`${post.user.name}'s workout`}
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            )}

            {/* Post Type Specific Content */}
            {post.type === 'pr' && post.prInfo && (
              <div className="mb-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-neutral-400">Personal Record</div>
                    <div className="text-xl font-bold">{post.prInfo.exercise}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-400">{post.prInfo.weight}</div>
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <TrendingUp size={16} />
                      <span>New PR</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {post.type === 'streak' && post.streakDays && (
              <div className="mb-3 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center justify-center gap-3">
                  <Flame size={32} className="text-orange-500" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500">{post.streakDays} Days</div>
                    <div className="text-sm text-neutral-400">Streak Milestone</div>
                  </div>
                  <Flame size={32} className="text-orange-500" />
                </div>
              </div>
            )}

            {post.type === 'workout' && post.stats && (
              <div className="mb-3 p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-neutral-400">Exercises: </span>
                    <span className="font-semibold">{post.stats.exercises}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Sets: </span>
                    <span className="font-semibold">{post.stats.sets}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Time: </span>
                    <span className="font-semibold">{post.stats.duration}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6">
              {/* Reactions */}
              <div className="relative">
                <button 
                  onClick={() => setShowReactions(showReactions === post.id ? null : post.id)}
                  className="flex items-center gap-2 group"
                >
                  {post.userReaction === 'heart' ? (
                    <Heart size={20} className="fill-red-500 text-red-500" />
                  ) : post.userReaction === 'thumbsUp' ? (
                    <ThumbsUp size={20} className="fill-blue-500 text-blue-500" />
                  ) : post.userReaction === 'flex' ? (
                    <Zap size={20} className="fill-orange-500 text-orange-500" />
                  ) : post.userReaction === 'fire' ? (
                    <Flame size={20} className="fill-orange-600 text-orange-600" />
                  ) : (
                    <Heart size={20} className="text-neutral-400 group-hover:text-red-500" />
                  )}
                  <span className={post.userReaction ? 'text-cyan-400' : 'text-neutral-400'}>
                    {getTotalReactions(post.reactions)}
                  </span>
                </button>

                {/* Reaction Picker */}
                {showReactions === post.id && (
                  <div className="absolute bottom-full mb-2 left-0 bg-neutral-800 border border-neutral-700 rounded-full p-2 flex gap-2 shadow-lg z-10">
                    <button className="hover:scale-125 transition-transform">
                      <Heart size={24} className="text-red-500" />
                    </button>
                    <button className="hover:scale-125 transition-transform">
                      <ThumbsUp size={24} className="text-blue-500" />
                    </button>
                    <button className="hover:scale-125 transition-transform">
                      <Zap size={24} className="text-orange-500" />
                    </button>
                    <button className="hover:scale-125 transition-transform">
                      <Flame size={24} className="text-orange-600" />
                    </button>
                  </div>
                )}
              </div>
              
              <button className="flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition-colors">
                <MessageCircle size={20} />
                <span>{post.comments}</span>
              </button>

              {/* Send Post Button */}
              <button className="flex items-center gap-2 text-neutral-400 hover:text-purple-400 transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workout Template Modal */}
      {selectedWorkout && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedWorkout(null)}
        >
          <div 
            className="bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-800 max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <div>
                <h2 className="text-xl font-bold">{selectedWorkout.name}</h2>
                <p className="text-sm text-neutral-400">by {selectedWorkout.userName}</p>
              </div>
              <button
                onClick={() => setSelectedWorkout(null)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Workout Details */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Workout exercises */}
              <div className="space-y-3">
                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Bench Press</span>
                    <span className="text-sm text-neutral-400">4 sets</span>
                  </div>
                  <div className="text-sm text-neutral-400">8-10 reps • 185 lbs</div>
                </div>

                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Incline Dumbbell Press</span>
                    <span className="text-sm text-neutral-400">4 sets</span>
                  </div>
                  <div className="text-sm text-neutral-400">8-12 reps • 60 lbs each</div>
                </div>

                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Cable Flyes</span>
                    <span className="text-sm text-neutral-400">3 sets</span>
                  </div>
                  <div className="text-sm text-neutral-400">12-15 reps • 30 lbs</div>
                </div>

                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Overhead Press</span>
                    <span className="text-sm text-neutral-400">4 sets</span>
                  </div>
                  <div className="text-sm text-neutral-400">8-10 reps • 95 lbs</div>
                </div>

                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Lateral Raises</span>
                    <span className="text-sm text-neutral-400">3 sets</span>
                  </div>
                  <div className="text-sm text-neutral-400">12-15 reps • 20 lbs each</div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-xl font-bold text-cyan-400">5</div>
                    <div className="text-xs text-neutral-400">Exercises</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-cyan-400">18</div>
                    <div className="text-xs text-neutral-400">Total Sets</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-cyan-400">~60min</div>
                    <div className="text-xs text-neutral-400">Duration</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Templates Button */}
            <div className="p-4 border-t border-neutral-800">
              <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold transition-colors">
                Add to My Templates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}