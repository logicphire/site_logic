import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

interface Project {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  tecnologias: string[];
  categoria: string;
  tipo: string;
  plataforma: string;
  link?: string;
  tipoLink?: string;
  repositorio?: string;
  destaque: boolean;
  createdAt: string;
}

export default function Projetos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    tecnologias: '',
    categoria: '',
    tipo: '',
    plataforma: '',
    link: '',
    tipoLink: 'live',
    repositorio: '',
    destaque: false,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const projectData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        imagem: formData.imagem,
        categoria: formData.categoria,
        tipo: formData.tipo,
        plataforma: formData.plataforma,
        tecnologias: formData.tecnologias.split(',').map((t: string) => t.trim()),
        link: formData.link || undefined,
        tipoLink: formData.tipoLink || undefined,
        repositorio: formData.repositorio || undefined,
        destaque: formData.destaque,
        ativo: true,
      };

      if (editingProject) {
        await api.patch(`/projects/${editingProject.id}`, projectData);
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await api.post('/projects', projectData);
        toast.success('Projeto criado com sucesso!');
      }

      setShowModal(false);
      resetForm();
      loadProjects();
    } catch (error: any) {
      console.error('Erro ao salvar projeto:', error);
      const errorMsg = error.response?.data?.message || 'Erro ao salvar projeto';
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      titulo: project.titulo,
      descricao: project.descricao,
      imagem: project.imagem,
      tecnologias: project.tecnologias.join(', '),
      categoria: project.categoria,
      tipo: project.tipo,
      plataforma: project.plataforma,
      link: project.link || '',
      tipoLink: project.tipoLink || 'live',
      repositorio: project.repositorio || '',
      destaque: project.destaque,
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await api.delete(`/projects/${projectToDelete}`);
      toast.success('Projeto excluído com sucesso!');
      loadProjects();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
    } finally {
      setShowDeleteConfirm(false);
      setProjectToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      imagem: '',
      tecnologias: '',
      categoria: '',
      tipo: '',
      plataforma: '',
      link: '',
      tipoLink: 'live',
      repositorio: '',
      destaque: false,
    });
    setEditingProject(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando projetos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Gerenciar Projetos</h1>
            <p className="text-gray-400">Total de {projects.length} projetos</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-xl font-semibold transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Projeto
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-dark-800 border border-white/10 rounded-2xl">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum projeto cadastrado</h3>
            <p className="text-gray-400 mb-6">Comece adicionando seu primeiro projeto</p>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all"
            >
              Adicionar Projeto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-dark-900">
                  <img
                    src={project.imagem}
                    alt={project.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                      {project.categoria}
                    </span>
                    {project.destaque && (
                      <span className="px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                        ⭐ Destaque
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.titulo}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.descricao}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tecnologias.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tecnologias.length > 3 && (
                      <span className="px-2 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg">
                        +{project.tecnologias.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-40">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />

              {/* Modal */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-dark-800 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-white/5 rounded-xl transition-all"
                    >
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                        placeholder="Nome do projeto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Descrição *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all resize-none"
                        placeholder="Descreva o projeto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        URL da Imagem *
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.imagem}
                        onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Categoria *
                        </label>
                        <select
                          required
                          value={formData.categoria}
                          onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                          className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                        >
                          <option value="">Selecione</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile App">Mobile App</option>
                          <option value="Desktop">Desktop</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="Landing Page">Landing Page</option>
                          <option value="Sistema">Sistema</option>
                          <option value="API">API</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Tipo *
                        </label>
                        <select
                          required
                          value={formData.tipo}
                          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                          className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                        >
                          <option value="">Selecione</option>
                          <option value="Cliente">Cliente</option>
                          <option value="Pessoal">Pessoal</option>
                          <option value="Estudo">Estudo</option>
                          <option value="Open Source">Open Source</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Plataforma *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.plataforma}
                        onChange={(e) => setFormData({ ...formData, plataforma: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                        placeholder="Ex: Web, iOS, Android, Desktop"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Tecnologias * <span className="text-gray-400 text-xs">(separadas por vírgula)</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.tecnologias}
                        onChange={(e) => setFormData({ ...formData, tecnologias: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                        placeholder="React, TypeScript, Tailwind CSS"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Link do Projeto
                      </label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                        placeholder="https://projeto.com"
                      />
                    </div>

                    {/* Campo condicional para repositório quando tipo é Open Source */}
                    {formData.tipo === 'Open Source' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-semibold text-white mb-2">
                          Repositório GitHub *
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.repositorio}
                          onChange={(e) => setFormData({ ...formData, repositorio: e.target.value })}
                          className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                          placeholder="https://github.com/usuario/repositorio"
                        />
                      </motion.div>
                    )}

                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id="destaque"
                        checked={formData.destaque}
                        onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                        className="w-5 h-5 bg-dark-900 border border-white/10 rounded text-primary focus:ring-primary"
                      />
                      <label htmlFor="destaque" className="text-sm font-semibold text-white cursor-pointer">
                        Marcar como projeto em destaque
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-xl font-semibold transition-all"
                      >
                        {editingProject ? 'Atualizar' : 'Criar'} Projeto
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

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
                    Tem certeza que deseja excluir este projeto? Todos os dados serão permanentemente removidos.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setProjectToDelete(null);
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
