import React, { useState, useCallback } from 'react';
import './ImageUploadWidget.css';

interface ImageUploadWidgetProps {
  onImageUpload: (file: File) => Promise<string>;
  initialImage?: string;
  disabled?: boolean;
  className?: string;
}

export const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  onImageUpload,
  initialImage,
  disabled = false,
  className = '',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || disabled) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await onImageUpload(file);
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      alert('Ошибка при загрузке изображения');
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload, disabled]);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      try {
        const imageUrl = await onImageUpload(file);
        setPreviewUrl(imageUrl);
      } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
        alert('Ошибка при загрузке изображения');
      } finally {
        setIsUploading(false);
      }
    }
  }, [onImageUpload, disabled, isUploading]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className={`image-upload-widget ${className}`}>
      <div
        className={`upload-area ${isUploading ? 'uploading' : ''} ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl ? (
          <div className="preview-container">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            {!disabled && (
              <div className="overlay">
                <span>Изменить изображение</span>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            {isUploading ? (
              <div className="loading">Загрузка...</div>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <p>Перетащите изображение или нажмите для выбора</p>
              </>
            )}
          </div>
        )}
        
        {!disabled && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="file-input"
          />
        )}
      </div>
    </div>
  );
};