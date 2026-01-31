import { useState } from 'react';
import { Dumbbell, ChevronDown } from 'lucide-react';

interface PreferencesProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
  displayName: string;
}

export interface UserPreferences {
  bio: string;
  workoutDays: number;
}

export function Preferences({ onComplete, onSkip, displayName }: PreferencesProps) {
  const [bio, setBio] = useState('');
  const [workoutDays, setWorkoutDays] = useState<number>(3);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleComplete = () => {
    onComplete({ bio, workoutDays });
  };

  const workoutDayOptions = [
    { value: 1, label: '1 day per week' },
    { value: 2, label: '2 days per week' },
    { value: 3, label: '3 days per week' },
    { value: 4, label: '4 days per week' },
    { value: 5, label: '5 days per week' },
    { value: 6, label: '6 days per week' },
    { value: 7, label: '7 days per week' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg">
            <Dumbbell size={40} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {displayName}! 👋</h1>
          <p className="text-neutral-400">
            Let's personalize your fitness experience
          </p>
        </div>

        {/* Preferences Form */}
        <div className="space-y-6">
          {/* Bio Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Bio <span className="text-neutral-500">(Optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself... Your fitness goals, favorite exercises, etc."
              rows={4}
              maxLength={150}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
            <div className="text-right text-sm text-neutral-500 mt-1">
              {bio.length}/150
            </div>
          </div>

          {/* Workout Days Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Workout Frequency
            </label>
            <p className="text-sm text-neutral-500 mb-2">
              How many days per week do you plan to work out?
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors flex items-center justify-between"
              >
                <span>
                  {workoutDayOptions.find(opt => opt.value === workoutDays)?.label}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-10 overflow-hidden">
                  {workoutDayOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setWorkoutDays(option.value);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors ${
                        workoutDays === option.value
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-cyan-400">Why we ask</h3>
            <p className="text-sm text-neutral-300">
              We'll use this info to customize your feed, suggest workout buddies with similar schedules, and help you stay on track with your goals.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleComplete}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              Complete Setup
            </button>

            <button
              onClick={onSkip}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Can change later */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          You can always update these preferences later in your profile settings
        </p>
      </div>
    </div>
  );
}
