export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;
    return JSON.parse(saved) as T;
  } catch (error) {
    console.error('Ошибка чтения из localStorage:', error);
    return defaultValue;
  }
};
