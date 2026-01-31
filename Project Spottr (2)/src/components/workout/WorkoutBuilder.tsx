import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { X, Plus, Search, Trash2, ChevronLeft, Dumbbell } from 'lucide-react';

// Exercise types
type ExerciseType = 'strength' | 'cardio';

interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  category?: string;
}

interface Set {
  id: string;
  reps?: number;
  weight?: number;
  distance?: number; // miles for cardio
  time?: string; // MM:SS format
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: Set[];
}

// Mock exercise database
const EXERCISE_DATABASE: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', type: 'strength', category: 'Chest' },
  { id: 'incline-bench', name: 'Incline Bench Press', type: 'strength', category: 'Chest' },
  { id: 'dumbbell-press', name: 'Dumbbell Press', type: 'strength', category: 'Chest' },
  { id: 'cable-fly', name: 'Cable Fly', type: 'strength', category: 'Chest' },
  { id: 'push-ups', name: 'Push Ups', type: 'strength', category: 'Chest' },
  
  // Back
  { id: 'deadlift', name: 'Deadlift', type: 'strength', category: 'Back' },
  { id: 'pull-ups', name: 'Pull Ups', type: 'strength', category: 'Back' },
  { id: 'barbell-row', name: 'Barbell Row', type: 'strength', category: 'Back' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', type: 'strength', category: 'Back' },
  { id: 'cable-row', name: 'Cable Row', type: 'strength', category: 'Back' },
  
  // Legs
  { id: 'squat', name: 'Squat', type: 'strength', category: 'Legs' },
  { id: 'leg-press', name: 'Leg Press', type: 'strength', category: 'Legs' },
  { id: 'leg-curl', name: 'Leg Curl', type: 'strength', category: 'Legs' },
  { id: 'leg-extension', name: 'Leg Extension', type: 'strength', category: 'Legs' },
  { id: 'lunges', name: 'Lunges', type: 'strength', category: 'Legs' },
  { id: 'calf-raise', name: 'Calf Raise', type: 'strength', category: 'Legs' },
  
  // Shoulders
  { id: 'shoulder-press', name: 'Shoulder Press', type: 'strength', category: 'Shoulders' },
  { id: 'lateral-raise', name: 'Lateral Raise', type: 'strength', category: 'Shoulders' },
  { id: 'front-raise', name: 'Front Raise', type: 'strength', category: 'Shoulders' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', type: 'strength', category: 'Shoulders' },
  
  // Arms
  { id: 'bicep-curl', name: 'Bicep Curl', type: 'strength', category: 'Arms' },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', type: 'strength', category: 'Arms' },
  { id: 'hammer-curl', name: 'Hammer Curl', type: 'strength', category: 'Arms' },
  { id: 'tricep-extension', name: 'Tricep Extension', type: 'strength', category: 'Arms' },
  { id: 'tricep-dips', name: 'Tricep Dips', type: 'strength', category: 'Arms' },
  { id: 'skull-crushers', name: 'Skull Crushers', type: 'strength', category: 'Arms' },
  
  // Cardio
  { id: 'running', name: 'Running', type: 'cardio', category: 'Cardio' },
  { id: 'treadmill', name: 'Treadmill', type: 'cardio', category: 'Cardio' },
  { id: 'incline-walk', name: 'Incline Walk', type: 'cardio', category: 'Cardio' },
  { id: 'cycling', name: 'Cycling', type: 'cardio', category: 'Cardio' },
  { id: 'rowing', name: 'Rowing', type: 'cardio', category: 'Cardio' },
  { id: 'stairmaster', name: 'Stairmaster', type: 'cardio', category: 'Cardio' },
  { id: 'elliptical', name: 'Elliptical', type: 'cardio', category: 'Cardio' },
];

// Mock templates
const MOCK_TEMPLATES = {
  '1': {
    name: 'Push Day',
    exercises: [
      { exerciseId: 'bench-press', sets: [{ reps: 10, weight: 185 }, { reps: 8, weight: 205 }, { reps: 6, weight: 225 }] },
      { exerciseId: 'incline-bench', sets: [{ reps: 10, weight: 135 }, { reps: 10, weight: 135 }, { reps: 8, weight: 155 }] },
      { exerciseId: 'dumbbell-press', sets: [{ reps: 12, weight: 70 }, { reps: 12, weight: 70 }, { reps: 10, weight: 75 }] },
      { exerciseId: 'tricep-extension', sets: [{ reps: 15, weight: 60 }, { reps: 15, weight: 60 }, { reps: 12, weight: 70 }] },
    ]
  },
  '2': {
    name: 'Leg Day',
    exercises: [
      { exerciseId: 'squat', sets: [{ reps: 10, weight: 225 }, { reps: 8, weight: 275 }, { reps: 6, weight: 315 }] },
      { exerciseId: 'leg-press', sets: [{ reps: 12, weight: 360 }, { reps: 12, weight: 360 }, { reps: 10, weight: 405 }] },
      { exerciseId: 'leg-curl', sets: [{ reps: 12, weight: 90 }, { reps: 12, weight: 90 }, { reps: 10, weight: 100 }] },
      { exerciseId: 'calf-raise', sets: [{ reps: 15, weight: 180 }, { reps: 15, weight: 180 }, { reps: 15, weight: 200 }] },
    ]
  },
  '3': {
    name: 'Pull Day',
    exercises: [
      { exerciseId: 'deadlift', sets: [{ reps: 8, weight: 225 }, { reps: 6, weight: 275 }, { reps: 4, weight: 315 }] },
      { exerciseId: 'pull-ups', sets: [{ reps: 10, weight: 0 }, { reps: 8, weight: 0 }, { reps: 6, weight: 25 }] },
      { exerciseId: 'barbell-row', sets: [{ reps: 10, weight: 135 }, { reps: 10, weight: 155 }, { reps: 8, weight: 185 }] },
      { exerciseId: 'bicep-curl', sets: [{ reps: 12, weight: 30 }, { reps: 12, weight: 30 }, { reps: 10, weight: 35 }] },
    ]
  },
  '4': {
    name: 'Upper Body',
    exercises: [
      { exerciseId: 'bench-press', sets: [{ reps: 10, weight: 185 }, { reps: 8, weight: 205 }] },
      { exerciseId: 'barbell-row', sets: [{ reps: 10, weight: 135 }, { reps: 10, weight: 155 }] },
      { exerciseId: 'shoulder-press', sets: [{ reps: 10, weight: 95 }, { reps: 8, weight: 115 }] },
      { exerciseId: 'dumbbell-curl', sets: [{ reps: 12, weight: 30 }, { reps: 10, weight: 35 }] },
    ]
  }
};

export function WorkoutBuilder() {
  const navigate = useNavigate();
  const { templateId, workoutId } = useParams();
  const location = useLocation();
  const locationState = location.state as any;
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startTime] = useState(new Date());

  // Check if we're in template creation mode
  const isTemplateMode = location.pathname === '/workout/new/template';
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState(locationState?.templateName || '');

  // Load template or recent workout if specified, or restore from state
  useEffect(() => {
    // If returning from completion page, restore the workout
    if (locationState?.returnFromComplete && locationState?.workoutExercises) {
      setWorkoutExercises(locationState.workoutExercises);
      return;
    }

    if (templateId && MOCK_TEMPLATES[templateId as keyof typeof MOCK_TEMPLATES]) {
      const template = MOCK_TEMPLATES[templateId as keyof typeof MOCK_TEMPLATES];
      const loadedExercises: WorkoutExercise[] = template.exercises.map((ex, idx) => {
        const exercise = EXERCISE_DATABASE.find(e => e.id === ex.exerciseId)!;
        return {
          id: `ex-${idx}`,
          exercise,
          sets: ex.sets.map((set, setIdx) => ({
            id: `set-${idx}-${setIdx}`,
            reps: set.reps,
            weight: set.weight,
            completed: false,
          }))
        };
      });
      setWorkoutExercises(loadedExercises);
    } else if (workoutId && MOCK_TEMPLATES[workoutId as keyof typeof MOCK_TEMPLATES]) {
      // Same logic for recent workouts
      const workout = MOCK_TEMPLATES[workoutId as keyof typeof MOCK_TEMPLATES];
      const loadedExercises: WorkoutExercise[] = workout.exercises.map((ex, idx) => {
        const exercise = EXERCISE_DATABASE.find(e => e.id === ex.exerciseId)!;
        return {
          id: `ex-${idx}`,
          exercise,
          sets: ex.sets.map((set, setIdx) => ({
            id: `set-${idx}-${setIdx}`,
            reps: set.reps,
            weight: set.weight,
            completed: false,
          }))
        };
      });
      setWorkoutExercises(loadedExercises);
    }
  }, [templateId, workoutId, locationState]);

  const addExercise = (exercise: Exercise) => {
    const newExercise: WorkoutExercise = {
      id: `ex-${Date.now()}`,
      exercise,
      sets: exercise.type === 'strength' 
        ? [{ id: `set-${Date.now()}-0`, completed: false }]
        : [{ id: `set-${Date.now()}-0`, completed: false }],
    };
    setWorkoutExercises([...workoutExercises, newExercise]);
    setShowExerciseSearch(false);
    setSearchQuery('');
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutExercises(workoutExercises.filter(ex => ex.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    setWorkoutExercises(workoutExercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: Set = {
          id: `set-${Date.now()}`,
          reps: lastSet?.reps,
          weight: lastSet?.weight,
          distance: lastSet?.distance,
          time: lastSet?.time,
          completed: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setWorkoutExercises(workoutExercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: any) => {
    setWorkoutExercises(workoutExercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setWorkoutExercises(workoutExercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
        };
      }
      return ex;
    }));
  };

  const filteredExercises = EXERCISE_DATABASE.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedExercises = filteredExercises.reduce((acc, ex) => {
    const category = ex.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(ex);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const getElapsedTime = () => {
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    if (isTemplateMode) {
      // In template mode, show the save template modal
      setShowSaveTemplateModal(true);
    } else {
      // In workout mode, navigate to completion
      navigate('/workout/complete', { 
        state: { 
          workoutExercises,
          duration: getElapsedTime()
        } 
      });
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    // In a real app, this would save to a database
    // For now, navigate back to templates page
    navigate('/workout/templates');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(isTemplateMode ? '/workout/templates' : '/')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center flex-1">
            <h1 className="font-bold">{isTemplateMode ? 'Create Template' : 'Workout'}</h1>
            {!isTemplateMode && <p className="text-xs text-neutral-400">{getElapsedTime()}</p>}
            {isTemplateMode && <p className="text-xs text-neutral-400">{templateName || 'New Template'}</p>}
          </div>
          <button
            onClick={handleFinish}
            disabled={workoutExercises.length === 0}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-neutral-700 disabled:text-neutral-500 rounded-lg font-semibold text-sm transition-colors"
          >
            {isTemplateMode ? 'Save' : 'Finish'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {workoutExercises.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell size={48} className="mx-auto mb-4 text-neutral-600" />
            <h2 className="text-xl font-bold mb-2">No exercises yet</h2>
            <p className="text-neutral-400 mb-6">Add your first exercise to get started</p>
            <button
              onClick={() => setShowExerciseSearch(true)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              Add Exercise
            </button>
          </div>
        ) : (
          <>
            {workoutExercises.map((workoutEx, idx) => (
              <div key={workoutEx.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                {/* Exercise Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-orange-400">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{workoutEx.exercise.name}</h3>
                      <p className="text-xs text-neutral-400">{workoutEx.exercise.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExercise(workoutEx.id)}
                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Sets Header */}
                <div className="grid grid-cols-12 gap-2 mb-2 px-2">
                  <div className="col-span-2 text-xs text-neutral-500 font-medium">SET</div>
                  {workoutEx.exercise.type === 'strength' ? (
                    <>
                      <div className="col-span-4 text-xs text-neutral-500 font-medium text-center">REPS</div>
                      <div className="col-span-4 text-xs text-neutral-500 font-medium text-center">WEIGHT</div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-4 text-xs text-neutral-500 font-medium text-center">DISTANCE</div>
                      <div className="col-span-4 text-xs text-neutral-500 font-medium text-center">TIME</div>
                    </>
                  )}
                  <div className="col-span-2"></div>
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  {workoutEx.sets.map((set, setIdx) => (
                    <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-2 flex items-center justify-center">
                        <button
                          onClick={() => toggleSetComplete(workoutEx.id, set.id)}
                          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${
                            set.completed
                              ? 'bg-cyan-500 border-cyan-500'
                              : 'border-neutral-600 hover:border-neutral-500'
                          }`}
                        >
                          {set.completed && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M3 8L7 12L13 4"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      {workoutEx.exercise.type === 'strength' ? (
                        <>
                          <div className="col-span-4">
                            <input
                              type="number"
                              value={set.reps || ''}
                              onChange={(e) => updateSet(workoutEx.id, set.id, 'reps', parseInt(e.target.value) || undefined)}
                              placeholder="0"
                              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-center focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              value={set.weight || ''}
                              onChange={(e) => updateSet(workoutEx.id, set.id, 'weight', parseInt(e.target.value) || undefined)}
                              placeholder="0"
                              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-center focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-4">
                            <input
                              type="number"
                              step="0.1"
                              value={set.distance || ''}
                              onChange={(e) => updateSet(workoutEx.id, set.id, 'distance', parseFloat(e.target.value) || undefined)}
                              placeholder="0.0"
                              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-center focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="text"
                              value={set.time || ''}
                              onChange={(e) => updateSet(workoutEx.id, set.id, 'time', e.target.value)}
                              placeholder="00:00"
                              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-center focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </>
                      )}
                      
                      <div className="col-span-2 flex justify-center">
                        {workoutEx.sets.length > 1 && (
                          <button
                            onClick={() => removeSet(workoutEx.id, set.id)}
                            className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-500 hover:text-red-400"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Set Button */}
                <button
                  onClick={() => addSet(workoutEx.id)}
                  className="w-full mt-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Set
                </button>
              </div>
            ))}

            {/* Add Exercise Button */}
            <button
              onClick={() => setShowExerciseSearch(true)}
              className="w-full py-4 bg-neutral-900 border-2 border-dashed border-neutral-700 hover:border-orange-500 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-neutral-400 hover:text-orange-400"
            >
              <Plus size={20} />
              Add Exercise
            </button>
          </>
        )}
      </div>

      {/* Exercise Search Modal */}
      {showExerciseSearch && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-4 border-t sm:border border-neutral-800 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold">Add Exercise</h2>
              <button
                onClick={() => {
                  setShowExerciseSearch(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-neutral-800">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.entries(groupedExercises).map(([category, exercises]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-neutral-400 mb-2 px-2">{category}</h3>
                  <div className="space-y-1">
                    {exercises.map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={() => addExercise(exercise)}
                        className="w-full p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-left transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium">{exercise.name}</span>
                        <Plus size={18} className="text-cyan-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-4 border-t sm:border border-neutral-800 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold">Save Template</h2>
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Template Name */}
            <div className="p-4 border-b border-neutral-800">
              <div className="relative">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template Name"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="p-4">
              <button
                onClick={handleSaveTemplate}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}