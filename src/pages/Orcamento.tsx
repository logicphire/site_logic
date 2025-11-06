import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function Orcamento() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    tipoServico: '',
    orcamento: '',
    prazo: '',
    descricaoProjeto: ''
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne o submit do form
    
    // Validação simples para cada etapa
    if (step === 1) {
      if (!formData.nome || !formData.email || !formData.telefone) {
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
    } else if (step === 2) {
      if (!formData.tipoServico || !formData.orcamento || !formData.prazo) {
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
    }
    
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne o submit do form
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação final
    if (!formData.descricaoProjeto) {
      toast.error('Por favor, descreva seu projeto.');
      return;
    }
    
    if (!formData.orcamento || !formData.prazo) {
      toast.error('Por favor, preencha o orçamento e prazo desejados.');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/orcamentos', formData);
      
      // Mostrar tela de sucesso
      setSuccess(true);
      toast.success('Orçamento enviado com sucesso! Entraremos em contato em breve.');
      
      // Limpar formulário após 5 segundos
      setTimeout(() => {
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          empresa: '',
          tipoServico: '',
          orcamento: '',
          prazo: '',
          descricaoProjeto: ''
        });
        setStep(1);
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Erro ao enviar orçamento:', error);
      const errorMsg = error.response?.data?.message || 'Erro ao enviar orçamento. Tente novamente.';
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-dark-900/95 via-primary/10 to-dark-800/95 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-40 right-1/4 w-72 h-72 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/3 w-96 h-96 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-primary via-white to-accent-purple bg-clip-text text-transparent">
              Solicitar orçamento
            </span>
          </h1>
          
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
              Transforme sua <span className="text-accent-purple font-medium">visão</span> em realidade digital. 
              Conte-nos sobre seu projeto e receba uma 
              <span className="text-primary font-medium"> proposta personalizada</span> em até 24h.
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="flex justify-center mb-12">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-6">
              {[
                { num: 1, label: "Informações" },
                { num: 2, label: "Projeto" },
                { num: 3, label: "Detalhes" }
              ].map(({ num, label }) => (
                <div key={num} className="flex items-center">
                  <div className="text-center">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                        step >= num
                          ? 'bg-gradient-to-r from-primary to-accent-purple text-white border-primary'
                          : 'bg-gray-800/50 text-gray-400 border-gray-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {num}
                    </motion.div>
                    <p className={`text-xs mt-2 transition-colors ${
                      step >= num ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {label}
                    </p>
                  </div>
                  {num < 3 && (
                    <div
                      className={`w-16 h-1 mx-4 rounded-full transition-all duration-500 ${
                        step > num 
                          ? 'bg-gradient-to-r from-primary to-accent-purple' 
                          : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Screen */}
        {success ? (
          <motion.div
            className="glass-card p-8 md:p-12 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Icon with Animation */}
            <motion.div
              className="mx-auto w-24 h-24 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-24 h-24 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Orçamento Enviado! 🎉
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Recebemos sua solicitação com sucesso!
              </p>
              
              <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-xl p-6 mb-6">
                <p className="text-gray-300 mb-4">
                  Nossa equipe analisará seu projeto e entrará em contato em até <span className="text-primary font-bold">24 horas</span>.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Enviamos uma confirmação para <strong className="text-white">{formData.email}</strong></span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="text-left bg-dark-900/50 border border-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Próximos Passos:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>Analisaremos todos os detalhes do seu projeto</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>Entraremos em contato via email ou WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>Enviaremos uma proposta personalizada</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/"
                  className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voltar para Home
                </motion.a>
                <motion.a
                  href="/projetos"
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Nossos Projetos
                </motion.a>
              </div>

              <p className="text-gray-500 text-sm mt-6">
                Redirecionando automaticamente em 5 segundos...
              </p>
            </motion.div>
          </motion.div>
        ) : (
        <motion.form
          className="glass-card p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
        >
          {/* Step 1: Informações Pessoais */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Suas Informações</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo*</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">E-mail*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Telefone/WhatsApp*</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Empresa (opcional)</label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                    placeholder="Nome da sua empresa"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Detalhes do Projeto */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Detalhes do Projeto</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Serviço*</label>
                  <select
                    name="tipoServico"
                    value={formData.tipoServico}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="desenvolvimento-sites">Desenvolvimento de Sites</option>
                    <option value="desenvolvimento-app">Desenvolvimento de Aplicativos</option>
                    <option value="loja-virtual">Loja Virtual (E-commerce)</option>
                    <option value="design">Design e Identidade Visual</option>
                    <option value="consultoria">Consultoria em Tecnologia</option>
                    <option value="manutencao">Manutenção e Suporte</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Orçamento Estimado*</label>
                  <select
                    name="orcamento"
                    value={formData.orcamento}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Selecione uma faixa</option>
                    <option value="ate-5k">Até R$ 5.000</option>
                    <option value="5k-15k">R$ 5.000 - R$ 15.000</option>
                    <option value="15k-50k">R$ 15.000 - R$ 50.000</option>
                    <option value="50k-100k">R$ 50.000 - R$ 100.000</option>
                    <option value="acima-100k">Acima de R$ 100.000</option>
                    <option value="conversar">Prefiro conversar</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prazo Desejado*</label>
                  <select
                    name="prazo"
                    value={formData.prazo}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Selecione um prazo</option>
                    <option value="urgente">Urgente (até 2 semanas)</option>
                    <option value="1-mes">1 mês</option>
                    <option value="2-3-meses">2-3 meses</option>
                    <option value="3-6-meses">3-6 meses</option>
                    <option value="flexivel">Flexível</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Descrição do Projeto */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Conte-nos Mais</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  Descrição do Projeto*
                  <div className="relative group">
                    <span className="cursor-help text-primary border border-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-white transition-all">
                      ?
                    </span>
                    <div className="absolute left-0 top-8 w-80 bg-dark-900 border border-primary/50 rounded-lg p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                      <h4 className="text-primary font-semibold mb-2">💡 Exemplo de descrição:</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        "Preciso de um site para minha loja de roupas femininas. Quero que tenha galeria de fotos dos produtos, formulário de contato, integração com WhatsApp e Instagram. O público-alvo são mulheres de 25 a 45 anos. Gostaria de um design moderno e elegante, com cores suaves. Tenho como referência o site X e Y."
                      </p>
                    </div>
                  </div>
                </label>
                <textarea
                  name="descricaoProjeto"
                  value={formData.descricaoProjeto}
                  onChange={handleInputChange}
                  rows={8}
                  required
                  className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Descreva seu projeto em detalhes: objetivos, funcionalidades desejadas, referências, público-alvo, etc. Quanto mais informações, melhor será nossa proposta!"
                />
              </div>
              
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <h3 className="text-primary font-semibold mb-2">📞 Próximos Passos</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Analisaremos seu projeto em até 1 dia útil</li>
                  <li>• Entraremos em contato para alinhar detalhes</li>
                  <li>• Enviaremos uma proposta personalizada</li>
                  <li>• Agendaremos uma reunião para tirar dúvidas</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Voltar
              </button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-primary to-purple-600 text-black px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-purple-600 text-black px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitação 🚀'}
                </button>
              )}
            </div>
          </div>
        </motion.form>
        )}

        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center mt-8 text-gray-400 text-sm"
          >
            <p>🔒 Seus dados estão seguros conosco e serão usados apenas para este orçamento.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
