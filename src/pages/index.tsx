import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    throw redirect({
      to: '/character',
      search: { search: undefined, page: 1 },
    });
  },
});
