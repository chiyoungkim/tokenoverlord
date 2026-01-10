import { useState, useEffect } from 'react';
import { X, Search, Loader } from 'lucide-react';
import { searchCards, getCardArtUrl } from '../services/scryfall';

interface ArtPickerModalProps {
  tokenName: string;
  currentImageUrl?: string;
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

interface ArtOption {
  id: string;
  name: string;
  set_name: string;
  imageUrl: string;
}

export const ArtPickerModal: React.FC<ArtPickerModalProps> = ({
  tokenName,
  currentImageUrl,
  onSelect,
  onClose,
}) => {
  const [artOptions, setArtOptions] = useState<ArtOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(currentImageUrl || '');

  useEffect(() => {
    fetchArtOptions();
  }, [tokenName]);

  const fetchArtOptions = async () => {
    setLoading(true);
    try {
      // Strip P/T from name
      const cleanName = tokenName.replace(/^\d+\/\d+\s+/, '');
      const results = await searchCards(`${cleanName} t:token`, true);
      
      const options: ArtOption[] = results
        .map(card => {
          const imageUrl = getCardArtUrl(card);
          return imageUrl ? {
            id: card.id,
            name: card.name,
            set_name: card.set_name,
            imageUrl,
          } : null;
        })
        .filter((opt): opt is ArtOption => opt !== null);

      setArtOptions(options);
    } catch (error) {
      console.error('Error fetching art options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchCards(searchQuery, true);
      const options: ArtOption[] = results
        .map(card => {
          const imageUrl = getCardArtUrl(card);
          return imageUrl ? {
            id: card.id,
            name: card.name,
            set_name: card.set_name,
            imageUrl,
          } : null;
        })
        .filter((opt): opt is ArtOption => opt !== null);
      setArtOptions(options);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Select Art: {tokenName}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search Scryfall for different art..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Art Grid */}
        <div className="flex-1 overflow-y-auto mb-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : artOptions.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              No art found. Try searching for different terms.
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {artOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedUrl(option.imageUrl)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedUrl === option.imageUrl
                      ? 'border-indigo-500 ring-2 ring-indigo-500'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={option.imageUrl}
                    alt={option.name}
                    className="w-full aspect-[2.5/3.5] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">{option.set_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3">
          <p className="text-sm text-slate-400">
            {artOptions.length} option{artOptions.length !== 1 ? 's' : ''} available
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-white font-medium transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};