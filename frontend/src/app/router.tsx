import { createBrowserRouter } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AuthorOnlyRoute from '@/components/common/AuthorOnlyRoute';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import CollectionPage from '@/pages/CollectionPage';
import EditCollectionPage from '@/pages/EditCollectionPage';
import CreateCollectionPage from '@/pages/CreateCollectionPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFound from '@/pages/NotFound';

const getBasePath = (): string => {
  if (import.meta.env.MODE === 'production') {
    const pathname = window.location.pathname;
    const repoName = 'project-frontend-sem5';
    if (pathname.startsWith(`/${repoName}/`) || pathname === `/${repoName}`) {
      return `/${repoName}/`;
    }
  }
  return '/';
};

const basename = getBasePath();

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppShell>
        <HomePage />
      </AppShell>
    ),
  },
  {
    path: '/about',
    element: (
      <AppShell>
        <AboutPage />
      </AppShell>
    ),
  },
  {
    path: '/login',
    element: (
      <AppShell>
        <LoginPage />
      </AppShell>
    ),
  },
  {
    path: '/register',
    element: (
      <AppShell>
        <RegisterPage />
      </AppShell>
    ),
  },
  {
    path: '/create',
    element: (
      <AppShell>
        <ProtectedRoute>
          <CreateCollectionPage />
        </ProtectedRoute>
      </AppShell>
    ),
  },
  {
    path: '/collection/:id',
    element: (
      <AppShell>
        <CollectionPage />
      </AppShell>
    ),
  },
  {
    path: '/collection/:id/edit',
    element: (
      <AppShell>
        <AuthorOnlyRoute>
          <EditCollectionPage />
        </AuthorOnlyRoute>
      </AppShell>
    ),
  },
  {
    path: '*',
    element: (
      <AppShell>
        <NotFound />
      </AppShell>
    ),
  },
], {
  basename,
});
