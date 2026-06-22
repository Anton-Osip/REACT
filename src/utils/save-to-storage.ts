export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(value);

    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Ошибка сохранения в localStorage:', error);
  }
};
