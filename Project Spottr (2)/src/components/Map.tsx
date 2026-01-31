import { useState } from 'react';
import { MapPin, TrendingUp, Users, Clock, ArrowLeft, Send, X, Edit } from 'lucide-react';
import { BusyLevelModal } from './BusyLevelModal';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Gym {
  id: string;
  name: string;
  address: string;
  distance: string;
  currentActivity: number;
  maxCapacity: number;
  busyLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  activityBreakdown: {
    arms: number;
    legs: number;
    cardio: number;
    workoutClass: number;
    other: number;
  };
  topLifters: Array<{
    name: string;
    avatar: string;
    squat: number;
    bench: number;
    deadlift: number;
  }>;
}

interface WorkoutInvite {
  id: string;
  user: string;
  avatar: string;
  type: string;
  spots: number;
  time: string;
}

const gyms: Gym[] = [
  {
    id: '1',
    name: 'Lifetime Fitness',
    address: '123 Main St',
    distance: '0.5 mi',
    currentActivity: 47,
    maxCapacity: 150,
    busyLevel: 'Moderate',
    activityBreakdown: {
      arms: 30,
      legs: 25,
      cardio: 20,
      workoutClass: 15,
      other: 10,
    },
    topLifters: [
      { name: 'Tyler Chen', avatar: '👑', squat: 495, bench: 365, deadlift: 545 },
      { name: 'Sarah Kim', avatar: '💎', squat: 405, bench: 225, deadlift: 475 },
      { name: 'Mike Torres', avatar: '🔥', squat: 385, bench: 315, deadlift: 455 },
      { name: 'Emma Wilson', avatar: '✨', squat: 315, bench: 205, deadlift: 405 },
      { name: 'Chris Anderson', avatar: '⚡', squat: 365, bench: 295, deadlift: 425 },
    ],
  },
  {
    id: '2',
    name: 'Gold\'s Gym',
    address: '456 Oak Ave',
    distance: '1.2 mi',
    currentActivity: 89,
    maxCapacity: 120,
    busyLevel: 'High',
    activityBreakdown: {
      arms: 35,
      legs: 20,
      cardio: 25,
      workoutClass: 10,
      other: 10,
    },
    topLifters: [
      { name: 'Jessica Park', avatar: '⚡', squat: 455, bench: 295, deadlift: 500 },
      { name: 'David Wu', avatar: '🎯', squat: 385, bench: 275, deadlift: 465 },
      { name: 'Emma Stone', avatar: '✨', squat: 295, bench: 225, deadlift: 385 },
      { name: 'Ryan Lee', avatar: '🔥', squat: 425, bench: 315, deadlift: 485 },
      { name: 'Sophia Martinez', avatar: '💎', squat: 335, bench: 245, deadlift: 415 },
    ],
  },
  {
    id: '3',
    name: 'LA Fitness',
    address: '789 Pine Rd',
    distance: '2.1 mi',
    currentActivity: 23,
    maxCapacity: 100,
    busyLevel: 'Low',
    activityBreakdown: {
      arms: 25,
      legs: 30,
      cardio: 25,
      workoutClass: 10,
      other: 10,
    },
    topLifters: [
      { name: 'Chris Lee', avatar: '⭐', squat: 405, bench: 285, deadlift: 475 },
      { name: 'Nina Garcia', avatar: '🌟', squat: 315, bench: 205, deadlift: 385 },
      { name: 'Alex Johnson', avatar: '💪', squat: 365, bench: 275, deadlift: 425 },
      { name: 'Mia Thompson', avatar: '✨', squat: 285, bench: 195, deadlift: 365 },
      { name: 'Jake Wilson', avatar: '🔥', squat: 395, bench: 295, deadlift: 455 },
    ],
  },
  {
    id: '4',
    name: 'Equinox',
    address: '321 Elm St',
    distance: '3.5 mi',
    currentActivity: 102,
    maxCapacity: 130,
    busyLevel: 'Very High',
    activityBreakdown: {
      arms: 30,
      legs: 25,
      cardio: 20,
      workoutClass: 15,
      other: 10,
    },
    topLifters: [
      { name: 'Ryan Mitchell', avatar: '🔥', squat: 475, bench: 335, deadlift: 520 },
      { name: 'Olivia Wilson', avatar: '✨', squat: 365, bench: 235, deadlift: 445 },
      { name: 'Jake Taylor', avatar: '🎯', squat: 405, bench: 295, deadlift: 485 },
      { name: 'Isabella Brown', avatar: '💎', squat: 325, bench: 215, deadlift: 405 },
      { name: 'Ethan Davis', avatar: '⚡', squat: 445, bench: 315, deadlift: 505 },
    ],
  },
];

