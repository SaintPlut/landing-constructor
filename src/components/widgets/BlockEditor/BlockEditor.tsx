import React from 'react';
import { EditableBlock, LandingBlock } from '../../../types';
import { Input } from '../../ui';
import { ImageUploadWidget } from '../ImageUploadWidget/ImageUploadWidget';
import './BlockEditor.css';

interface BlockEditorProps {
  block: LandingBlock;
  templateBlock: EditableBlock;
  onContentChange: (blockId: string, content: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  templateBlock,
  onContentChange,
  onImageUpload,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}) => {
  const handleTextChange = (value: string) => {
    onContentChange(block.id, value);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const imageUrl = await onImageUpload(file);
    onContentChange(block.id, imageUrl);
    return imageUrl;
  };

  return (
    <div className="block-editor">
      <div className="block-header">
        <div className="block-info">
          <h4>{templateBlock.label}</h4>
          <div className="block-meta">
            <span className="block-type">
              {templateBlock.type === 'text' ? '📝 Текст' : '🖼️ Изображение'}
            </span>
            {templateBlock.required && (
              <span className="required-badge">Обязательно</span>
            )}
          </div>
        </div>
        
        <div className="block-actions">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="action-btn move-btn"
            title="Переместить вверх"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="action-btn move-btn"
            title="Переместить вниз"
          >
            ↓
          </button>
          {!templateBlock.required && (
            <button
              onClick={onDelete}
              className="action-btn delete-btn"
              title="Удалить блок"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="block-content">
        {templateBlock.type === 'text' ? (
          <div className="text-editor">
            <textarea
              value={block.content}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`Введите ${templateBlock.label.toLowerCase()}...`}
              className="text-input"
              rows={4}
            />
            {templateBlock.defaultValue && (
              <p className="default-value-hint">
                Пример: {templateBlock.defaultValue}
              </p>
            )}
          </div>
        ) : (
          <div className="image-editor">
            <ImageUploadWidget
              onImageUpload={handleImageUpload}
              initialImage={block.content || undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
};