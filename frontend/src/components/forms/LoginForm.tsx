import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToastStore } from '@/store/toastStore';
import type { LoginData } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAuth();
  const showToast = useToastStore((state) => state.showToast);
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      clearError();
      await login(data);
      showToast('Вы вошли в систему', 'success');
      navigate('/');
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showToast('Ошибка входа. Проверьте email и пароль', 'error');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className={`max-w-md mx-auto card ${shake ? 'animate-shake' : ''}`}
    >
      <h2 className="text-2xl font-bold mb-6 text-[#1A1A1D] dark:text-[#F4EFEA]">
        Вход
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-[#C46A5A] dark:bg-[#D07A6A] text-white rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-secondary">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            className="input-field"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-secondary">
            Пароль *
          </label>
          <input
            {...register('password')}
            type="password"
            className="input-field"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
        <p className="text-center text-sm text-secondary">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-[#CAA07D] hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </motion.form>
  );
}


