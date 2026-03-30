import { motion } from 'framer-motion';

interface LoaderProps {
  message?: string;
}

export function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="w-16 h-16 border-4 border-[#EAD5C3] dark:border-[#CAA07D33] border-t-[#CAA07D] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-muted">{message}</p>
    </div>
  );
}

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function Error({ message = 'Something went wrong', onRetry }: ErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="text-6xl mb-4">😕</div>
      <h3 className="text-xl font-semibold text-[#1A1A1D] dark:text-[#F4EFEA] mb-2">
        Error
      </h3>
      <p className="text-secondary mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </motion.div>
  );
}

interface EmptyProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Empty({ message = 'No items found', actionLabel, onAction }: EmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="text-6xl mb-4">📦</div>
      <h3 className="text-xl font-semibold text-[#1A1A1D] dark:text-[#F4EFEA] mb-2">
        {message}
      </h3>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary mt-4">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
