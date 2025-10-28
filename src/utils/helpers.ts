export const formatPrice = (price: number): string => {
  if (price === 0) return 'Бесплатно';
  return `${price} ₽`;
};

export const filterTemplates = (
  templates: any[],
  filters: { name: string; keywords: string }
) => {
  return templates.filter(template => {
    const nameMatch = template.name.toLowerCase().includes(filters.name.toLowerCase());
    
    const keywordMatch = filters.keywords === '' || 
      template.keywords.some((keyword: string) =>
        keyword.toLowerCase().includes(filters.keywords.toLowerCase())
      );
    
    return nameMatch && keywordMatch;
  });
};

export const simulateImageUpload = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // В реальном приложении здесь был бы upload на сервер
      setTimeout(() => resolve(e.target?.result as string), 1000);
    };
    reader.readAsDataURL(file);
  });
};