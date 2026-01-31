import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Plus, Dumbbell, Clock, Zap } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  exercises: number;
  estimatedTime: string;
  lastUsed?: string;
}

// Mock templates
const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps',
    exercises: 4,
    estimatedTime: '1h 15m',
    lastUsed: '2 days ago'
  },
  {
    id: '2',
    name: 'Leg Day',
    description: 'Quads, hamstrings, and calves',
    exercises: 4,
    estimatedTime: '1h 20m',
    lastUsed: '4 days ago'
  },
  {
    id: '3',
    name: 'Pull Day',
    description: 'Back and biceps',
    exercises: 4,
    estimatedTime: '1h 25m',
    lastUsed: '6 days ago'
  },
  {
    id: '4',
    name: 'Upper Body',
    description: 'Full upper body workout',
    exercises: 4,
    estimatedTime: '1h 30m',
    lastUsed: '1 week ago'
  },
  {
    id: '5',
    name: 'Full Body',
    description: 'Total body conditioning',
    exercises: 6,
    estimatedTime: '1h 45m',
    lastUsed: '2 weeks ago'
  },
  {
    id: '6',
    name: 'HIIT Cardio',
    description: 'High intensity interval training',
    exercises: 5,
    estimatedTime: '30m',
    lastUsed: '3 weeks ago'
  }
];

export function TemplateSelector() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const filteredTemplates = MOCK_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/workout/template/${templateId}`);
  };

  const handleCreateTemplate = () => {
    // Navigate to template creation mode
    setShowCreateModal(false);
    setNewTemplateName('');
    navigate('/workout/new/template', { state: { templateName: newTemplateName } });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">Workout Templates</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Create New Template Card */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full mb-6 p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/30 hover:border-orange-500/50 rounded-xl transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-bold text-lg mb-1">Create New Template</h3>
              <p className="text-sm text-neutral-400">Build a custom workout routine</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Plus size={24} />
            </div>
          </div>
        </button>

        {/* Templates List */}
        <div className="space-y-3">
          <h2 className="font-semibold text-neutral-400 text-sm mb-3">YOUR TEMPLATES</h2>
          
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell size={48} className="mx-auto mb-4 text-neutral-600" />
              <h3 className="font-semibold mb-2">No templates found</h3>
              <p className="text-sm text-neutral-400">Try a different search term</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className="w-full p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{template.name}</h3>
                    <p className="text-sm text-neutral-400">{template.description}</p>
                  </div>
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                    <Dumbbell size={20} className="text-cyan-400" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Zap size={14} />
                    <span>{template.exercises} exercises</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{template.estimatedTime}</span>
                  </div>
                  {template.lastUsed && (
                    <div className="ml-auto text-cyan-400">
                      {template.lastUsed}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold">Create Template</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewTemplateName('');
                }}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Template Name</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., Push Day, Leg Day..."
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              <div className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
                <p className="text-sm text-neutral-400">
                  You'll be able to add exercises and configure sets after creating the template.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTemplateName('');
                  }}
                  className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  disabled={!newTemplateName.trim()}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-700 disabled:text-neutral-500 rounded-lg font-semibold transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}