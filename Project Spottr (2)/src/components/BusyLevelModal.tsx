import { X, Users } from 'lucide-react';

interface BusyLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (level: string) => void;
  gymName?: string;
}

const busyLevels = [
  {
    value: 'not-crowded',
    label: 'Not crowded',
    description: 'Plenty of space',
    icon: '1',
  },
  {
    value: 'not-too-crowded',
    label: 'Not too crowded',
    description: 'Some equipment available',
    icon: '2',
  },
  {
    value: 'moderately-crowded',
    label: 'Moderately crowded',
    description: 'Limited equipment',
    icon: '3',
  },
  {
    value: 'very-crowded',
    label: 'Very crowded',
    description: 'Most equipment in use',
    icon: '4',
  },
  {
    value: 'at-capacity',
    label: 'At capacity',
    description: 'All equipment in use',
    icon: '5',
  },
];

export function BusyLevelModal({ isOpen, onClose, onSubmit, gymName }: BusyLevelModalProps) {
  if (!isOpen) return null;

  const handleSelect = (level: string) => {
    onSubmit(level);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-neutral-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-4 border-t sm:border border-neutral-800 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold">How busy is it?</h2>
            {gymName && <p className="text-sm text-neutral-400 mt-1">{gymName}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {busyLevels.map((level, index) => (
            <button
              key={level.value}
              onClick={() => handleSelect(level.value)}
              className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-4 group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                index === 0 ? 'bg-green-500/20 text-green-400' :
                index === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                index === 2 ? 'bg-orange-500/20 text-orange-400' :
                index === 3 ? 'bg-red-500/20 text-red-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                <Users size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{level.label}</div>
                <div className="text-sm text-neutral-400">{level.description}</div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-cyan-400">
                  <path d="M7 10l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-semibold transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
