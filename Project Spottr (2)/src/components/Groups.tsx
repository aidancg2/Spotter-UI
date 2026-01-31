import { Search, Plus, MessageCircle, Users, Send, Zap, Check, X, ChevronDown, ChevronUp, Flame } from 'lucide-react';
import { useState } from 'react';
import { Chat } from './Chat';
import { UserProfileModal } from './UserProfileModal';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'working-out';
  currentActivity?: string;
  gym?: string;
  lastActive?: string;
  workedOutToday?: boolean;
  streak?: number;
  workoutsThisWeek?: number;
  totalWorkouts?: number;
  memberSince?: string;
  bio?: string;
}

interface Group {
  id: string;
  name: string;
  avatar: string;
  members: number;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  streak?: number;
}

const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Jalen Chan',
    username: 'jalenchan2',
    avatar: '🏋️',
    status: 'working-out',
    currentActivity: 'Chest Day',
    gym: "Gold's Gym",
    workedOutToday: true,
    streak: 5,
    workoutsThisWeek: 3,
    totalWorkouts: 20,
    memberSince: '2023-01-15',
    bio: 'Fitness enthusiast and powerlifter. Always looking for a workout buddy!',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    username: 'sarahmiller',
    avatar: '🏃‍♀️',
    status: 'online',
    lastActive: '5m ago',
    workedOutToday: false,
    streak: 3,
    workoutsThisWeek: 2,
    totalWorkouts: 15,
    memberSince: '2023-02-20',
    bio: 'Cardio queen and marathon runner. Love to push my limits!',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    username: 'marcusjohnson',
    avatar: '💪',
    status: 'working-out',
    currentActivity: 'Leg Day',
    gym: 'LA Fitness',
    workedOutToday: true,
    streak: 7,
    workoutsThisWeek: 4,
    totalWorkouts: 25,
    memberSince: '2023-03-10',
    bio: 'Strength trainer and bodybuilder. Passionate about lifting heavy!',
  },
  {
    id: '4',
    name: 'Emily Wong',
    username: 'emilywong',
    avatar: '🎯',
    status: 'offline',
    lastActive: '2h ago',
    workedOutToday: false,
    streak: 2,
    workoutsThisWeek: 1,
    totalWorkouts: 10,
    memberSince: '2023-04-05',
    bio: 'Crossfit athlete and fitness coach. Always ready to challenge myself!',
  },
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Morning Crew',
    avatar: '☀️',
    members: 8,
    lastMessage: 'Who\'s hitting the gym tomorrow at 6am?',
    timestamp: '15m ago',
    unread: 3,
    streak: 12,
  },
  {
    id: '2',
    name: 'Fiji Fit',
    avatar: '🦵',
    members: 5,
    lastMessage: 'New squat PR! 315 lbs',
    timestamp: '1h ago',
    streak: 7,
  },
  {
    id: '3',
    name: 'Gold\'s Gym Regulars',
    avatar: '🏋️',
    members: 12,
    lastMessage: 'Anyone free for a workout buddy session?',
    timestamp: '3h ago',
    unread: 1,
    streak: 23,
  },
];

interface WorkoutInvitation {
  id: string;
  user: string;
  avatar: string;
  bio: string;
  mutualConnections: string;
  timestamp: string;
  message: string;
  workoutType: string;
  time: string;
  gym: string;
}

const mockInvitations: WorkoutInvitation[] = [
  {
    id: '1',
    user: 'John Martinez',
    avatar: '💪',
    bio: 'Powerlifter training for state competition',
    mutualConnections: 'Alex Chen and 12 other mutual connections',
    timestamp: '2 hours ago',
    message: 'Hey! Looking for a workout buddy for basketball tonight. Interested?',
    workoutType: 'Basketball',
    time: '6:00 PM',
    gym: 'Lifetime Fitness',
  },
  {
    id: '2',
    user: 'Amy Chen',
    avatar: '🏋️‍♀️',
    bio: 'Fitness coach & nutrition enthusiast',
    mutualConnections: 'Sarah Miller and 8 other mutual connections',
    timestamp: '1 day ago',
    message: 'Would love to have a spotter for leg day. Let me know if you\'re available!',
    workoutType: 'Leg Day',
    time: '5:30 PM',
    gym: 'Gold\'s Gym',
  },
];

