import { ReactNode } from 'react';
import Header from './Header';
import Toast from '../common/Toast';
import { useToastStore } from '@/store/toastStore';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 mt-16 sm:mt-20">
        {children}
      </main>
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
