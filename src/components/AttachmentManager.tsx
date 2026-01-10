import { useState } from 'react';
import { X, Search, Plus, Trash2 } from 'lucide-react';
import type { Token, Attachment } from '../types/token';
import { searchCards, getCardArtUrl, getCardOracleText } from '../services/scryfall';

interface AttachmentManagerProps {
  token: Token;
  isOpen: boolean;
  onClose: () => void;
  onAddAttachment: (attachment: Attachment) => void;
  onRemoveAttachment: (attachmentName: string) => void;
}

export const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  token,
  isOpen,
  onClose,
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      // Search for auras and equipment
      const results = await searchCards(`${searchQuery} (t:aura or t:equipment)`, false);
      setSearchResults(results.slice(0, 10));
    } catch (error) {
      console.error('Error searching attachments:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = (card: any) => {
    const attachment: Attachment = {
      name: card.name,
      effect: getCardOracleText(card) || '',
      imageUrl: getCardArtUrl(card) || undefined,
    };
    onAddAttachment(attachment);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Manage Attachments</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Current Attachments */}
        {token.attachments && token.attachments.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Current Attachments</h4>
            <div className="space-y-2">
              {token.attachments.map((attachment) => (
                <div
                  key={attachment.name}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-white">{attachment.name}</div>
                    <div className="text-xs text-slate-400 line-clamp-1">{attachment.effect}</div>
                  </div>
                  <button
                    onClick={() => onRemoveAttachment(attachment.name)}
                    className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg ml-2"
                  >
                    <Trash2 size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-2">Add Attachment</h4>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for aura or equipment..."
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 rounded-lg text-white font-medium"
            >
              {searching ? '...' : <Search size={20} />}
            </button>
          </div>

          {/* Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleAdd(card)}
                  className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{card.name}</div>
                    <div className="text-xs text-slate-400 line-clamp-1">
                      {getCardOracleText(card) || 'No text'}
                    </div>
                  </div>
                  <Plus size={16} className="text-indigo-400 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};