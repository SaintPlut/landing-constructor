import { useState, useEffect, useCallback } from 'react';
import { Landing, Template } from '../types';
import { landingsApi, templatesApi } from '../services/api';
import { useApi } from './useApi';

export const useLanding = (landingId?: string) => {
  const { data: landing, loading, error, execute } = useApi<Landing>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const loadLanding = useCallback(async (id: string) => {
    try {
      const landingData = await execute(() => landingsApi.getById(id));
      
      if (landingData && landingData.templateId) {
        setTemplateLoading(true);
        setTemplateError(null);
        try {
          const templateData = await templatesApi.getById(landingData.templateId);
          setTemplate(templateData);
        } catch (err) {
          console.error('Ошибка загрузки шаблона:', err);
          setTemplateError('Не удалось загрузить шаблон');
        } finally {
          setTemplateLoading(false);
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки лендинга:', err);
    }
  }, [execute]);

  const updateLanding = useCallback(async (updates: Partial<Landing>) => {
    if (!landing) throw new Error('Лендинг не загружен');
    
    const updatedLanding = await landingsApi.update(landing.id, updates);
    return updatedLanding;
  }, [landing]);

  const updateBlockContent = useCallback(async (blockId: string, content: string) => {
    if (!landing) throw new Error('Лендинг не загружен');

    const updatedBlocks = landing.blocks.map(block =>
      block.id === blockId ? { ...block, content } : block
    );

    return await updateLanding({ blocks: updatedBlocks });
  }, [landing, updateLanding]);

  const reorderBlocks = useCallback(async (fromIndex: number, toIndex: number) => {
    if (!landing) throw new Error('Лендинг не загружен');

    const newBlocks = [...landing.blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);

    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index,
    }));

    return await updateLanding({ blocks: reorderedBlocks });
  }, [landing, updateLanding]);

  const deleteBlock = useCallback(async (blockId: string) => {
    if (!landing) throw new Error('Лендинг не загружен');

    const updatedBlocks = landing.blocks.filter(block => block.id !== blockId);
    return await updateLanding({ blocks: updatedBlocks });
  }, [landing, updateLanding]);

  useEffect(() => {
    if (landingId) {
      loadLanding(landingId);
    }
  }, [landingId, loadLanding]);

  return {
    landing: landing || null,
    template,
    loading: loading || templateLoading,
    error: error || templateError,
    updateBlockContent,
    reorderBlocks,
    deleteBlock,
    updateLanding,
    refetch: () => landingId ? loadLanding(landingId) : Promise.resolve(),
  };
};