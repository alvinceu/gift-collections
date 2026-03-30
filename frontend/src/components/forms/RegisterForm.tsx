import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToastStore } from '@/store/toastStore';
import type { RegisterData } from '@/types';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser, error, clearError, isLoading } = useAuth();
  const showToast = useToastStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      clearError();
      await registerUser(data);
      showToast('Регистрация успешна! Вы вошли в систему', 'success');
      navigate('/');
    } catch (err) {
      showToast('Ошибка регистрации. Попробуйте еще раз', 'error');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto card"
    >
      <h2 className="text-2xl font-bold mb-6 text-[#1A1A1D] dark:text-[#F4EFEA]">
        Регистрация
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
            Имя *
          </label>
          <input
            {...register('name')}
            className="input-field"
            placeholder="Ваше имя"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">
              {errors.name.message}
            </p>
          )}
        </div>

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

        <div>
          <label className="block text-sm font-medium mb-2 text-secondary">
            Подтвердите пароль *
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            className="input-field"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-[#C46A5A] dark:text-[#D07A6A]">
              {errors.confirmPassword.message}
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
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <p className="text-center text-sm text-secondary">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-[#CAA07D] hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </motion.form>
  );
}


