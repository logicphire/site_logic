import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

interface Contato {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  mensagem: string;
  lido: boolean;
  respondido: boolean;
  createdAt: string;
}

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    assunto: '',
    mensagem: '',
  });

  useEffect(() => {
    loadContatos();
  }, []);

  const loadContatos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contatos');
      setContatos(response.data);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number, silent: boolean = false) => {
    try {
      await api.patch(`/contatos/${id}/read`);
      
      // Atualiza o estado local sem fazer reload completo
      setContatos(prev => prev.map(c => 
        c.id === id ? { ...c, lido: true } : c
      ));
      
      // Atualiza o contato selecionado se for o mesmo
      if (selectedContato?.id === id) {
        setSelectedContato({ ...selectedContato, lido: true });
      }
      
      if (!silent) {
        toast.success('Contato marcado como lido!');
      }
    } catch (error) {
      console.error('Erro ao marcar como lido:', error);
      if (!silent) {
        toast.error('Erro ao marcar como lido');
      }
    }
  };

  const handleMarkAsResponded = async (id: number) => {
    try {
      await api.patch(`/contatos/${id}/responded`);
      
      // Atualiza o estado local sem fazer reload completo
      setContatos(prev => prev.map(c => 
        c.id === id ? { ...c, respondido: true } : c
      ));
      
      // Atualiza o contato selecionado se for o mesmo
      if (selectedContato?.id === id) {
        setSelectedContato({ ...selectedContato, respondido: true });
      }
      
      toast.success('Contato marcado como respondido!');
    } catch (error) {
      console.error('Erro ao marcar como respondido:', error);
      toast.error('Erro ao marcar como respondido');
    }
  };

  const handleOpenEmailModal = () => {
    if (!selectedContato) return;
    
    // Gerar assunto baseado no contato
    const dataContato = new Date(selectedContato.createdAt).toLocaleDateString('pt-BR');
    const assuntoPadrao = `Re: Contato via Site - ${dataContato}`;
    
    setEmailForm({
      assunto: assuntoPadrao,
      mensagem: `Olá ${selectedContato.nome},\n\nObrigado por entrar em contato!\n\n`,
    });
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    if (!selectedContato) return;

    try {
      // Simular envio de email (você pode integrar com um serviço real depois)
      console.log('Enviando email:', {
        para: selectedContato.email,
        ...emailForm,
      });
      
      toast.success('Email enviado com sucesso!');
      
      // Marcar como respondido
      await handleMarkAsResponded(selectedContato.id);
      
      setShowEmailModal(false);
      setEmailForm({
        assunto: '',
        mensagem: '',
      });
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      toast.error('Erro ao enviar email');
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contatoToDelete, setContatoToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setContatoToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!contatoToDelete) return;

    try {
      await api.delete(`/contatos/${contatoToDelete}`);
      setSelectedContato(null);
      await loadContatos();
      setShowDeleteConfirm(false);
      setContatoToDelete(null);
      toast.success('Contato excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      toast.error('Erro ao excluir contato');
    }
  };

  const getStatusBadge = (contato: Contato) => {
    if (contato.respondido) {
      return <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full text-xs font-bold">Respondido</span>;
    }
    if (contato.lido) {
      return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-full text-xs font-bold">Lido</span>;
    }
    return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-full text-xs font-bold">Novo</span>;
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

  const contatosFiltrados = filterStatus === 'todos'
    ? contatos
    : filterStatus === 'novos'
    ? contatos.filter(c => !c.lido && !c.respondido)
    : filterStatus === 'lidos'
    ? contatos.filter(c => c.lido && !c.respondido)
    : contatos.filter(c => c.respondido);

  const stats = {
    total: contatos.length,
    novos: contatos.filter(c => !c.lido && !c.respondido).length,
    lidos: contatos.filter(c => c.lido && !c.respondido).length,
    respondidos: contatos.filter(c => c.respondido).length,
  };

  // Auto-marcar como lido quando selecionar (modo silencioso)
  useEffect(() => {
    if (selectedContato && !selectedContato.lido) {
      handleMarkAsRead(selectedContato.id, true); // silent = true
    }
  }, [selectedContato?.id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando contatos...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">Gerenciar Contatos</h1>
          <p className="text-gray-400">Total de {stats.total} mensagens</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-dark-800 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Novos</p>
                <p className="text-2xl font-bold text-white">{stats.novos}</p>
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
                <p className="text-gray-400 text-sm">Lidos</p>
                <p className="text-2xl font-bold text-white">{stats.lidos}</p>
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
            onClick={() => setFilterStatus('novos')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterStatus === 'novos'
                ? 'bg-yellow-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Novos ({stats.novos})
          </button>
          <button
            onClick={() => setFilterStatus('lidos')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterStatus === 'lidos'
                ? 'bg-blue-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Lidos ({stats.lidos})
          </button>
          <button
            onClick={() => setFilterStatus('respondidos')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              filterStatus === 'respondidos'
                ? 'bg-green-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            Respondidos ({stats.respondidos})
          </button>
        </div>

        {/* Contatos List and Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
            {contatosFiltrados.length === 0 ? (
              <div className="bg-dark-800 border border-white/10 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-400">Nenhum contato encontrado</p>
              </div>
            ) : (
              contatosFiltrados.map((contato) => (
                <motion.div
                  key={contato.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-dark-800 border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedContato?.id === contato.id
                      ? 'border-primary'
                      : 'border-white/10'
                  } ${!contato.lido ? 'bg-primary/5' : ''}`}
                  onClick={() => setSelectedContato(contato)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{contato.nome}</h3>
                        {!contato.lido && !contato.respondido && (
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{contato.email}</p>
                    </div>
                    {getStatusBadge(contato)}
                  </div>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-1">{contato.mensagem}</p>
                  <p className="text-gray-500 text-xs">{formatDate(contato.createdAt)}</p>
                </motion.div>
              ))
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2">
            {selectedContato ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-8"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-white">{selectedContato.nome}</h2>
                      {getStatusBadge(selectedContato)}
                    </div>
                    <div className="flex flex-col gap-2 text-gray-400">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedContato.email}
                      </span>
                      {selectedContato.telefone && (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {selectedContato.telefone}
                        </span>
                      )}
                      <span className="flex items-center gap-2 text-gray-500 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(selectedContato.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-dark-900 border border-white/10 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Mensagem
                  </h3>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedContato.mensagem}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleOpenEmailModal}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Responder por Email
                  </button>
                  
                  {selectedContato.telefone && (
                    <a
                      href={`https://wa.me/55${selectedContato.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Responder no WhatsApp
                    </a>
                  )}

                  {!selectedContato.respondido && (
                    <button
                      onClick={() => handleMarkAsResponded(selectedContato.id)}
                      className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 rounded-xl font-semibold transition-all"
                    >
                      Marcar como Respondido
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteClick(selectedContato.id)}
                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-xl font-semibold transition-all ml-auto"
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-dark-800 border border-white/10 rounded-xl p-16 text-center">
                <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">Selecione um contato</h3>
                <p className="text-gray-400">Clique em um contato da lista para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>

        {/* Email Modal */}
        <AnimatePresence>
          {showEmailModal && selectedContato && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowEmailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-800 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Responder por Email</h3>
                    <p className="text-gray-400 text-sm">Para: {selectedContato.email}</p>
                  </div>
                </div>

                {/* Assunto */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={emailForm.assunto}
                    onChange={(e) => setEmailForm({ ...emailForm, assunto: e.target.value })}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Assunto do email"
                  />
                </div>

                {/* Mensagem */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    value={emailForm.mensagem}
                    onChange={(e) => setEmailForm({ ...emailForm, mensagem: e.target.value })}
                    rows={12}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Digite sua mensagem..."
                  />
                </div>

                {/* Contexto Original */}
                <div className="bg-dark-900 border border-white/10 rounded-xl p-4 mb-6">
                  <p className="text-gray-400 text-sm mb-2 font-semibold">Mensagem Original:</p>
                  <p className="text-gray-500 text-sm whitespace-pre-wrap">{selectedContato.mensagem}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all"
                  >
                    Enviar Email
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-800 border border-white/10 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Confirmar Exclusão</h3>
                    <p className="text-gray-400 text-sm">Esta ação não pode ser desfeita</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">
                  Tem certeza que deseja excluir este contato?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
