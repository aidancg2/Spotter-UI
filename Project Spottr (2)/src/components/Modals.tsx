import { X, Camera, MapPin, Dumbbell, Image, Type, FileText, ChevronDown, ImageIcon, Hash, BarChart3, Smile, Trophy } from 'lucide-react';
import { useState } from 'react';
import { BusyLevelModal } from './BusyLevelModal';

interface QuickCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCheckinModal({ isOpen, onClose }: QuickCheckinModalProps) {
  const [selectedGym, setSelectedGym] = useState("Gold's Gym");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [otherActivity, setOtherActivity] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showBusyLevelModal, setShowBusyLevelModal] = useState(false);

  if (!isOpen) return null;

  const activities = [
    { value: 'arms', label: 'Arms' },
    { value: 'legs', label: 'Legs' },
    { value: 'push', label: 'Push' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'other', label: 'Other' },
  ];

  const toggleActivity = (value: string) => {
    if (selectedActivities.includes(value)) {
      setSelectedActivities(selectedActivities.filter(a => a !== value));
      if (value === 'other') {
        setOtherActivity('');
      }
    } else {
      setSelectedActivities([...selectedActivities, value]);
    }
  };

  const removeActivity = (value: string) => {
    setSelectedActivities(selectedActivities.filter(a => a !== value));
    if (value === 'other') {
      setOtherActivity('');
    }
  };

  const getDropdownText = () => {
    if (selectedActivities.length === 0) return 'Select activities...';
    if (selectedActivities.length === 1) return '1 item selected';
    return `${selectedActivities.length} items selected`;
  };

  const handleCheckIn = () => {
    // Show busy level modal instead of closing
    setShowBusyLevelModal(true);
  };

  const handleBusyLevelSubmit = (level: string) => {
    // In a real app, this would submit the check-in with the busy level
    console.log('Check-in with busy level:', level);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-800 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            <h2 className="text-xl font-bold">Quick Check-in</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Camera Preview */}
            <div className="aspect-[4/5] bg-neutral-800 rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-700">
              <div className="text-center">
                <Camera size={48} className="mx-auto mb-2 text-neutral-600" />
                <p className="text-sm text-neutral-500">Tap to take photo</p>
              </div>
            </div>

            {/* Gym Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-cyan-400" />
                Where are you working out?
              </label>
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option>Gold's Gym</option>
                <option>LA Fitness</option>
                <option>Equinox</option>
                <option>Lifetime Fitness</option>
                <option>Planet Fitness</option>
              </select>
            </div>

            {/* Activity - Multi-Select Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Dumbbell size={16} className="text-orange-400" />
                What are you working on?
              </label>
              
              {/* Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-orange-500 flex items-center justify-between text-left hover:border-neutral-600 transition-colors"
                >
                  <span className={selectedActivities.length === 0 ? 'text-neutral-500' : ''}>
                    {getDropdownText()}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 w-full bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {activities.map((activity) => (
                      <button
                        key={activity.value}
                        onClick={() => toggleActivity(activity.value)}
                        className="w-full px-4 py-3 text-left hover:bg-neutral-700 transition-colors flex items-center gap-3"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedActivities.includes(activity.value)
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-neutral-600'
                        }`}>
                          {selectedActivities.includes(activity.value) && (
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
                        <span>{activity.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Items as Tags */}
              {selectedActivities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedActivities.map((value) => {
                    const activity = activities.find(a => a.value === value);
                    return (
                      <div
                        key={value}
                        className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 border border-orange-500/40 rounded-full text-sm"
                      >
                        <span>{activity?.label}</span>
                        <button
                          onClick={() => removeActivity(value)}
                          className="hover:text-orange-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other Activity Input */}
            {selectedActivities.includes('other') && (
              <div>
                <input
                  type="text"
                  value={otherActivity}
                  onChange={(e) => setOtherActivity(e.target.value)}
                  placeholder="Type your workout..."
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCheckIn}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
              >
                Check In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Busy Level Modal */}
      <BusyLevelModal
        isOpen={showBusyLevelModal}
        onClose={() => {
          setShowBusyLevelModal(false);
          onClose();
        }}
        onSubmit={handleBusyLevelSubmit}
        gymName={selectedGym}
      />
    </>
  );
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostModal({ isOpen, onClose }: PostModalProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [showPollOptions, setShowPollOptions] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneType, setMilestoneType] = useState('');
  const [milestoneValue, setMilestoneValue] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const suggestedTags = ['Strength', 'Cardio', 'Nutrition', 'Progress', 'Motivation', 'Tips'];

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
    setShowTagInput(false);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addMedia = () => {
    // Mock adding media
    setMedia([...media, `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800`]);
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl max-w-xl w-full border border-neutral-800 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <button className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors">
            Drafts
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* User Avatar + Text Input */}
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                U
              </div>

              {/* Main Input Area */}
              <div className="flex-1 space-y-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full bg-transparent text-xl focus:outline-none resize-none placeholder:text-neutral-600 min-h-[120px]"
                  autoFocus
                />

                {/* Media Preview */}
                {media.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {media.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-neutral-800">
                        <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeMedia(idx)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black rounded-full flex items-center justify-center transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags Display */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-sm"
                      >
                        <Hash size={14} className="text-cyan-400" />
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tag Input */}
                {showTagInput && (
                  <div className="p-3 bg-neutral-800 border border-neutral-700 rounded-xl">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && tagInput.trim()) {
                          addTag(tagInput.trim());
                        }
                      }}
                      placeholder="Enter tag..."
                      className="w-full bg-transparent focus:outline-none mb-2"
                      autoFocus
                    />
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.filter(t => !tags.includes(t)).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => addTag(tag)}
                          className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-xs transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Poll Options */}
                {showPollOptions && (
                  <div className="p-3 bg-neutral-800 border border-neutral-700 rounded-xl space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">Poll Options</span>
                      <button
                        onClick={() => {
                          setShowPollOptions(false);
                          setPollOptions(['', '']);
                        }}
                        className="text-xs text-neutral-400 hover:text-white transition-colors"
                      >
                        Remove Poll
                      </button>
                    </div>
                    {pollOptions.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updatePollOption(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:border-cyan-500"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            onClick={() => removePollOption(idx)}
                            className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 4 && (
                      <button
                        onClick={addPollOption}
                        className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>
                )}

                {/* Milestone Input */}
                {showMilestone && (
                  <div className="p-3 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Trophy size={18} className="text-orange-400" />
                        <span className="font-semibold text-sm">Add Milestone</span>
                      </div>
                      <button
                        onClick={() => {
                          setShowMilestone(false);
                          setMilestoneType('');
                          setMilestoneValue('');
                        }}
                        className="text-xs text-neutral-400 hover:text-white transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <select
                        value={milestoneType}
                        onChange={(e) => setMilestoneType(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-orange-500"
                      >
                        <option value="">Select milestone type...</option>
                        <option value="bench">Bench Press PR</option>
                        <option value="squat">Squat PR</option>
                        <option value="deadlift">Deadlift PR</option>
                        <option value="marathon">Marathon</option>
                        <option value="half-marathon">Half Marathon</option>
                        <option value="5k">5K Run</option>
                        <option value="weight">Weight Goal</option>
                        <option value="other">Other</option>
                      </select>
                      {milestoneType && (
                        <input
                          type="text"
                          value={milestoneValue}
                          onChange={(e) => setMilestoneValue(e.target.value)}
                          placeholder={
                            milestoneType.includes('PR') || milestoneType === 'weight'
                              ? 'e.g., 225 lbs'
                              : 'e.g., 3:45:00'
                          }
                          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-orange-500"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 p-4">
          {/* Who can reply */}
          <div className="mb-3">
            <button className="flex items-center gap-2 text-cyan-400 hover:bg-cyan-500/10 px-3 py-1.5 rounded-full transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              <span className="text-sm font-semibold">Everyone can reply</span>
            </button>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Media */}
              <button
                onClick={addMedia}
                className="p-2 hover:bg-cyan-500/10 rounded-full transition-colors group"
                title="Add media"
              >
                <ImageIcon size={20} className="text-cyan-400" />
              </button>

              {/* GIF */}
              <button
                className="p-2 hover:bg-cyan-500/10 rounded-full transition-colors group"
                title="Add GIF"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-cyan-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                  <path d="M7 8h3v8H7z" strokeWidth="2"/>
                  <path d="M14 8h3M14 12h3M14 16h3" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Poll */}
              <button
                onClick={() => setShowPollOptions(!showPollOptions)}
                className={`p-2 hover:bg-cyan-500/10 rounded-full transition-colors group ${
                  showPollOptions ? 'bg-cyan-500/20' : ''
                }`}
                title="Add poll"
              >
                <BarChart3 size={20} className="text-cyan-400" />
              </button>

              {/* Tags */}
              <button
                onClick={() => setShowTagInput(!showTagInput)}
                className={`p-2 hover:bg-cyan-500/10 rounded-full transition-colors group ${
                  showTagInput ? 'bg-cyan-500/20' : ''
                }`}
                title="Add tags"
              >
                <Hash size={20} className="text-cyan-400" />
              </button>

              {/* Milestone */}
              <button
                onClick={() => setShowMilestone(!showMilestone)}
                className={`p-2 hover:bg-orange-500/10 rounded-full transition-colors group ${
                  showMilestone ? 'bg-orange-500/20' : ''
                }`}
                title="Add milestone"
              >
                <Trophy size={20} className="text-orange-400" />
              </button>

              {/* Emoji */}
              <button
                className="p-2 hover:bg-cyan-500/10 rounded-full transition-colors group"
                title="Add emoji"
              >
                <Smile size={20} className="text-cyan-400" />
              </button>
            </div>

            {/* Post Button */}
            <button
              disabled={!content.trim()}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-neutral-700 disabled:text-neutral-500 rounded-full font-bold transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Removed LogWorkoutModal - now handled by routing