import { QueryProvider } from './QueryProvider';

// Zustand не требует провайдера, только TanStack Query
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};
