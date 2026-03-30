import { ReactElement, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useCollection } from '@/hooks/useCollection';
import { useIsAuthor } from '@/hooks/useIsAuthor';
import { useAuthStore } from '@/store/authStore';
import { Loader, Error } from './States';

interface AuthorOnlyRouteProps {
  children: ReactElement;
}

export default function AuthorOnlyRoute({ children }: AuthorOnlyRouteProps): ReactElement {
  const { id } = useParams<{ id: string }>();
  const { collection, loading, error } = useCollection(id || '');
  const isAuthor = useIsAuthor(collection);
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return <Loader message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (error || !collection) {
    return <Error message={error || 'Collection not found'} />;
  }

  if (!isAuthor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message="Недостаточно прав доступа. Вы не являетесь автором этой коллекции." />
      </div>
    );
  }

  return children;
}


