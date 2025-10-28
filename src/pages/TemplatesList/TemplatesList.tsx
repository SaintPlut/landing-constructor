import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTemplates } from '../../hooks/useTemplates';
import { Input, LoadingSpinner } from '../../components';
import { SearchFilters } from '../../types';
import './TemplatesList.css';

export const TemplatesList: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    keywords: ''
  });

  const { templates, loading, error, refetch } = useTemplates(filters);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
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
        <h1>Каталог шаблонов лендингов</h1>
        <p>Выберите подходящий шаблон и создайте свой лендинг</p>
      </div>

      <div className="search-section">
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="name-search">Поиск по названию:</label>
            <Input
              id="name-search"
              type="search"
              placeholder="Введите название шаблона..."
              value={filters.name}
              onChange={(value) => handleFilterChange({ ...filters, name: value })}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="keywords-search">Поиск по ключевым словам:</label>
            <Input
              id="keywords-search"
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
          <div className="templates-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-image">
                  <img src={template.thumbnail} alt={template.name} />
                  {template.price === 0 && (
                    <span className="free-badge">Бесплатно</span>
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
                    <div className="meta-item price">
                      {template.price === 0 ? 'Бесплатно' : `${template.price} ₽`}
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
                    <div className="blocks-count">
                      {template.editableBlocks.length} редакт. блоков
                    </div>
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