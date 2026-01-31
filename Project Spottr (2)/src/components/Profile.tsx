import { Award, TrendingUp, Flame, Zap, Star, Users, Settings, Calendar, Edit2, Check, X, Upload, Video, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useState } from 'react';

const recentWorkouts = [
  { date: 'Today', type: 'Push Day', exercises: 8, sets: 24, duration: '1h 15m' },
  { date: 'Yesterday', type: 'Pull Day', exercises: 7, sets: 21, duration: '1h 5m' },
  { date: '2 days ago', type: 'Leg Day', exercises: 6, sets: 18, duration: '55m' },
  { date: '3 days ago', type: 'Upper Body', exercises: 9, sets: 27, duration: '1h 20m' },
];

const stats = [
  { label: 'Total Workouts', value: '64', icon: Zap, color: 'text-cyan-400' },
  { label: 'Current Streak', value: '23', icon: Flame, color: 'text-orange-500' },
  { label: 'Friends', value: '47', icon: Users, color: 'text-green-400' },
];

// Mock user posts
const userPosts = [
  {
    id: 1,
    date: 'Today',
    type: 'Push Day',
    image: 'workout-1',
    caption: 'New bench PR! 225 lbs x 5 reps 💪',
    likes: 47,
    comments: 12,
  },
  {
    id: 2,
    date: 'Yesterday',
    type: 'Pull Day',
    image: 'workout-2',
    caption: 'Back day feeling strong 🔥',
    likes: 32,
    comments: 8,
  },
  {
    id: 3,
    date: '2 days ago',
    type: 'Leg Day',
    image: 'workout-3',
    caption: 'Leg day squad! 🦵',
    likes: 56,
    comments: 15,
  },
];

// Calendar data - days with workouts (this would be dynamic based on selected month/year)
const getWorkoutDaysForMonth = (month: number, year: number) => {
  // Mock data - in real app, this would fetch from backend
  const today = new Date();
  if (month === today.getMonth() && year === today.getFullYear()) {
    return [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];
  } else if (month === today.getMonth() - 1 && year === today.getFullYear()) {
    return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29];
  }
  return [];
};

interface PersonalRecord {
  name: string;
  value: string;
  unit: string;
  videoUrl: string | null;
}

type TabType = 'posts' | 'calendar' | 'recent' | 'records';

