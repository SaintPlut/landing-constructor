import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTemplates } from '../../hooks/useTemplates';
import { Input, LoadingSpinner } from '../../components';
import { QuickCreateWidget } from '../../components/widgets';
import { SearchFilters } from '../../types';
import { landingsApi } from '../../services/api';
import './TemplatesList.css';

export const TemplatesList: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    keywords: ''
  });
  const navigate = useNavigate();

  const { templates, loading, error, refetch } = useTemplates(filters);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  // Функция для быстрого создания лендинга
  const handleQuickCreate = async (template: any) => {
    try {
      const landingData = {
        templateId: template.id,
        name: `Мой лендинг: ${template.name}`,
        createdAt: new Date().toISOString(),
        blocks: template.editableBlocks.map((block: any, index: number) => ({
          id: block.id,
          type: block.type,
          content: block.defaultValue,
          order: index,
        })),
        type: 'landing' as const,
        description: `Создан на основе "${template.name}"`,
        thumbnail: template.thumbnail,
      };

      const landing = await landingsApi.create(landingData);
      navigate(`/constructor/${landing.id}`);
    } catch (err: any) {
      console.error('Ошибка создания лендинга:', err);
      alert(`Не удалось создать лендинг: ${err.message || 'Неизвестная ошибка'}`);
    }
  };

  if (error) {
    return (
      <div className="error-state">
        <h2>Произошла ошибка</h2>
        <p>{error.message}</p>
        <button onClick={refetch} className="retry-btn">
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="templates-list">
      <div className="page-header">
        <h1>Конструктор лендингов</h1>
        <p>Создавайте профессиональные лендинги без программирования</p>
      </div>

      {/* Виджет быстрого создания */}
      <QuickCreateWidget
        templates={templates}
        onCreateLanding={handleQuickCreate}
        title="Начните создание лендинга"
        className="main-quick-create"
      />

      <div className="search-section">
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="name-search">Поиск по названию:</label>
            <Input
              type="search"
              placeholder="Введите название шаблона..."
              value={filters.name}
              onChange={(value) => handleFilterChange({ ...filters, name: value })}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="keywords-search">Поиск по ключевым словам:</label>
            <Input
              type="search"
              placeholder="Введите ключевые слова..."
              value={filters.keywords}
              onChange={(value) => handleFilterChange({ ...filters, keywords: value })}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <LoadingSpinner size="large" />
          <p>Загрузка шаблонов...</p>
        </div>
      ) : (
        <>
          <div className="catalog-info">
            <p>Найдено шаблонов: {templates.length}</p>
          </div>

          <div className="templates-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-image">
                  <img src={template.thumbnail} alt={template.name} />
                  {template.price === 0 && (
                    <span className="free-badge">Бесплатно</span>
                  )}
                  {template.price > 0 && (
                    <span className="paid-badge">{template.price} ₽</span>
                  )}
                </div>
                <div className="template-content">
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-description">{template.description}</p>
                  
                  <div className="template-meta">
                    <div className="meta-item">
                      <strong>Автор:</strong> {template.author}
                    </div>
                    <div className="meta-item">
                      <strong>Лицензия:</strong> {template.license}
                    </div>
                    <div className="meta-item">
                      <strong>Блоков:</strong> {template.editableBlocks.length}
                    </div>
                  </div>

                  <div className="template-keywords">
                    {template.keywords.map(keyword => (
                      <span key={keyword} className="keyword-tag">#{keyword}</span>
                    ))}
                  </div>

                  <div className="template-actions">
                    <Link to={`/template/${template.id}`} className="view-details-btn">
                      Подробнее
                    </Link>
                    {template.price === 0 && (
                      <button 
                        onClick={() => handleQuickCreate(template)}
                        className="quick-create-btn"
                      >
                        Быстрое создание
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="empty-state">
              <h3>Шаблоны не найдены</h3>
              <p>Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};