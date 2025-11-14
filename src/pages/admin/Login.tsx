import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      await login(data.email, data.password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Erro no login:', err);
      const errorMessage = err.response?.data?.message || 'Email ou senha incorretos. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary/20 flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="Logic Phire" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-white mb-2">
            Painel Admin
          </h1>
          <p className="text-gray-400">
            Acesse sua conta para gerenciar o site
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          className="bg-dark-800 border border-white/10 rounded-3xl p-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`w-full px-4 py-3 bg-dark-900 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-400' 
                    : 'border-white/10 focus:border-primary'
                }`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className={`w-full px-4 py-3 bg-dark-900 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                  errors.password 
                    ? 'border-red-500 focus:border-red-400' 
                    : 'border-white/10 focus:border-primary'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Logic Phire. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
}
