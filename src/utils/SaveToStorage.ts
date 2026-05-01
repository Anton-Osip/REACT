export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Ошибка сохранения в localStorage:', error);
  }
};
