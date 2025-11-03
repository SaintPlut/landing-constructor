import React, { useState } from 'react';
import { Template } from '../../../types';
import { Button } from '../../ui';
import './QuickCreateWidget.css';

export interface QuickCreateWidgetProps {
  /** Доступные шаблоны */
  templates: Template[];
  /** Callback при создании лендинга */
  onCreateLanding: (template: Template) => void;
  /** Заголовок виджета */
  title?: string;
  /** CSS класс */
  className?: string;
}

export const QuickCreateWidget: React.FC<QuickCreateWidgetProps> = ({
  templates,
  onCreateLanding,
  title = 'Быстрое создание лендинга',
  className = '',
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleCreate = () => {
    if (selectedTemplate) {
      onCreateLanding(selectedTemplate);
    }
  };

  const freeTemplates = templates.filter(template => template.price === 0);

  return (
    <div className={`quick-create-widget ${className}`}>
      <div className="widget-header">
        <h3>{title}</h3>
        <p>Выберите шаблон и создайте лендинг в один клик</p>
      </div>

      <div className="widget-content">
        {freeTemplates.length > 0 ? (
          <>
            <div className="templates-grid">
              {freeTemplates.slice(0, 3).map(template => (
                <div
                  key={template.id}
                  className={`template-option ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="template-image">
                    <img src={template.thumbnail} alt={template.name} />
                    <div className="template-badge">Бесплатно</div>
                  </div>
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <p className="template-description">{template.description}</p>
                    <div className="template-stats">
                      <span>{template.editableBlocks.length} блоков</span>
                      <span>•</span>
                      <span>{template.keywords.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="widget-actions">
              <Button
                onClick={handleCreate}
                disabled={!selectedTemplate}
                className="create-btn"
              >
                {selectedTemplate 
                  ? `Создать лендинг "${selectedTemplate.name}"`
                  : 'Выберите шаблон'
                }
              </Button>
              
              <div className="widget-hint">
                ⚡ Лендинг будет создан мгновенно с настройками по умолчанию
              </div>
            </div>
          </>
        ) : (
          <div className="no-templates">
            <p>Нет доступных бесплатных шаблонов</p>
            <Button 
              onClick={() => document.querySelector('.search-section')?.scrollIntoView({ behavior: 'smooth' })}
              variant="secondary"
            >
              Посмотреть все шаблоны
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};