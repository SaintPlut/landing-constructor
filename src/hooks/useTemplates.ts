import { useState, useEffect, useCallback } from 'react';
import { Template, SearchFilters } from '../types';
import { templatesApi } from '../services/api';
import { useApi } from './useApi';

export const useTemplates = (initialFilters?: SearchFilters) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {
    name: '',
    keywords: '',
  });

  const { data: templates, loading, error, execute } = useApi<Template[]>();

  const loadTemplates = useCallback(async () => {
    if (filters.name || filters.keywords) {
      await execute(() => templatesApi.search(filters));
    } else {
      await execute(() => templatesApi.getAll());
    }
  }, [execute, filters]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates: templates || [],
    loading,
    error,
    filters,
    setFilters,
    refetch: loadTemplates,
  };
};

export const useTemplate = (id?: string) => {
  const { data: template, loading, error, execute } = useApi<Template>();

  const loadTemplate = useCallback(async (templateId: string) => {
    await execute(() => templatesApi.getById(templateId));
  }, [execute]);

  useEffect(() => {
    if (id) {
      loadTemplate(id);
    }
  }, [id, loadTemplate]);

  return {
    template: template || null,
    loading,
    error,
    refetch: () => id ? loadTemplate(id) : Promise.resolve(),
  };
};