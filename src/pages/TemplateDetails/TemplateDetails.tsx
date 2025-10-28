import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Template } from '../../types';
import { templatesApi, landingsApi } from '../../services/api';
import { Button, LoadingSpinner } from '../../components';
import { useApi } from '../../hooks/useApi';
import './TemplateDetails.css';

export const TemplateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  
  const { data: template, loading, error, execute } = useApi<Template>();

  useEffect(() => {
    if (id) {
      execute(() => templatesApi.getById(id));
    }
  }, [id, execute]);

  const handleCreateLanding = async () => {
    if (!template) return;

    setCreating(true);
    try {
      const landingData = {
        templateId: template.id,
        name: `Лендинг: ${template.name}`,
        createdAt: new Date().toISOString(),
        blocks: template.editableBlocks.map((block, index) => ({
          id: block.id,
          type: block.type,
          content: block.defaultValue,
          order: index,
        })),
      };

      const landing = await landingsApi.create(landingData);
      navigate(`/constructor/${landing.id}`);
    } catch (err) {
      console.error('Ошибка при создании лендинга:', err);
      alert('Не удалось создать лендинг');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <LoadingSpinner size="large" />
        <p>Загрузка шаблона...</p>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="error-state">
        <h2>Шаблон не найден</h2>
        <p>{error?.message || 'Запрошенный шаблон не существует'}</p>
        <Link to="/" className="back-btn">
          Вернуться к каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="template-details">
      <nav className="breadcrumb">
        <Link to="/">Каталог шаблонов</Link>
        <span> / </span>
        <span>{template.name}</span>
      </nav>

      <div className="template-header">
        <div className="template-image">
          <img src={template.thumbnail} alt={template.name} />
          {template.price === 0 && (
            <div className="price-badge free">Бесплатно</div>
          )}
          {template.price > 0 && (
            <div className="price-badge paid">{template.price} ₽</div>
          )}
        </div>
        
        <div className="template-info">
          <h1>{template.name}</h1>
          <p className="template-description">{template.description}</p>
          
          <div className="template-meta">
            <div className="meta-grid">
              <div className="meta-item">
                <strong>Автор:</strong>
                <span>{template.author}</span>
              </div>
              <div className="meta-item">
                <strong>Лицензия:</strong>
                <span>{template.license}</span>
              </div>
              <div className="meta-item">
                <strong>Блоков для редактирования:</strong>
                <span>{template.editableBlocks.length}</span>
              </div>
            </div>
          </div>

          <div className="action-section">
            <Button
              onClick={handleCreateLanding}
              disabled={creating}
              className="create-btn"
            >
              {creating ? 'Создание...' : 'Создать лендинг'}
            </Button>
            <p className="action-hint">
              Нажмите чтобы создать лендинг на основе этого шаблона
            </p>
          </div>
        </div>
      </div>

      <div className="template-content">
        <section className="blocks-section">
          <h2>Редактируемые блоки</h2>
          <div className="blocks-list">
            {template.editableBlocks.map(block => (
              <div key={block.id} className="block-item">
                <div className="block-icon">
                  {block.type === 'text' ? '📝' : '🖼️'}
                </div>
                <div className="block-info">
                  <h4>{block.label}</h4>
                  <p>Тип: {block.type === 'text' ? 'Текстовое поле' : 'Загрузка изображения'}</p>
                  {block.required && <span className="required-badge">Обязательный</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="keywords-section">
          <h3>Ключевые слова</h3>
          <div className="keywords-list">
            {template.keywords.map(keyword => (
              <span key={keyword} className="keyword-tag">#{keyword}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};