const mockInvites: WorkoutInvite[] = [
  { id: '1', user: 'John Martinez', avatar: '💪', type: 'Basketball', spots: 4, time: '6:00 PM' },
  { id: '2', user: 'Amy Chen', avatar: '🏋️‍♀️', type: 'Leg Day', spots: 2, time: '5:30 PM' },
  { id: '3', user: 'Marcus Davis', avatar: '🔥', type: 'Back & Biceps', spots: 1, time: '7:00 PM' },
];

export function Map() {
  const [enrolledGym, setEnrolledGym] = useState<Gym | null>(gyms[0]); // User enrolled in Lifetime
  const [showMap, setShowMap] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<WorkoutInvite | null>(null);
  const [liftFilter, setLiftFilter] = useState<'squat' | 'bench' | 'deadlift' | 'total'>('deadlift');
  const [showBusyLevelModal, setShowBusyLevelModal] = useState(false);

  const handleBusyLevelUpdate = (level: string) => {
    // In a real app, this would update the busy level in a database
    console.log('Busy level updated:', level);
  };

  const getBusyColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400';
      case 'Moderate': return 'text-yellow-400';
      case 'High': return 'text-orange-400';
      case 'Very High': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const getBusyBg = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-500/10 border-green-500/20';
      case 'Moderate': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'High': return 'bg-orange-500/10 border-orange-500/20';
      case 'Very High': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-neutral-800 border-neutral-700';
    }
  };

  const handleEnroll = (gym: Gym) => {
    setEnrolledGym(gym);
    setShowMap(false);
  };

  const createInvite = () => {
    setShowInviteModal(true);
  };

  const submitInvite = () => {
    alert('Workout invite posted! Other members will be notified.');
    setShowInviteModal(false);
  };

  const handleJoinClick = (invite: WorkoutInvite) => {
    setSelectedInvite(invite);
    setShowJoinModal(true);
  };

  const sendJoinRequest = () => {
    alert(`Request sent to ${selectedInvite?.user}! They'll be notified.`);
    setShowJoinModal(false);
    setSelectedInvite(null);
  };

  // Get sorted lifters based on filter
  const getSortedLifters = () => {
    if (!enrolledGym) return [];
    
    return [...enrolledGym.topLifters].sort((a, b) => {
      if (liftFilter === 'total') {
        const totalA = a.squat + a.bench + a.deadlift;
        const totalB = b.squat + b.bench + b.deadlift;
        return totalB - totalA;
      }
      return b[liftFilter] - a[liftFilter];
    });
  };

  // Get label for current filter
  const getFilterLabel = () => {
    switch (liftFilter) {
      case 'squat': return 'Squat';
      case 'bench': return 'Bench Press';
      case 'deadlift': return 'Deadlift';
      case 'total': return 'Total';
    }
  };

  // Get value for current filter
  const getFilterValue = (lifter: typeof enrolledGym.topLifters[0]) => {
    if (liftFilter === 'total') {
      return lifter.squat + lifter.bench + lifter.deadlift;
    }
    return lifter[liftFilter];
  };

  if (showMap) {
    return (
      <div className="max-w-lg mx-auto">
        {/* Map Header */}
        <div className="sticky top-16 z-40 bg-neutral-900 border-b border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMap(false)}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">Nearby Gyms</h2>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-64 bg-neutral-800 border-b border-neutral-700 flex items-center justify-center relative">
          <MapPin size={48} className="text-cyan-400" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950/50" />
        </div>

        {/* Gym List */}
        <div className="p-4 space-y-3">
          {gyms.map((gym) => (
            <div key={gym.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{gym.name}</h3>
                  <p className="text-sm text-neutral-400">{gym.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={14} className="text-cyan-400" />
                    <span className="text-sm text-cyan-400">{gym.distance} away</span>
                  </div>
                </div>
                {enrolledGym?.id === gym.id ? (
                  <div className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs font-semibold text-cyan-400">
                    Enrolled
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnroll(gym)}
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Enroll
                  </button>
                )}
              </div>

              {/* Activity Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 border rounded-lg ${getBusyBg(gym.busyLevel)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={14} />
                    <span className="text-xs text-neutral-400">Activity</span>
                  </div>
                  <div className="font-bold">{gym.currentActivity}/{gym.maxCapacity}</div>
                  <div className={`text-xs ${getBusyColor(gym.busyLevel)}`}>{gym.busyLevel}</div>
                </div>
                
                <div className="p-3 bg-neutral-700/50 border border-neutral-600 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-xs text-neutral-400">Top PR</span>
                  </div>
                  <div className="font-bold text-sm">{gym.topLifters[0].deadlift} lbs</div>
                  <div className="text-xs text-neutral-400">Deadlift</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!enrolledGym) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <MapPin size={64} className="mx-auto mb-4 text-neutral-600" />
        <h2 className="text-xl font-bold mb-2">Find Your Gym</h2>
        <p className="text-neutral-400 mb-6">Enroll in a gym to track activity and connect with members</p>
        <button
          onClick={() => setShowMap(true)}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
        >
          Browse Nearby Gyms
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Gym Header */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-b border-neutral-800 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{enrolledGym.name}</h2>
            <p className="text-sm text-neutral-400">{enrolledGym.address}</p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={14} className="text-cyan-400" />
              <span className="text-sm text-cyan-400">{enrolledGym.distance} away</span>
            </div>
          </div>
          <button
            onClick={() => setShowMap(true)}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg text-sm font-semibold transition-colors"
          >
            View Map
          </button>
        </div>

        {/* Real-time Activity */}
        <div className={`p-4 border rounded-lg ${getBusyBg(enrolledGym.busyLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${getBusyColor(enrolledGym.busyLevel)} animate-pulse`} />
                <span className="text-sm text-neutral-400">Live Activity</span>
              </div>
              <div className="text-2xl font-bold mb-1">
                {enrolledGym.currentActivity} people there
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className={`text-lg font-bold ${getBusyColor(enrolledGym.busyLevel)}`}>
                  {enrolledGym.busyLevel}
                </div>
                <div className="text-xs text-neutral-400">Busy Level</div>
              </div>
              <button
                onClick={() => setShowBusyLevelModal(true)}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors"
                title="Update busy level"
              >
                <Edit size={18} />
              </button>
            </div>
          </div>
          
          {/* Activity Breakdown Bar */}
          <Tooltip.Provider delayDuration={0}>
            <div className="h-3 bg-neutral-800 rounded-full overflow-hidden flex">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    className="h-full bg-cyan-500 hover:brightness-110 transition-all cursor-pointer"
                    style={{ width: `${enrolledGym.activityBreakdown.arms}%` }}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm shadow-lg"
                    sideOffset={5}
                  >
                    <div className="font-semibold">Arms</div>
                    <div className="text-cyan-400">{enrolledGym.activityBreakdown.arms}% of people</div>
                    <Tooltip.Arrow className="fill-neutral-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    className="h-full bg-purple-500 hover:brightness-110 transition-all cursor-pointer"
                    style={{ width: `${enrolledGym.activityBreakdown.legs}%` }}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm shadow-lg"
                    sideOffset={5}
                  >
                    <div className="font-semibold">Legs</div>
                    <div className="text-purple-400">{enrolledGym.activityBreakdown.legs}% of people</div>
                    <Tooltip.Arrow className="fill-neutral-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    className="h-full bg-orange-500 hover:brightness-110 transition-all cursor-pointer"
                    style={{ width: `${enrolledGym.activityBreakdown.cardio}%` }}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm shadow-lg"
                    sideOffset={5}
                  >
                    <div className="font-semibold">Cardio</div>
                    <div className="text-orange-400">{enrolledGym.activityBreakdown.cardio}% of people</div>
                    <Tooltip.Arrow className="fill-neutral-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    className="h-full bg-green-500 hover:brightness-110 transition-all cursor-pointer"
                    style={{ width: `${enrolledGym.activityBreakdown.workoutClass}%` }}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm shadow-lg"
                    sideOffset={5}
                  >
                    <div className="font-semibold">Workout Class</div>
                    <div className="text-green-400">{enrolledGym.activityBreakdown.workoutClass}% of people</div>
                    <Tooltip.Arrow className="fill-neutral-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    className="h-full bg-neutral-600 hover:brightness-110 transition-all cursor-pointer"
                    style={{ width: `${enrolledGym.activityBreakdown.other}%` }}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm shadow-lg"
                    sideOffset={5}
                  >
                    <div className="font-semibold">Other</div>
                    <div className="text-neutral-400">{enrolledGym.activityBreakdown.other}% of people</div>
                    <Tooltip.Arrow className="fill-neutral-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </div>
          </Tooltip.Provider>
        </div>
      </div>

      {/* Workout Invites */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Workout Buddies</h3>
          <button
            onClick={createInvite}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm font-semibold transition-colors"
          >
            Post Invite
          </button>
        </div>

        <div className="space-y-2">
          {mockInvites.map((invite) => (
            <div key={invite.id} className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg">
                  {invite.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {invite.user} is looking for {invite.spots} {invite.spots === 1 ? 'person' : 'people'}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {invite.type} • Today at {invite.time}
                  </div>
                </div>
                <button
                  onClick={() => handleJoinClick(invite)}
                  className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gym Leaderboard */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Top Lifters at {enrolledGym.name}</h3>
          
          {/* Filter Dropdown */}
          <select
            value={liftFilter}
            onChange={(e) => setLiftFilter(e.target.value as 'squat' | 'bench' | 'deadlift' | 'total')}
            className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm font-semibold text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <option value="squat">Squat</option>
            <option value="bench">Bench</option>
            <option value="deadlift">Deadlift</option>
            <option value="total">Total</option>
          </select>
        </div>
        
        <div className="space-y-2">{getSortedLifters().map((lifter, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-lg">
            <div className="w-8 text-center font-bold text-neutral-400">
              #{idx + 1}
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg">
              {lifter.avatar}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{lifter.name}</div>
              <div className="text-xs text-neutral-400">{getFilterLabel()}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-400">{getFilterValue(lifter)} lbs</div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Create Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Post Workout Invite</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Workout Type</label>
                <input
                  type="text"
                  placeholder="e.g., Chest & Triceps"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Looking for</label>
                <select className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg">
                  <option>1 person</option>
                  <option>2 people</option>
                  <option>3+ people</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Time</label>
                <input
                  type="time"
                  defaultValue="18:00"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg"
                />
              </div>

              <button
                onClick={submitInvite}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Post Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Invite Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Join Workout Request</h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Message (Optional)</label>
                <textarea
                  placeholder="Add a note to your request..."
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              <button
                onClick={sendJoinRequest}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Busy Level Modal */}
      <BusyLevelModal
        isOpen={showBusyLevelModal}
        onClose={() => setShowBusyLevelModal(false)}
        onSubmit={handleBusyLevelUpdate}
        gymName={enrolledGym?.name}
      />
    </div>
  );
}