export function Groups() {
  const [searchTerm, setSearchTerm] = useState('');
  const [invitations, setInvitations] = useState(mockInvitations);
  const [isInvitationsMinimized, setIsInvitationsMinimized] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupModalTab, setGroupModalTab] = useState<'create' | 'join'>('create');
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  
  // Chat and profile states
  const [activeChat, setActiveChat] = useState<{
    id: string;
    name: string;
    avatar: string;
    isGroup: boolean;
    members?: number;
    streak?: number;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<Friend | null>(null);
  const [showZapModal, setShowZapModal] = useState(false);
  const [zapTarget, setZapTarget] = useState<Friend | null>(null);

  const openChat = (chatId: string, chatName: string, chatAvatar: string, isGroup: boolean, members?: number, streak?: number) => {
    setActiveChat({ id: chatId, name: chatName, avatar: chatAvatar, isGroup, members, streak });
  };

  const openUserProfile = (friend: Friend) => {
    setSelectedUser(friend);
  };

  const handleZapUser = (friend: Friend) => {
    if (!friend.workedOutToday) {
      setZapTarget(friend);
      setShowZapModal(true);
    } else {
      alert(`${friend.name} has already worked out today! 💪`);
    }
  };

  const sendZap = () => {
    if (zapTarget) {
      alert(`⚡ Nudge sent to ${zapTarget.name}! They'll get a notification to hit the gym.`);
      setShowZapModal(false);
      setZapTarget(null);
    }
  };

  // If chat is active, show chat component
  if (activeChat) {
    return (
      <Chat
        chatId={activeChat.id}
        chatName={activeChat.name}
        chatAvatar={activeChat.avatar}
        isGroup={activeChat.isGroup}
        members={activeChat.members}
        streak={activeChat.streak}
        onBack={() => setActiveChat(null)}
        onProfileClick={() => {
          if (!activeChat.isGroup) {
            const friend = mockFriends.find(f => f.name === activeChat.name);
            if (friend) {
              openUserProfile(friend);
            }
          }
        }}
      />
    );
  }

  const handleAccept = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
    alert('Workout invitation accepted! You can now message them.');
  };

  const handleIgnore = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
  };

  const submitInvite = () => {
    alert('Workout invite posted! Your friends will be notified.');
    setShowInviteModal(false);
  };

  const generateGroupCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    return code;
  };

  const createGroup = () => {
    alert(`Group created successfully! Your group code is: ${generatedCode}`);
    setShowGroupModal(false);
    setSelectedMembers([]);
    setGeneratedCode('');
  };

  const joinGroup = () => {
    alert('Successfully joined the group!');
    setShowGroupModal(false);
  };

  const toggleMemberSelection = (friendId: string) => {
    if (selectedMembers.includes(friendId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== friendId));
    } else {
      setSelectedMembers([...selectedMembers, friendId]);
    }
  };

  const openGroupModal = () => {
    const code = generateGroupCode();
    setGeneratedCode(code);
    setShowGroupModal(true);
  };

  return (
    <div className="max-w-lg mx-auto pb-4">
      {/* Search Bar */}
      <div className="sticky top-[57px] z-40 bg-neutral-950 px-4 pt-4 pb-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search chats"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Pending Invitations Section */}
      {invitations.length > 0 && (
        <div className="px-4 mb-6">
          <button
            onClick={() => setIsInvitationsMinimized(!isInvitationsMinimized)}
            className="w-full flex items-center justify-between mb-3 hover:text-cyan-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Pending Invitations</h2>
              <span className="text-sm text-neutral-400">{invitations.length}</span>
            </div>
            {isInvitationsMinimized ? (
              <ChevronDown size={20} className="text-neutral-400" />
            ) : (
              <ChevronUp size={20} className="text-neutral-400" />
            )}
          </button>

          {!isInvitationsMinimized && (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
                      {invitation.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{invitation.user}</span>
                        <Check size={14} className="text-cyan-400" />
                      </div>
                      <div className="text-sm text-neutral-400 mb-1">{invitation.bio}</div>
                      <div className="text-xs text-neutral-500 flex items-center gap-2">
                        <Users size={12} />
                        <span>{invitation.mutualConnections}</span>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500">{invitation.timestamp}</div>
                  </div>

                  <div className="mb-3 p-3 bg-neutral-900/50 border border-neutral-700 rounded-lg">
                    <div className="text-sm mb-2">{invitation.message}</div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="text-orange-400" />
                        <span>{invitation.workoutType}</span>
                      </div>
                      <span>•</span>
                      <span>{invitation.time}</span>
                      <span>•</span>
                      <span>{invitation.gym}</span>
                    </div>
                  </div>

                  <div className="text-sm text-neutral-400 mb-3">Reply to {invitation.user.split(' ')[0]}</div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleIgnore(invitation.id)}
                      className="flex-1 py-2 px-4 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-lg font-semibold transition-colors"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleAccept(invitation.id)}
                      className="flex-1 py-2 px-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Friends Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Individual</h2>
          <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
            See All
          </button>
        </div>

        <div className="space-y-3">
          {mockFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors"
            >
              <button
                onClick={() => openUserProfile(friend)}
                className="relative"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl">
                  {friend.avatar}
                </div>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-neutral-800 ${
                    friend.status === 'working-out'
                      ? 'bg-orange-500'
                      : friend.status === 'online'
                      ? 'bg-green-500'
                      : 'bg-neutral-500'
                  }`}
                />
              </button>

              <button
                onClick={() => openUserProfile(friend)}
                className="flex-1 min-w-0 text-left"
              >
                <div className="font-semibold">{friend.name}</div>
                {friend.currentActivity ? (
                  <div className="text-sm text-orange-400 flex items-center gap-1">
                    <Zap size={12} />
                    <span className="truncate">{friend.currentActivity} at {friend.gym}</span>
                  </div>
                ) : (
                  <div className="text-sm text-neutral-400">{friend.lastActive}</div>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleZapUser(friend)}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                  title={friend.workedOutToday ? "Already worked out today" : "Send a nudge"}
                >
                  <Zap size={18} className={friend.workedOutToday ? "text-neutral-600" : "text-cyan-400"} />
                </button>
                <button
                  onClick={() => openChat(friend.id, friend.name, friend.avatar, false)}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <MessageCircle size={18} className="text-neutral-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Groups Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Groups</h2>
          <button
            onClick={openGroupModal}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Plus size={20} className="text-cyan-400" />
          </button>
        </div>

        <div className="space-y-3">
          {mockGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => openChat(group.id, group.name, group.avatar, true, group.members, group.streak)}
              className="w-full flex items-center gap-3 p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl flex-shrink-0">
                {group.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold">{group.name}</span>
                  {group.streak && (
                    <div className="flex items-center gap-1 text-xs text-orange-400">
                      <Flame size={14} />
                      <span>{group.streak}</span>
                    </div>
                  )}
                  {group.unread && (
                    <span className="px-2 py-0.5 bg-cyan-500 text-xs rounded-full font-semibold">
                      {group.unread}
                    </span>
                  )}
                </div>
                <div className="text-sm text-neutral-400 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{group.members}</span>
                  </div>
                  <span>•</span>
                  <span className="truncate">{group.lastMessage}</span>
                </div>
              </div>

              <div className="text-xs text-neutral-500">{group.timestamp}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Workout Request Quick Actions */}
      <div className="px-4 mt-6">
        <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold mb-1">Find a Workout Buddy</div>
              <div className="text-sm text-neutral-400">Send session invites to friends</div>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Send size={18} />
            <span>Post Invite</span>
          </button>
        </div>
      </div>

      {/* Post Workout Invite Modal */}
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
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Looking for</label>
                <select className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500">
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
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500"
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

      {/* Create/Join Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-neutral-700">
              <h3 className="text-xl font-bold">Groups</h3>
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setSelectedMembers([]);
                  setShowFriendsList(false);
                }}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-neutral-700">
              <button
                onClick={() => setGroupModalTab('create')}
                className={`flex-1 py-3 font-semibold transition-colors ${
                  groupModalTab === 'create'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                Create Group
              </button>
              <button
                onClick={() => setGroupModalTab('join')}
                className={`flex-1 py-3 font-semibold transition-colors ${
                  groupModalTab === 'join'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                Join Group
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {groupModalTab === 'create' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Group Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Morning Workout Crew"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio (Optional)</label>
                    <textarea
                      placeholder="Describe your group..."
                      rows={3}
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg resize-none focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Add Members</label>
                    <button
                      onClick={() => setShowFriendsList(!showFriendsList)}
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors text-left flex items-center justify-between"
                    >
                      <span className="text-neutral-400">
                        {selectedMembers.length > 0
                          ? `${selectedMembers.length} ${selectedMembers.length === 1 ? 'member' : 'members'} selected`
                          : 'Select members...'}
                      </span>
                      <ChevronDown size={20} className={`transition-transform ${showFriendsList ? 'rotate-180' : ''}`} />
                    </button>

                    {showFriendsList && (
                      <div className="mt-2 bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                        <div className="p-3 border-b border-neutral-700">
                          <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                              type="text"
                              placeholder="Search members..."
                              value={memberSearchTerm}
                              onChange={(e) => setMemberSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {mockFriends
                            .filter((friend) =>
                              friend.name.toLowerCase().includes(memberSearchTerm.toLowerCase())
                            )
                            .map((friend) => (
                              <button
                                key={friend.id}
                                onClick={() => toggleMemberSelection(friend.id)}
                                className="w-full px-4 py-3 hover:bg-neutral-700 transition-colors flex items-center gap-3"
                              >
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    selectedMembers.includes(friend.id)
                                      ? 'bg-cyan-500 border-cyan-500'
                                      : 'border-neutral-600'
                                  }`}
                                >
                                  {selectedMembers.includes(friend.id) && (
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2 6L5 9L10 3"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm">
                                  {friend.avatar}
                                </div>
                                <span className="flex-1 text-left">{friend.name}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Members Tags */}
                    {selectedMembers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedMembers.map((memberId) => {
                          const friend = mockFriends.find(f => f.id === memberId);
                          if (!friend) return null;
                          return (
                            <div
                              key={memberId}
                              className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded-md text-sm"
                            >
                              <span>{friend.name}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMemberSelection(memberId);
                                }}
                                className="hover:text-cyan-400 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <div className="text-sm text-neutral-400 mb-1">Group Code</div>
                    <div className="text-2xl font-bold text-cyan-400 tracking-wider">{generatedCode}</div>
                    <div className="text-xs text-neutral-500 mt-1">Share this code with others to invite them to your group</div>
                  </div>

                  <button
                    onClick={createGroup}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
                  >
                    Create Group
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Search Groups</label>
                    <input
                      type="text"
                      placeholder="Search for groups..."
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-2">
                    {/* Mock search results */}
                    {['Powerlifting Squad', 'Cardio Crew', 'Yoga Enthusiasts'].map((groupName, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                              {['💪', '🏃', '🧘'][idx]}
                            </div>
                            <div>
                              <div className="font-semibold">{groupName}</div>
                              <div className="text-xs text-neutral-400">{[12, 8, 15][idx]} members</div>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm font-semibold transition-colors">
                            Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-neutral-900 text-neutral-400">OR</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Join with Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter group code..."
                        className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500 uppercase"
                        maxLength={6}
                      />
                      <button
                        onClick={joinGroup}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Zap Modal */}
      {showZapModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Send Nudge</h3>
              <button
                onClick={() => setShowZapModal(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl">
                  {zapTarget?.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{zapTarget?.name}</div>
                  {zapTarget?.currentActivity ? (
                    <div className="text-sm text-orange-400 flex items-center gap-1">
                      <Zap size={12} />
                      <span className="truncate">{zapTarget?.currentActivity} at {zapTarget?.gym}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-neutral-400">{zapTarget?.lastActive}</div>
                  )}
                </div>
              </div>

              <div className="text-sm text-neutral-400">Send a nudge to encourage {zapTarget?.name} to hit the gym today!</div>

              <button
                onClick={sendZap}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send Nudge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMessage={() => {
            const friend = selectedUser;
            setSelectedUser(null);
            openChat(friend.id, friend.name, friend.avatar, false);
          }}
        />
      )}
    </div>
  );
}