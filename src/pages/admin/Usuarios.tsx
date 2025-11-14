import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

interface User {
  id: number;
  firebaseUid: string;
  email: string;
  nome: string;
  role: string;
  createdAt: string;
}

// Schema de validação para criação de usuário
const createUserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.string().min(1, 'Selecione um papel')
});

// Schema de validação para edição de usuário
const updateUserSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'Selecione um papel')
});

// Schema de validação para alteração de senha
const changePasswordSchema = z.object({
  newPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToChangePassword, setUserToChangePassword] = useState<User | null>(null);

  // Form para criar usuário
  const createForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      role: 'admin'
    }
  });

  // Form para editar usuário
  const updateForm = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      nome: '',
      email: '',
      role: 'admin'
    }
  });

  // Form para alterar senha
  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (data: CreateUserFormData) => {
    try {
      await api.post('/users', data);
      toast.success('Usuário cadastrado com sucesso!');
      setShowModal(false);
      createForm.reset();
      loadUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao criar usuário';
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    }
  };

  const handleUpdateSubmit = async (data: UpdateUserFormData) => {
    try {
      await api.patch(`/users/${editingUser?.id}`, data);
      toast.success('Usuário atualizado com sucesso!');
      setShowModal(false);
      updateForm.reset();
      setEditingUser(null);
      loadUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao atualizar usuário';
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    updateForm.reset({
      nome: user.nome,
      email: user.email,
      role: user.role
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/users/${userToDelete}`);
      toast.success('Usuário excluído com sucesso!');
      loadUsers();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao excluir usuário';
      toast.error(errorMsg);
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    createForm.reset();
    updateForm.reset();
    setEditingUser(null);
  };

  const handleOpenPasswordModal = (user: User) => {
    setUserToChangePassword(user);
    passwordForm.reset();
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    passwordForm.reset();
    setUserToChangePassword(null);
  };

  const handlePasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      await api.patch(`/users/${userToChangePassword?.id}`, {
        password: data.newPassword
      });
      toast.success('Senha atualizada com sucesso!');
      handleClosePasswordModal();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao atualizar senha';
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Carregando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Usuários</h1>
            <p className="text-gray-400 mt-1">Gerencie os usuários administradores</p>
          </div>
          <motion.button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + Novo Usuário
          </motion.button>
        </div>

        {/* Lista de Usuários */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Papel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Cadastrado em
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">{user.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-300">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Editar usuário"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={() => handleOpenPasswordModal(user)}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Alterar senha"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteClick(user.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Excluir usuário"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Nenhum usuário cadastrado ainda.
          </div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>

              {editingUser ? (
                <form onSubmit={updateForm.handleSubmit(handleUpdateSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Nome *
                    </label>
                    <input
                      type="text"
                      {...updateForm.register('nome')}
                      className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                        updateForm.formState.errors.nome 
                          ? 'border-red-500 focus:border-red-400' 
                          : updateForm.watch('nome')
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-transparent focus:border-primary'
                      }`}
                    />
                    {updateForm.formState.errors.nome && (
                      <p className="text-red-400 text-sm mt-1">{updateForm.formState.errors.nome.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...updateForm.register('email')}
                      className="w-full px-4 py-3 bg-dark-900/50 border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none transition-colors opacity-50 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Papel
                    </label>
                    <select
                      {...updateForm.register('role')}
                      className="w-full px-4 py-3 bg-dark-900/50 border border-gray-700 rounded-lg text-white focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    {updateForm.formState.errors.role && (
                      <p className="text-red-400 text-sm mt-1">{updateForm.formState.errors.role.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
                    >
                      Atualizar
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Nome *
                    </label>
                    <input
                      type="text"
                      {...createForm.register('nome')}
                      className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                        createForm.formState.errors.nome 
                          ? 'border-red-500 focus:border-red-400' 
                          : createForm.watch('nome')
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-transparent focus:border-primary'
                      }`}
                    />
                    {createForm.formState.errors.nome && (
                      <p className="text-red-400 text-sm mt-1">{createForm.formState.errors.nome.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...createForm.register('email')}
                      className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                        createForm.formState.errors.email 
                          ? 'border-red-500 focus:border-red-400' 
                          : createForm.watch('email')
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-transparent focus:border-primary'
                      }`}
                    />
                    {createForm.formState.errors.email && (
                      <p className="text-red-400 text-sm mt-1">{createForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Senha *
                    </label>
                    <input
                      type="password"
                      {...createForm.register('password')}
                      className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                        createForm.formState.errors.password 
                          ? 'border-red-500 focus:border-red-400' 
                          : createForm.watch('password') && createForm.watch('password').length >= 6
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-transparent focus:border-primary'
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                    {createForm.formState.errors.password && (
                      <p className="text-red-400 text-sm mt-1">{createForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">
                      Papel
                    </label>
                    <select
                      {...createForm.register('role')}
                      style={{ colorScheme: 'dark' }}
                      className="w-full px-4 py-3 bg-dark-900/50 border border-transparent rounded-lg text-white focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="admin" style={{ backgroundColor: '#0F0A1A' }}>Admin</option>
                      <option value="super_admin" style={{ backgroundColor: '#0F0A1A' }}>Super Admin</option>
                    </select>
                    {createForm.formState.errors.role && (
                      <p className="text-red-400 text-sm mt-1">{createForm.formState.errors.role.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cadastrar
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Alteração de Senha */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClosePasswordModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Alterar Senha</h2>
                  <p className="text-gray-400 text-sm mt-1">{userToChangePassword?.nome}</p>
                </div>
              </div>

              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Nova Senha *
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register('newPassword')}
                    className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                      passwordForm.formState.errors.newPassword 
                        ? 'border-red-500 focus:border-red-400' 
                        : passwordForm.watch('newPassword') && passwordForm.watch('newPassword').length >= 6
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-transparent focus:border-primary'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">
                    Confirmar Nova Senha *
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white focus:outline-none transition-all ${
                      passwordForm.formState.errors.confirmPassword 
                        ? 'border-red-500 focus:border-red-400' 
                        : passwordForm.watch('confirmPassword') && passwordForm.watch('newPassword') === passwordForm.watch('confirmPassword')
                        ? 'border-green-500 focus:border-green-400'
                        : 'border-transparent focus:border-primary'
                    }`}
                    placeholder="Confirme a nova senha"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClosePasswordModal}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
                  >
                    Alterar Senha
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmação de Exclusão */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              className="bg-dark-800 border border-red-500/30 rounded-2xl w-full max-w-md"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
                    <p className="text-gray-400 mt-1">Esta ação não pode ser desfeita</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Tem certeza que deseja excluir este usuário? Todos os dados serão permanentemente removidos.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setUserToDelete(null);
                    }}
                    className="flex-1 px-6 py-3 bg-dark-900 hover:bg-dark-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
