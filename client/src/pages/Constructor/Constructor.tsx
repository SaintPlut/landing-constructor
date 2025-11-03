import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanding } from '../../hooks/useLanding';
import { BlockEditor } from '../../components/widgets/BlockEditor/BlockEditor';
import { Button, LoadingSpinner } from '../../components';
import { simulateImageUpload } from '../../../utils/helpers';
import './Constructor.css';

export const Constructor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [localLanding, setLocalLanding] = useState<any>(null);
  
  const {
    landing,
    template,
    loading,
    error,
    updateBlockContent,
    reorderBlocks,
    deleteBlock,
    updateLanding,
    refetch,
  } = useLanding(id);

  // Отладочная информация
  useEffect(() => {
    console.log('Constructor Debug:');
    console.log('Landing ID:', id);
    console.log('Landing data:', landing);
    console.log('Template data:', template);
  }, [id, landing, template]);

  // Синхронизируем локальное состояние с данными из хука
  useEffect(() => {
    if (landing) {
      setLocalLanding(landing);
    }
  }, [landing]);

  const handleImageUpload = async (file: File): Promise<string> => {
    return await simulateImageUpload(file);
  };

  const handleContentChange = async (blockId: string, content: string) => {
    if (!localLanding) return;

    // Сразу обновляем локальное состояние для мгновенного отображения
    const updatedBlocks = localLanding.blocks.map((block: any) =>
      block.id === blockId ? { ...block, content } : block
    );
    
    setLocalLanding({
      ...localLanding,
      blocks: updatedBlocks,
    });

    // Затем сохраняем на сервер
    try {
      await updateBlockContent(blockId, content);
      console.log('Блок успешно сохранен:', blockId);
    } catch (err: any) {
      console.error('Ошибка сохранения блока:', err);
      alert(`Ошибка сохранения: ${err.message || 'Неизвестная ошибка'}`);
      // В случае ошибки возвращаем предыдущее состояние
      if (landing) {
        setLocalLanding(landing);
      }
    }
  };

  const handleSave = async () => {
    if (!localLanding) return;

    setSaving(true);
    try {
      await updateLanding({
        name: localLanding.name,
        blocks: localLanding.blocks,
      });
      alert('Лендинг успешно сохранен!');
      await refetch(); // Обновляем данные после сохранения
    } catch (err: any) {
      console.error('Ошибка сохранения:', err);
      alert(`Ошибка при сохранении лендинга: ${err.message || 'Неизвестная ошибка'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBlockMove = async (blockId: string, direction: 'up' | 'down') => {
    if (!localLanding) return;

    const currentIndex = localLanding.blocks.findIndex((block: any) => block.id === blockId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < localLanding.blocks.length) {
      // Сразу обновляем локальное состояние
      const newBlocks = [...localLanding.blocks];
      const [movedBlock] = newBlocks.splice(currentIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      const reorderedBlocks = newBlocks.map((block: any, index: number) => ({
        ...block,
        order: index,
      }));

      setLocalLanding({
        ...localLanding,
        blocks: reorderedBlocks,
      });

      // Затем сохраняем на сервер
      try {
        await reorderBlocks(currentIndex, newIndex);
        console.log('Блок перемещен:', blockId, direction);
      } catch (err: any) {
        console.error('Ошибка перемещения:', err);
        alert(`Ошибка перемещения: ${err.message || 'Неизвестная ошибка'}`);
        // Возвращаем предыдущее состояние при ошибке
        if (landing) {
          setLocalLanding(landing);
        }
      }
    }
  };

  const handleBlockDelete = async (blockId: string) => {
    if (!localLanding) return;

    // Находим шаблонный блок чтобы проверить можно ли удалять
    const templateBlock = template?.editableBlocks.find(tb => tb.id === blockId);
    if (templateBlock?.required) {
      alert('Этот блок обязательный и не может быть удален');
      return;
    }

    if (window.confirm('Вы уверены, что хотите удалить этот блок?')) {
      // Сразу обновляем локальное состояние
      const updatedBlocks = localLanding.blocks.filter((block: any) => block.id !== blockId);
      
      setLocalLanding({
        ...localLanding,
        blocks: updatedBlocks,
      });

      // Затем сохраняем на сервер
      try {
        await deleteBlock(blockId);
        console.log('Блок удален:', blockId);
      } catch (err: any) {
        console.error('Ошибка удаления:', err);
        alert(`Ошибка удаления: ${err.message || 'Неизвестная ошибка'}`);
        // Возвращаем предыдущее состояние при ошибке
        if (landing) {
          setLocalLanding(landing);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <LoadingSpinner size="large" />
        <p>Загрузка конструктора...</p>
      </div>
    );
  }

  if (error || !landing || !template) {
    return (
      <div className="error-state">
        <h2>Лендинг не найден</h2>
        <p>{(error as any)?.message || 'Запрошенный лендинг не существует'}</p>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/" className="back-btn" style={{ 
            display: 'inline-block', 
            padding: '0.75rem 1.5rem', 
            background: '#3498db', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '6px'
          }}>
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    );
  }

  // Используем локальное состояние для отображения
  const sortedBlocks = localLanding 
    ? [...localLanding.blocks].sort((a: any, b: any) => a.order - b.order)
    : [];

  return (
    <div className="constructor">
      <div className="constructor-header">
        <nav className="breadcrumb">
          <Link to="/">Каталог шаблонов</Link>
          <span> / </span>
          <Link to={`/template/${template.id}`}>{template.name}</Link>
          <span> / </span>
          <span>Конструктор</span>
        </nav>

        <div className="header-actions">
          <h1>Конструктор лендинга</h1>
          <div className="action-buttons">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="save-btn"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
            <Link to="/" className="back-link">
              В каталог
            </Link>
          </div>
        </div>

        <div className="landing-info">
          <h2>{localLanding?.name || landing.name}</h2>
          <p>Создан на основе шаблона "{template.name}"</p>
          <p className="created-date">
            Создан: {new Date(landing.createdAt).toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>

      <div className="constructor-content">
        <div className="blocks-editor">
          <h3>Редактирование блоков</h3>
          <p className="editor-description">
            Редактируйте содержимое блоков, меняйте их порядок или удаляйте ненужные
            {sortedBlocks.some((block: any) => {
              const templateBlock = template.editableBlocks.find(tb => tb.id === block.id);
              return !templateBlock?.required;
            }) && ' (необязательные блоки можно удалить)'}
          </p>

          <div className="blocks-list">
            {sortedBlocks.map((block: any, index: number) => {
              const templateBlock = template.editableBlocks.find(tb => tb.id === block.id);
              if (!templateBlock) {
                console.warn('Блок не найден в шаблоне:', block.id);
                return null;
              }

              return (
                <BlockEditor
                  key={block.id}
                  block={block}
                  templateBlock={templateBlock}
                  onContentChange={handleContentChange}
                  onImageUpload={handleImageUpload}
                  onMoveUp={() => handleBlockMove(block.id, 'up')}
                  onMoveDown={() => handleBlockMove(block.id, 'down')}
                  onDelete={templateBlock.required ? undefined : () => handleBlockDelete(block.id)}
                  canMoveUp={index > 0}
                  canMoveDown={index < sortedBlocks.length - 1}
                />
              );
            })}
          </div>
        </div>

        <div className="preview-section">
          <h3>Предпросмотр</h3>
          <div className="preview-content">
            {sortedBlocks.length === 0 ? (
              <div className="no-blocks">
                <p>Нет блоков для отображения</p>
              </div>
            ) : (
              sortedBlocks.map((block: any) => (
                <div key={block.id} className="preview-block">
                  {block.type === 'text' ? (
                    <div className="preview-text">
                      {block.content ? (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{block.content}</div>
                      ) : (
                        <em>Текст не введен</em>
                      )}
                    </div>
                  ) : (
                    <div className="preview-image">
                      {block.content ? (
                        <img src={block.content} alt="Preview" style={{ maxWidth: '100%', borderRadius: '4px' }} />
                      ) : (
                        <div className="no-image">
                          <span>Изображение не загружено</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};