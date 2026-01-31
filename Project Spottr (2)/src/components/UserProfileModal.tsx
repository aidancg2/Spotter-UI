import { X, MapPin, Flame, Trophy, Calendar, Dumbbell, MessageCircle, UserPlus } from 'lucide-react';

interface UserProfileModalProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio?: string;
    streak?: number;
    workoutsThisWeek?: number;
    currentGym?: string;
    totalWorkouts?: number;
    memberSince?: string;
    isFollowing?: boolean;
  };
  onClose: () => void;
  onMessage?: () => void;
}

export function UserProfileModal({ user, onClose, onMessage }: UserProfileModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Header */}
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl mb-4">
              {user.avatar}
            </div>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <div className="text-neutral-400 mb-3">@{user.username}</div>
            
            {user.bio && (
              <p className="text-neutral-300 text-sm mb-4">{user.bio}</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 w-full">
              <button
                onClick={onMessage}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Message
              </button>
              <button
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  user.isFollowing
                    ? 'bg-neutral-800 hover:bg-neutral-700'
                    : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                <UserPlus size={18} />
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
                <Flame size={20} />
                <span className="text-xl font-bold">{user.streak || 0}</span>
              </div>
              <div className="text-xs text-neutral-400">Day Streak</div>
            </div>
            
            <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
                <Dumbbell size={20} />
                <span className="text-xl font-bold">{user.workoutsThisWeek || 0}</span>
              </div>
              <div className="text-xs text-neutral-400">This Week</div>
            </div>
            
            <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                <Trophy size={20} />
                <span className="text-xl font-bold">{user.totalWorkouts || 0}</span>
              </div>
              <div className="text-xs text-neutral-400">Total</div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-3">
            {user.currentGym && (
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                <MapPin size={18} className="text-cyan-400" />
                <div>
                  <div className="text-sm text-neutral-400">Current Gym</div>
                  <div className="font-semibold">{user.currentGym}</div>
                </div>
              </div>
            )}
            
            {user.memberSince && (
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                <Calendar size={18} className="text-purple-400" />
                <div>
                  <div className="text-sm text-neutral-400">Member Since</div>
                  <div className="font-semibold">{user.memberSince}</div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Dumbbell size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Completed Push Day</div>
                    <div className="text-xs text-neutral-400">2 hours ago</div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Trophy size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">New PR: Bench Press 225 lbs</div>
                    <div className="text-xs text-neutral-400">1 day ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
