import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Camera, Image as ImageIcon, Check, Star, X, ChevronLeft } from 'lucide-react';
import { BusyLevelModal } from '../BusyLevelModal';

interface LocationState {
  workoutExercises: any[];
  duration: string;
}

export function WorkoutCompletion() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showTemplateInput, setShowTemplateInput] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [showBusyLevelModal, setShowBusyLevelModal] = useState(false);
  const [completionType, setCompletionType] = useState<'main' | 'friends' | null>(null);

  // Calculate workout stats
  const totalExercises = state?.workoutExercises?.length || 0;
  const totalSets = state?.workoutExercises?.reduce((acc, ex) => acc + ex.sets.length, 0) || 0;
  const completedSets = state?.workoutExercises?.reduce(
    (acc, ex) => acc + ex.sets.filter((s: any) => s.completed).length, 
    0
  ) || 0;

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      // In a real app, this would save the template to a database
      setSaveAsTemplate(true);
      setShowTemplateInput(false);
    }
  };

  const handleFinish = () => {
    // Show busy level modal
    setCompletionType('friends');
    setShowBusyLevelModal(true);
  };

  const handlePostToFeed = () => {
    // Show busy level modal
    setCompletionType('main');
    setShowBusyLevelModal(true);
  };

  const handleBusyLevelSubmit = (level: string) => {
    // In a real app, this would create a post with the workout data and busy level
    console.log('Posting workout with busy level:', level);
    navigate('/');
  };

  const addMediaFromGallery = () => {
    // Mock adding media
    setMedia([...media, `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800`]);
    setShowMediaOptions(false);
  };

  const addMediaFromCamera = () => {
    // Mock adding media from camera
    setMedia([...media, `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800`]);
    setShowMediaOptions(false);
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/workout/new', { 
              state: { 
                workoutExercises: state?.workoutExercises,
                returnFromComplete: true 
              } 
            })}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Workout Complete! 🎉</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Workout Stats */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-1">Great Work!</h2>
            <p className="text-neutral-400">You crushed this workout</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-neutral-900/50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-400">{totalExercises}</div>
              <div className="text-xs text-neutral-400">Exercises</div>
            </div>
            <div className="text-center p-3 bg-neutral-900/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{completedSets}</div>
              <div className="text-xs text-neutral-400">Sets</div>
            </div>
            <div className="text-center p-3 bg-neutral-900/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">{state?.duration || '0:00'}</div>
              <div className="text-xs text-neutral-400">Duration</div>
            </div>
          </div>
        </div>

        {/* Optional Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Add a note <span className="text-neutral-500">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How did the workout feel? Any PRs or notes..."
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-cyan-500 resize-none"
            rows={4}
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Add media <span className="text-neutral-500">(optional)</span>
          </label>
          
          {/* Media Grid */}
          {media.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {media.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-800">
                  <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeMedia(idx)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/70 hover:bg-black rounded-full flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Media Button */}
          <button
            onClick={() => setShowMediaOptions(true)}
            className="w-full py-4 bg-neutral-900 border-2 border-dashed border-neutral-800 hover:border-cyan-500 rounded-lg transition-colors flex items-center justify-center gap-2 text-neutral-400 hover:text-cyan-400"
          >
            <ImageIcon size={20} />
            <span className="font-medium">Add Photo or Video</span>
          </button>
        </div>

        {/* Save as Template */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-orange-400" />
              <span className="font-medium">Save as template</span>
            </div>
            <button
              onClick={() => {
                if (saveAsTemplate) {
                  setSaveAsTemplate(false);
                  setTemplateName('');
                } else {
                  setShowTemplateInput(true);
                }
              }}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                saveAsTemplate ? 'bg-cyan-500' : 'bg-neutral-700'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                saveAsTemplate ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <p className="text-sm text-neutral-400">
            Save this workout to reuse later
          </p>
          
          {showTemplateInput && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name..."
                className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
                autoFocus
              />
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-neutral-700 disabled:text-neutral-500 rounded-lg text-sm font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          )}
          
          {saveAsTemplate && !showTemplateInput && (
            <div className="mt-2 px-3 py-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg">
              <p className="text-sm text-cyan-400">✓ Saved as "{templateName}"</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handlePostToFeed}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-bold text-lg transition-colors"
          >
            Post to Main Feed
          </button>
          
          <button
            onClick={handleFinish}
            className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-semibold transition-colors"
          >
            Finish (Groups & Friends Only)
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          Your workout will automatically appear in your groups and friends' activity feeds
        </p>
      </div>

      {/* Media Options Modal */}
      {showMediaOptions && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-4 border-t sm:border border-neutral-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold">Add Media</h2>
              <button
                onClick={() => setShowMediaOptions(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Options */}
            <div className="p-4 space-y-3">
              <button
                onClick={addMediaFromCamera}
                className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Camera size={24} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Take Photo</div>
                  <div className="text-sm text-neutral-400">Use your camera</div>
                </div>
              </button>

              <button
                onClick={addMediaFromGallery}
                className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <ImageIcon size={24} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Choose from Gallery</div>
                  <div className="text-sm text-neutral-400">Select existing photos</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Busy Level Modal */}
      {showBusyLevelModal && (
        <BusyLevelModal
          isOpen={showBusyLevelModal}
          onClose={() => setShowBusyLevelModal(false)}
          onSubmit={handleBusyLevelSubmit}
          gymName="Your Gym"
        />
      )}
    </div>
  );
}