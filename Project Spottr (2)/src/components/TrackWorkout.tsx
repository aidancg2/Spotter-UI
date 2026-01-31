import { useState } from 'react';
import { Plus, Check, X, Clock, Flame } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

const workoutTemplates = [
  { name: 'Push Day', exercises: ['Bench Press', 'Overhead Press', 'Incline Dumbbell Press', 'Lateral Raises', 'Tricep Dips'] },
  { name: 'Pull Day', exercises: ['Deadlift', 'Pull-ups', 'Barbell Rows', 'Face Pulls', 'Bicep Curls'] },
  { name: 'Leg Day', exercises: ['Squats', 'Romanian Deadlifts', 'Leg Press', 'Leg Curls', 'Calf Raises'] },
];

export function TrackWorkout() {
  const [isTracking, setIsTracking] = useState(false);
  const [workoutStartTime] = useState(new Date());
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const startWorkout = () => {
    setIsTracking(true);
  };

  const finishWorkout = () => {
    // Calculate workout stats
    const duration = Math.floor((new Date().getTime() - workoutStartTime.getTime()) / 60000);
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = exercises.reduce(
      (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
      0
    );
    
    alert(`Workout Complete!\n\n🏋️ ${exercises.length} exercises\n✅ ${completedSets}/${totalSets} sets\n⏱️ ${duration} minutes`);
    
    setIsTracking(false);
    setExercises([]);
  };

  const loadTemplate = (template: typeof workoutTemplates[0]) => {
    const newExercises: Exercise[] = template.exercises.map((name, idx) => ({
      id: `ex-${Date.now()}-${idx}`,
      name,
      sets: [
        { id: `set-${Date.now()}-${idx}-0`, reps: 10, weight: 135, completed: false },
        { id: `set-${Date.now()}-${idx}-1`, reps: 10, weight: 135, completed: false },
        { id: `set-${Date.now()}-${idx}-2`, reps: 10, weight: 135, completed: false },
      ],
    }));
    setExercises(newExercises);
    setShowTemplates(false);
    setIsTracking(true);
  };

  const addExercise = () => {
    const name = prompt('Enter exercise name:');
    if (!name) return;
    
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name,
      sets: [
        { id: `set-${Date.now()}-0`, reps: 10, weight: 0, completed: false },
      ],
    };
    setExercises([...exercises, newExercise]);
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [
            ...ex.sets,
            { id: `set-${Date.now()}`, reps: lastSet.reps, weight: lastSet.weight, completed: false },
          ],
        };
      }
      return ex;
    }));
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s),
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s),
        };
      }
      return ex;
    }));
  };

  if (!isTracking) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <Flame size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Ready to Train?</h2>
          <p className="text-neutral-400">Start a new workout or choose a template</p>
        </div>

        {showTemplates ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Workout Templates</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {workoutTemplates.map((template) => (
              <button
                key={template.name}
                onClick={() => loadTemplate(template)}
                className="w-full p-4 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg text-left transition-colors"
              >
                <div className="font-semibold mb-2">{template.name}</div>
                <div className="text-sm text-neutral-400">
                  {template.exercises.length} exercises
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={startWorkout}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold transition-all"
            >
              Start Empty Workout
            </button>
            
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full py-4 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg font-semibold transition-colors"
            >
              Choose Template
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 p-6 bg-neutral-800/50 border border-neutral-700 rounded-lg">
          <h3 className="font-semibold mb-4">This Week</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">4</div>
              <div className="text-xs text-neutral-400">Workouts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">196</div>
              <div className="text-xs text-neutral-400">Total Sets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">5.2h</div>
              <div className="text-xs text-neutral-400">Total Time</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);

  return (
    <div className="max-w-lg mx-auto">
      {/* Workout Header */}
      <div className="sticky top-16 z-40 bg-neutral-900 border-b border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-cyan-400" />
            <span className="font-semibold">Active Workout</span>
          </div>
          <button
            onClick={finishWorkout}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
          >
            Finish
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-neutral-400">
              {Math.floor((new Date().getTime() - workoutStartTime.getTime()) / 60000)}m
            </span>
          </div>
          <div className="text-neutral-400">
            {completedSets}/{totalSets} sets
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4 space-y-4">
        {exercises.map((exercise, exIdx) => (
          <div key={exercise.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
            <div className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                {exIdx + 1}
              </span>
              {exercise.name}
            </div>
            
            {/* Sets Header */}
            <div className="grid grid-cols-[80px_80px_80px_50px] gap-2 text-xs text-neutral-400 mb-2 px-2">
              <div>Weight (lbs)</div>
              <div>Reps</div>
              <div>Previous</div>
              <div></div>
            </div>

            {/* Sets */}
            <div className="space-y-2">
              {exercise.sets.map((set, setIdx) => (
                <div key={set.id} className="grid grid-cols-[80px_80px_80px_50px] gap-2 items-center">
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(exercise.id, set.id, 'weight', Number(e.target.value))}
                    className="px-2 py-2 bg-neutral-700 border border-neutral-600 rounded text-sm text-center"
                    disabled={set.completed}
                  />
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(exercise.id, set.id, 'reps', Number(e.target.value))}
                    className="px-2 py-2 bg-neutral-700 border border-neutral-600 rounded text-sm text-center"
                    disabled={set.completed}
                  />
                  <div className="text-xs text-neutral-500 text-center">
                    {set.weight} × {set.reps}
                  </div>
                  <button
                    onClick={() => toggleSetComplete(exercise.id, set.id)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      set.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                    }`}
                  >
                    {set.completed ? <Check size={20} /> : setIdx + 1}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addSet(exercise.id)}
              className="w-full mt-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-semibold transition-colors"
            >
              Add Set
            </button>
          </div>
        ))}

        <button
          onClick={addExercise}
          className="w-full py-4 bg-cyan-500/10 hover:bg-cyan-500/20 border-2 border-dashed border-cyan-500/30 rounded-lg font-semibold text-cyan-400 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Exercise
        </button>
      </div>
    </div>
  );
}