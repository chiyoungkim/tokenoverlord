import { useState } from 'react';
import { Image, Edit, Trash2 } from 'lucide-react';
import { ModalWrapper } from './ModalWrapper';
import { ArtPickerModal } from './ArtPickerModal';
import { CustomTokenEditor } from './CustomTokenEditor';
import { COMMON_TOKENS } from '../types/token';
import { useTokenStore } from '../store/tokenStore';
import { getColorGradient } from '../utils/colors';

interface TokenTemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenTemplateManager: React.FC<TokenTemplateManagerProps> = ({ isOpen, onClose }) => {
  const { customTemplates, presetArtOverrides, removeTemplate, updatePresetArt, updateCustomTemplate } = useTokenStore();
  const [selectedTemplate, setSelectedTemplate] = useState<{ name: string; isPreset: boolean } | null>(null);
  const [editingCustom, setEditingCustom] = useState<string | null>(null);

  const handleArtSelect = (imageUrl: string) => {
    if (!selectedTemplate) return;
    
    if (selectedTemplate.isPreset) {
      updatePresetArt(selectedTemplate.name, imageUrl);
    } else {
      updateCustomTemplate(selectedTemplate.name, { imageUrl });
    }
  };

  const handleDeleteCustom = (name: string) => {
    if (window.confirm(`Delete custom template "${name}"?`)) {
      removeTemplate(name);
    }
  };

  const getTemplateImageUrl = (template: typeof COMMON_TOKENS[0]) => {
    return presetArtOverrides[template.name] || template.imageUrl;
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Manage Token Templates">
      <div className="space-y-6">
        {/* Preset Tokens */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Preset Tokens</h3>
          <p className="text-sm text-slate-400 mb-4">Change artwork only</p>
          <div className="grid grid-cols-2 gap-3">
            {COMMON_TOKENS.map((template) => {
              const imageUrl = getTemplateImageUrl(template);
              return (
                <div
                  key={template.name}
                  className="relative rounded-lg border border-slate-700 overflow-hidden group"
                >
                  <div
                    className="aspect-[2.5/2] flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      ...(imageUrl ? {
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : {
                        background: getColorGradient(template.colors),
                      }),
                    }}
                  >
                    {template.name}
                  </div>
                  <button
                    onClick={() => setSelectedTemplate({ name: template.name, isPreset: true })}
                    className="absolute top-2 right-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Change Art"
                  >
                    <Image size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Tokens */}
        <div>
          <h3 className="text-lg font-bold text-white mb-3">Custom Tokens</h3>
          <p className="text-sm text-slate-400 mb-4">Full editing available</p>
          {customTemplates.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No custom tokens yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {customTemplates.map((template) => (
                <div
                  key={template.name}
                  className="relative rounded-lg border border-slate-700 overflow-hidden group"
                >
                  <div
                    className="aspect-[2.5/2] flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      ...(template.imageUrl ? {
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${template.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : {
                        background: getColorGradient(template.colors),
                      }),
                    }}
                  >
                    {template.name}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedTemplate({ name: template.name, isPreset: false })}
                      className="p-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                      title="Change Art"
                    >
                      <Image size={16} />
                    </button>
                    <button
                      onClick={() => setEditingCustom(template.name)}
                      className="p-1.5 bg-amber-600 hover:bg-amber-700 rounded-lg"
                      title="Edit Token"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCustom(template.name)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg"
                      title="Delete Token"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Art Picker Modal */}
      {selectedTemplate && (
        <ArtPickerModal
          tokenName={selectedTemplate.name}
          currentImageUrl={
            selectedTemplate.isPreset
              ? getTemplateImageUrl(COMMON_TOKENS.find(t => t.name === selectedTemplate.name)!)
              : customTemplates.find(t => t.name === selectedTemplate.name)?.imageUrl
          }
          onSelect={handleArtSelect}
          onClose={() => setSelectedTemplate(null)}
        />
      )}

      {/* Custom Token Editor */}
      {editingCustom && (
        <CustomTokenEditor
          tokenName={editingCustom}
          onOpenArtPicker={() => setSelectedTemplate({ name: editingCustom, isPreset: false })}
          onClose={() => setEditingCustom(null)}
        />
      )}
    </ModalWrapper>
  );
};