export function Profile() {
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([
    { name: 'Bench Press', value: '225', unit: ' lbs', videoUrl: 'sample-video.mp4' },
    { name: 'Squat', value: '315', unit: ' lbs', videoUrl: null },
    { name: 'Deadlift', value: '405', unit: ' lbs', videoUrl: 'sample-video-2.mp4' },
    { name: 'Mile Time', value: '7:32', unit: '', videoUrl: null },
  ]);
  
  const [editingRecord, setEditingRecord] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  
  // Calendar navigation state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleEditRecord = (index: number) => {
    setEditingRecord(index);
    setEditValue(personalRecords[index].value);
    setVideoFile(null);
  };

  const handleSaveRecord = (index: number) => {
    const updatedRecords = [...personalRecords];
    updatedRecords[index].value = editValue;
    
    // Simulate video upload - in real app, this would upload to server
    if (videoFile) {
      updatedRecords[index].videoUrl = URL.createObjectURL(videoFile);
    }
    
    setPersonalRecords(updatedRecords);
    setEditingRecord(null);
    setEditValue('');
    setVideoFile(null);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditValue('');
    setVideoFile(null);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  // Generate calendar days for current month
  const generateCalendar = () => {
    const year = currentYear;
    const month = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendar = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }
    
    return calendar;
  };

  return (
    <div className="max-w-lg mx-auto pb-6">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600" />
        
        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex items-end gap-4 -mt-16 mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-4 border-neutral-950 flex items-center justify-center text-4xl">
              🏋️
            </div>
            <div className="flex-1 pt-16">
              <h2 className="text-xl font-bold">Alex Johnson</h2>
              <p className="text-neutral-400 text-sm">@alexjohnson</p>
            </div>
            <button className="mt-16 px-4 py-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg text-sm font-semibold transition-colors">
              <Settings size={16} />
            </button>
          </div>

          {/* Bio */}
          <p className="text-sm text-neutral-300 mb-4">
            💪 Fitness enthusiast | 🏋️ Push Pull Legs | 🎯 Chasing gains
          </p>

          {/* Social Stats */}
          <div className="flex gap-4 mb-4">
            <button className="flex-1 text-center">
              <div className="font-bold text-lg">47</div>
              <div className="text-xs text-neutral-400">Friends</div>
            </button>
            <button className="flex-1 text-center border-l border-r border-neutral-700">
              <div className="font-bold text-lg">892</div>
              <div className="text-xs text-neutral-400">Following</div>
            </button>
            <button className="flex-1 text-center">
              <div className="font-bold text-lg">1.2k</div>
              <div className="text-xs text-neutral-400">Followers</div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-neutral-400">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${
              activeTab === 'posts'
                ? 'bg-cyan-500 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${
              activeTab === 'calendar'
                ? 'bg-cyan-500 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${
              activeTab === 'recent'
                ? 'bg-cyan-500 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${
              activeTab === 'records'
                ? 'bg-cyan-500 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            PRs
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageCircle size={20} className="text-cyan-400" />
              My Posts
            </h3>
            
            <div className="space-y-4">
              {userPosts.map((post) => (
                <div key={post.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl">
                      🏋️
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Alex Johnson</div>
                      <div className="text-xs text-neutral-400">{post.date} • {post.type}</div>
                    </div>
                  </div>

                  {/* Post Image Placeholder */}
                  <div className="w-full aspect-square bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                    <div className="text-6xl">💪</div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-sm text-neutral-300 mb-3">{post.caption}</p>
                    
                    {/* Post Actions */}
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-red-400 transition-colors">
                        <Heart size={18} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-cyan-400 transition-colors">
                        <MessageCircle size={18} />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-cyan-400 transition-colors ml-auto">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar size={20} className="text-cyan-400" />
              Workout Calendar
            </h3>
            
            {/* Calendar Grid */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => {
                    if (currentMonth > 0) {
                      setCurrentMonth(currentMonth - 1);
                    } else {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    }
                  }}
                  className="p-1 hover:bg-neutral-700 rounded transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-sm font-semibold text-neutral-400">
                  {monthNames[currentMonth]} {currentYear}
                </div>
                <button
                  onClick={() => {
                    if (currentMonth < 11) {
                      setCurrentMonth(currentMonth + 1);
                    } else {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    }
                  }}
                  className="p-1 hover:bg-neutral-700 rounded transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={idx} className="text-center text-xs text-neutral-400 font-semibold">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {generateCalendar().map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => day && getWorkoutDaysForMonth(currentMonth, currentYear).includes(day) && setSelectedDate(day)}
                    disabled={!day}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                      !day
                        ? 'invisible'
                        : day && getWorkoutDaysForMonth(currentMonth, currentYear).includes(day)
                        ? selectedDate === day
                          ? 'bg-cyan-500 text-white font-bold'
                          : 'bg-cyan-500/20 text-cyan-400 font-semibold hover:bg-cyan-500/30'
                        : 'bg-neutral-700/30 text-neutral-500 hover:bg-neutral-700/50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Day Workouts */}
            {selectedDate && getWorkoutDaysForMonth(currentMonth, currentYear).includes(selectedDate) && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-neutral-400 mb-2">
                  Workouts on {monthNames[currentMonth]} {selectedDate}, {currentYear}
                </h4>
                <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">Push Day</div>
                      <div className="text-xs text-neutral-400">Morning Session</div>
                    </div>
                    <div className="text-xs text-neutral-400">
                      1h 15m
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-xs text-neutral-400">
                    <span>8 exercises</span>
                    <span>•</span>
                    <span>24 sets</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Workouts Tab */}
        {activeTab === 'recent' && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar size={20} className="text-cyan-400" />
              Recent Workouts
            </h3>
            
            <div className="space-y-2">
              {recentWorkouts.map((workout, idx) => (
                <div key={idx} className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">{workout.type}</div>
                      <div className="text-xs text-neutral-400">{workout.date}</div>
                    </div>
                    <div className="text-xs text-neutral-400">
                      {workout.duration}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-xs text-neutral-400">
                    <span>{workout.exercises} exercises</span>
                    <span>•</span>
                    <span>{workout.sets} sets</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Records Tab */}
        {activeTab === 'records' && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              Personal Records
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {personalRecords.map((record, index) => (
                <div key={record.name} className="relative">
                  {editingRecord === index ? (
                    // Edit Mode
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-cyan-500 rounded-lg">
                      <div className="text-xs text-neutral-400 mb-1">{record.name}</div>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={`Enter ${record.name.toLowerCase()}`}
                        className="w-full mb-2 px-2 py-1 text-xl font-bold text-green-400 bg-neutral-800 border border-neutral-700 rounded focus:outline-none focus:border-cyan-500"
                      />
                      
                      {/* Video Upload */}
                      <label className="block mb-3 cursor-pointer">
                        <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
                          <Upload size={14} className="text-cyan-400" />
                          <span className="text-xs text-neutral-300">
                            {videoFile ? videoFile.name : 'Upload Video'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                      </label>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveRecord(index)}
                          className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <Check size={14} />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-xs text-neutral-400">{record.name}</div>
                        <button
                          onClick={() => handleEditRecord(index)}
                          className="p-1 hover:bg-neutral-800 rounded transition-colors"
                        >
                          <Edit2 size={14} className="text-cyan-400" />
                        </button>
                      </div>
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        {record.value}{record.unit}
                      </div>
                      
                      {/* Video Status */}
                      {record.videoUrl ? (
                        <div className="flex items-center gap-1 text-xs text-cyan-400">
                          <Video size={12} />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-500">
                          Unrecorded Lift
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}