import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

interface Orcamento {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  tipoServico: string;
  descricaoProjeto: string;
  orcamento: string;
  prazo: string;
  status: 'pendente' | 'em_analise' | 'respondido';
  observacoes?: string;
  createdAt: string;
}

export default function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orcamentoToDelete, setOrcamentoToDelete] = useState<number | null>(null);
  const [emailForm, setEmailForm] = useState({
    assunto: '',
    mensagem: '',
    valorOrcamento: '',
    prazoEntrega: '',
  });

  useEffect(() => {
    loadOrcamentos();
  }, []);

  const loadOrcamentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orcamentos');
      setOrcamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast.error('Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/orcamentos/${id}/status`, { status: newStatus });
      toast.success('Status atualizado com sucesso!');
      loadOrcamentos();
      if (selectedOrcamento?.id === id) {
        setSelectedOrcamento({ ...selectedOrcamento, status: newStatus as any });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDeleteClick = (id: number) => {
    setOrcamentoToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!orcamentoToDelete) return;

    try {
      await api.delete(`/orcamentos/${orcamentoToDelete}`);
      toast.success('Orçamento excluído com sucesso!');
      setSelectedOrcamento(null);
      loadOrcamentos();
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      toast.error('Erro ao excluir orçamento');
    } finally {
      setShowDeleteConfirm(false);
      setOrcamentoToDelete(null);
    }
  };

  const handleOpenEmailModal = () => {
    if (!selectedOrcamento) return;
    
    setEmailForm({
      assunto: `Resposta ao seu orçamento - ${selectedOrcamento.tipoServico}`,
      mensagem: `Olá ${selectedOrcamento.nome},\n\nAgradecemos pelo seu interesse em nossos serviços!\n\nAnalisamos sua solicitação de orçamento para ${selectedOrcamento.tipoServico} e gostaríamos de apresentar nossa proposta:\n\n`,
      valorOrcamento: '',
      prazoEntrega: '',
    });
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    if (!selectedOrcamento) return;

    try {
      // Enviar email através da API
      await api.post(`/orcamentos/${selectedOrcamento.id}/send-email`, emailForm);
      
      toast.success('Email enviado com sucesso!');
      
      // Atualizar status para respondido
      await handleStatusChange(selectedOrcamento.id, 'respondido');
      
      setShowEmailModal(false);
      setEmailForm({
        assunto: '',
        mensagem: '',
        valorOrcamento: '',
        prazoEntrega: '',
      });
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      const errorMsg = error.response?.data?.message || 'Erro ao enviar email';
      toast.error(errorMsg);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'em_analise':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'respondido':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_analise':
        return 'Em Análise';
      case 'respondido':
        return 'Respondido';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const orcamentosFiltrados = filterStatus === 'todos'
    ? orcamentos
    : orcamentos.filter(o => o.status === filterStatus);

  const stats = {
    total: orcamentos.length,
    pendentes: orcamentos.filter(o => o.status === 'pendente').length,
    emAnalise: orcamentos.filter(o => o.status === 'em_analise').length,
    respondidos: orcamentos.filter(o => o.status === 'respondido').length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando orçamentos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gerenciar Orçamentos</h1>
          <p className="text-gray-400">Total de {stats.total} solicitações</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-white">{stats.pendentes}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Em Análise</p>
                <p className="text-2xl font-bold text-white">{stats.emAnalise}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Respondidos</p>
                <p className="text-2xl font-bold text-white">{stats.respondidos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setFilterStatus('todos')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterStatus === 'todos'
                ? 'bg-primary text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus('pendente')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterStatus === 'pendente'
                ? 'bg-yellow-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Pendentes ({stats.pendentes})
          </button>
          <button
            onClick={() => setFilterStatus('em_analise')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterStatus === 'em_analise'
                ? 'bg-blue-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Em Análise ({stats.emAnalise})
          </button>
          <button
            onClick={() => setFilterStatus('respondido')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterStatus === 'respondido'
                ? 'bg-green-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Respondidos ({stats.respondidos})
          </button>
        </div>

        {/* Orcamentos List and Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-4">
            {orcamentosFiltrados.length === 0 ? (
              <div className="bg-dark-800 border border-white/10 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-400">Nenhum orçamento encontrado</p>
              </div>
            ) : (
              orcamentosFiltrados.map((orcamento) => (
                <motion.div
                  key={orcamento.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-dark-800 border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedOrcamento?.id === orcamento.id
                      ? 'border-primary'
                      : 'border-white/10'
                  }`}
                  onClick={() => setSelectedOrcamento(orcamento)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{orcamento.nome}</h3>
                      <p className="text-gray-400 text-sm">{orcamento.email}</p>
                    </div>
                    <span className={`px-3 py-1 border rounded-full text-xs font-bold ${getStatusColor(orcamento.status)}`}>
                      {getStatusLabel(orcamento.status)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{orcamento.tipoServico}</p>
                  <p className="text-gray-500 text-xs">{formatDate(orcamento.createdAt)}</p>
                </motion.div>
              ))
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2">
            {selectedOrcamento ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-8"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedOrcamento.nome}</h2>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedOrcamento.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {selectedOrcamento.telefone}
                      </span>
                    </div>
                  </div>
                  <span className={`px-4 py-2 border rounded-xl text-sm font-bold ${getStatusColor(selectedOrcamento.status)}`}>
                    {getStatusLabel(selectedOrcamento.status)}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedOrcamento.empresa && (
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Empresa</p>
                      <p className="text-white font-semibold">{selectedOrcamento.empresa}</p>
                    </div>
                  )}
                  <div className="bg-dark-900 border border-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Tipo de Serviço</p>
                    <p className="text-white font-semibold">{selectedOrcamento.tipoServico}</p>
                  </div>
                  {selectedOrcamento.orcamento && (
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Orçamento</p>
                      <p className="text-white font-semibold">{selectedOrcamento.orcamento}</p>
                    </div>
                  )}
                  {selectedOrcamento.prazo && (
                    <div className="bg-dark-900 border border-white/10 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Prazo</p>
                      <p className="text-white font-semibold">{selectedOrcamento.prazo}</p>
                    </div>
                  )}
                  <div className="bg-dark-900 border border-white/10 rounded-xl p-4 col-span-2">
                    <p className="text-gray-400 text-sm mb-1">Data da Solicitação</p>
                    <p className="text-white font-semibold">{formatDate(selectedOrcamento.createdAt)}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-dark-900 border border-white/10 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descrição do Projeto
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedOrcamento.descricaoProjeto}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-6">
                  <select
                    value={selectedOrcamento.status}
                    onChange={(e) => handleStatusChange(selectedOrcamento.id, e.target.value)}
                    className="flex-1 px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="respondido">Respondido</option>
                  </select>
                  <button
                    onClick={handleOpenEmailModal}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Responder por Email
                  </button>
                  <button
                    onClick={() => handleDeleteClick(selectedOrcamento.id)}
                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-xl font-semibold transition-all"
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-dark-800 border border-white/10 rounded-xl p-16 text-center">
                <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">Selecione um orçamento</h3>
                <p className="text-gray-400">Clique em um orçamento da lista para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Email */}
      <AnimatePresence>
        {showEmailModal && selectedOrcamento && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Enviar Email de Resposta</h3>
                  <p className="text-gray-400 mt-1">
                    Para: <span className="text-primary">{selectedOrcamento.email}</span> ({selectedOrcamento.nome})
                  </p>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Assunto */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={emailForm.assunto}
                    onChange={(e) => setEmailForm({ ...emailForm, assunto: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                    placeholder="Assunto do email"
                  />
                </div>

                {/* Informações da Proposta */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Valor do Orçamento
                    </label>
                    <input
                      type="text"
                      value={emailForm.valorOrcamento}
                      onChange={(e) => setEmailForm({ ...emailForm, valorOrcamento: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                      placeholder="Ex: R$ 5.000,00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Prazo de Entrega
                    </label>
                    <input
                      type="text"
                      value={emailForm.prazoEntrega}
                      onChange={(e) => setEmailForm({ ...emailForm, prazoEntrega: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all"
                      placeholder="Ex: 30 dias"
                    />
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    value={emailForm.mensagem}
                    onChange={(e) => setEmailForm({ ...emailForm, mensagem: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-all resize-none"
                    placeholder="Digite a mensagem do email..."
                  />
                </div>

                {/* Preview Box */}
                <div className="bg-dark-900 border border-primary/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-primary mb-2">Preview da Proposta:</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    {emailForm.valorOrcamento && (
                      <p>💰 Valor: <span className="text-white font-medium">{emailForm.valorOrcamento}</span></p>
                    )}
                    {emailForm.prazoEntrega && (
                      <p>📅 Prazo: <span className="text-white font-medium">{emailForm.prazoEntrega}</span></p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-6 py-3 bg-dark-900 hover:bg-dark-700 text-white rounded-xl font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={!emailForm.assunto || !emailForm.mensagem}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Enviar Email
                </button>
              </div>
            </motion.div>
          </div>
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
                  Tem certeza que deseja excluir este orçamento? Todos os dados serão permanentemente removidos.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setOrcamentoToDelete(null);
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
