import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <h1 className="text-9xl font-bold text-accent-primary mb-4">
        404
      </h1>
      <h2 className="text-3xl font-semibold mb-4 text-[#1A1A1D] dark:text-[#F4EFEA]">
        Page Not Found
      </h2>
      <p className="text-secondary mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </motion.div>
  );
}

