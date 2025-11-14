import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import InputMask from 'react-input-mask'
import toast from 'react-hot-toast'
import Hero from '../components/Hero'
import api from '../services/api'
import { isValidPhone } from '../utils/masks'

// Schema de validação para formulário de contato
const contatoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional().refine((val) => !val || isValidPhone(val), {
    message: 'Telefone inválido'
  }),
  mensagem: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres')
});

type ContatoFormData = z.infer<typeof contatoSchema>;

export default function Home() {
  const location = useLocation();
  const [enviandoContato, setEnviandoContato] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      mensagem: ''
    }
  });

  const formData = watch();

  // Scroll para a seção quando vier de outra página com hash
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const onSubmitContato = async (data: ContatoFormData) => {
    try {
      setEnviandoContato(true);
      await api.post('/contatos', data);
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      reset();
    } catch (error: any) {
      console.error('Erro ao enviar contato:', error);
      const errorMsg = error.response?.data?.message || 'Erro ao enviar mensagem. Tente novamente.';
      toast.error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
    } finally {
      setEnviandoContato(false);
    }
  };
  return (
    <div className="pt-16">
      <Hero />
      
      {/* Sobre Section */}
      <section id="sobre" className="py-24 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-primary/10 to-dark-800"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-primary to-accent-purple bg-clip-text text-transparent">
                Quem somos
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Somos uma equipe apaixonada por tecnologia e inovação, dedicada a criar 
              <span className="text-primary font-medium"> soluções digitais excepcionais</span> que 
              impulsionam o crescimento dos nossos clientes.
            </p>
          </motion.div>
          
          {/* Timeline horizontal de valores */}
          <div className="relative">
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent-purple via-accent-cyan to-secondary"></div>
            
            {/* Timeline items */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  number: "01",
                  title: "Inovação",
                  desc: "Sempre utilizando as tecnologias mais modernas e melhores práticas do mercado",
                  color: "primary",
                  bgColor: "bg-primary"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  number: "02",
                  title: "Qualidade",
                  desc: "Código limpo, testado e documentado. Entregamos excelência em cada projeto",
                  color: "accent-purple",
                  bgColor: "bg-accent-purple"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  number: "03",
                  title: "Agilidade",
                  desc: "Desenvolvimento ágil com entregas frequentes e feedback contínuo",
                  color: "accent-cyan",
                  bgColor: "bg-accent-cyan"
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  number: "04",
                  title: "Transparência",
                  desc: "Comunicação clara e constante em todas as etapas do projeto",
                  color: "secondary",
                  bgColor: "bg-secondary"
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="relative flex flex-col items-center text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {/* Circle node */}
                  <motion.div 
                    className={`relative w-32 h-32 rounded-full ${value.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-${value.color}/50`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    {/* Inner circle with icon */}
                    <div className="absolute inset-2 rounded-full bg-dark-900/80 flex items-center justify-center">
                      <div className="text-white">
                        {value.icon}
                      </div>
                    </div>
                    
                    {/* Number badge */}
                    <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full bg-dark-900 border-2 border-${value.color} flex items-center justify-center`}>
                      <span className={`text-${value.color} font-bold text-sm`}>{value.number}</span>
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className={`text-2xl font-bold text-${value.color} group-hover:scale-105 transition-transform`}>
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed max-w-xs mx-auto">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="py-24 pt-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/95 via-secondary/10 to-dark-800/95"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div 
            className="mb-20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-secondary via-primary to-accent-purple bg-clip-text text-transparent">
                Nossos serviços
              </span>
            </h2>
            
            <div className="glass-card p-8 max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                Soluções completas de desenvolvimento para <span className="text-accent-purple font-medium">impulsionar seu negócio</span> 
                com tecnologia de ponta
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                title: "Desenvolvimento Full-Stack",
                subtitle: "Do frontend ao backend",
                features: ["React & Next.js", "Node.js & Python", "APIs REST & GraphQL"],
                gradient: "from-primary/20 to-accent-purple/20",
                borderColor: "border-primary/30",
                textColor: "text-primary"
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Sistemas Empresariais",
                subtitle: "Soluções corporativas",
                features: ["ERPs customizados", "Dashboards analíticos", "Integrações"],
                gradient: "from-accent-purple/20 to-accent-pink/20",
                borderColor: "border-accent-purple/30",
                textColor: "text-accent-purple"
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: "UI/UX Design",
                subtitle: "Experiências memoráveis",
                features: ["Design responsivo", "Prototipagem", "Design systems"],
                gradient: "from-accent-pink/20 to-secondary/20",
                borderColor: "border-accent-pink/30",
                textColor: "text-accent-pink"
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ),
                title: "Cloud & DevOps",
                subtitle: "Infraestrutura moderna",
                features: ["Deploy automático", "AWS & Azure", "Monitoramento"],
                gradient: "from-accent-cyan/20 to-accent-blue/20",
                borderColor: "border-accent-cyan/30",
                textColor: "text-accent-cyan"
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Aplicativos Mobile",
                subtitle: "iOS e Android nativos",
                features: ["React Native", "Flutter", "Performance otimizada"],
                gradient: "from-accent-blue/20 to-primary/20",
                borderColor: "border-accent-blue/30",
                textColor: "text-accent-blue"
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Manutenção & Suporte",
                subtitle: "Sempre à disposição",
                features: ["Suporte técnico", "Atualizações", "Correções rápidas"],
                gradient: "from-secondary/20 to-primary/20",
                borderColor: "border-secondary/30",
                textColor: "text-secondary"
              }
            ].map((service, index) => (
              <motion.article
                key={index}
                className={`glass-card p-6 border ${service.borderColor} group hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Header: Icon + Title/Subtitle */}
                  <div className="flex gap-4 mb-6">
                    {/* Icon */}
                    <div className={`${service.textColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    
                    {/* Title + Subtitle */}
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-1 ${service.textColor} group-hover:text-white transition-colors`}>
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Features list */}
                  <ul className="space-y-2 text-sm text-gray-300">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className={`${service.textColor} mr-2`}>•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Time Section */}
      <section id="time" className="py-24 pt-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/95 via-primary/10 to-dark-800/95"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-primary via-white to-accent-purple bg-clip-text text-transparent">
                Nossa equipe
              </span>
            </h2>
            
            <div className="glass-card p-8 max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                Profissionais experientes e apaixonados por tecnologia, 
                prontos para <span className="text-accent-purple font-medium">transformar suas ideias</span> em realidade digital.
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                nome: "Gilberto Viana",
                cargo: "CEO & UX/UI Designer",
                foto: "/images/gilberto.jpeg",
                roles: ["CEO", "Full-Stack Developer", "UX/UI Designer"],
                skills: ["Figma", "Design Systems", "User Research", "React", "TypeScript"],
                gradient: "from-accent-purple/30 to-accent-pink/30",
                accentColor: "accent-purple",
                bio: "CEO e designer, especializado em criar experiências digitais que encantam usuários."
              },
              {
                nome: "Italo Moraes",
                cargo: "CEO & Software Engineer",
                foto: "/images/italo.jpg",
                roles: ["CEO", "Full-Stack Developer", "Software Engineer"],
                skills: ["React", "Node.js", "TypeScript", "System Architecture", "DevOps"],
                gradient: "from-primary/30 to-accent-cyan/30",
                accentColor: "accent-cyan",
                bio: "CEO e desenvolvedor full-stack, expert em arquitetura de software e soluções escaláveis."
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Header: Foto + Nome e Cargos */}
                  <div className="flex gap-6 items-start mb-6">
                    {/* Foto */}
                    <motion.div 
                      className="relative flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`absolute -inset-1 bg-gradient-to-r ${member.gradient} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500`}></div>
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10">
                        <img 
                          src={member.foto} 
                          alt={member.nome}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </motion.div>
                    
                    {/* Nome e Cargos */}
                    <div className="flex-1 pt-1">
                      <h3 className={`text-2xl font-bold mb-2 group-hover:text-${member.accentColor} transition-colors duration-300`}>
                        {member.nome}
                      </h3>
                      <div className="space-y-1">
                        {member.roles.map((role, idx) => (
                          <p key={idx} className={`text-${member.accentColor} font-medium text-sm`}>
                            {role}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Linha decorativa */}
                  <div className={`w-full h-px bg-gradient-to-r ${member.gradient} mb-4`}></div>
                  
                  {/* Bio */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`text-xs text-${member.accentColor} px-3 py-1 rounded-full border border-${member.accentColor}/30 hover:bg-${member.accentColor}/10 transition-colors`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="py-24 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800/95 via-primary/15 to-dark-900/95"></div>
        
        {/* Tech pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div className="tech-grid"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Main CTA */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-white to-accent-purple bg-clip-text text-transparent">
                Vamos trabalhar juntos?
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
              Transforme sua ideia em realidade. Entre em contato e vamos construir algo <span className="text-primary font-medium">incrível</span> juntos
            </p>
            
            {/* Split: Botões + Formulário */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 text-left">
              {/* Left: Quick actions */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">Contato rápido</h3>
                
                {/* Botões lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.a 
                    href="https://wa.me/5585997935406" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card px-4 py-4 flex flex-col items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] border-[#25D366] text-white font-semibold transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="text-sm">WhatsApp</span>
                  </motion.a>
                  
                  <motion.a 
                    href="mailto:contato@logicphire.com.br" 
                    className="glass-card px-4 py-4 flex flex-col items-center justify-center gap-2 border-primary/30 hover:border-primary text-white font-semibold transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Email</span>
                  </motion.a>
                </div>
                
                {/* Contact info */}
                <div className="glass-card p-6 space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-primary">📧</span>
                    <span className="text-sm">contato@logicphire.com.br</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-accent-purple">📱</span>
                    <span className="text-sm">(85) 99793-5406</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-accent-cyan">📱</span>
                    <span className="text-sm">(85) 98740-0122</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-accent-pink">📍</span>
                    <span className="text-sm">Fortaleza, CE</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Right: Quick contact form */}
              <motion.div
                className="glass-card p-6 border border-primary/20"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">Ou envie uma mensagem</h3>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmitContato)}>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Seu nome" 
                      {...register('nome')}
                      className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                        errors.nome 
                          ? 'border-red-500 focus:border-red-400' 
                          : formData.nome 
                          ? 'border-green-500 focus:border-green-400' 
                          : 'border-transparent focus:border-primary'
                      }`}
                    />
                    {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>}
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Seu email" 
                      {...register('email')}
                      className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-400' 
                          : formData.email 
                          ? 'border-green-500 focus:border-green-400' 
                          : 'border-transparent focus:border-primary'
                      }`}
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Controller
                      name="telefone"
                      control={control}
                      render={({ field }) => (
                        <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                          {(inputProps: any) => (
                            <input
                              {...inputProps}
                              type="tel"
                              placeholder="Seu telefone (opcional)"
                              className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                                errors.telefone 
                                  ? 'border-red-500 focus:border-red-400' 
                                  : formData.telefone 
                                  ? 'border-green-500 focus:border-green-400' 
                                  : 'border-transparent focus:border-primary'
                              }`}
                            />
                          )}
                        </InputMask>
                      )}
                    />
                    {errors.telefone && <p className="text-red-400 text-sm mt-1">{errors.telefone.message}</p>}
                  </div>
                  <div>
                    <textarea 
                      placeholder="Conte-nos sobre seu projeto..." 
                      rows={4}
                      {...register('mensagem')}
                      className={`w-full px-4 py-3 bg-dark-900/50 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all resize-none ${
                        errors.mensagem 
                          ? 'border-red-500 focus:border-red-400' 
                          : formData.mensagem && formData.mensagem.length >= 10
                          ? 'border-green-500 focus:border-green-400' 
                          : 'border-transparent focus:border-primary'
                      }`}
                    ></textarea>
                    {errors.mensagem && <p className="text-red-400 text-sm mt-1">{errors.mensagem.message}</p>}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={enviandoContato}
                    className="w-full glass-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: enviandoContato ? 1 : 1.02 }}
                    whileTap={{ scale: enviandoContato ? 1 : 0.98 }}
                  >
                    <span className="relative z-10">
                      {enviandoContato ? 'Enviando...' : 'Enviar mensagem'}
                    </span>
                  </motion.button>
                </form>
              </motion.div>
            </div>
            
            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider font-medium">Nos siga nas redes sociais</p>
              <div className="flex justify-center gap-4">
                {[
                  { 
                    name: "LinkedIn", 
                    url: "https://linkedin.com", 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
                    color: "hover:text-[#0A66C2]"
                  },
                  { 
                    name: "Instagram", 
                    url: "https://instagram.com", 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    ),
                    color: "hover:text-[#E4405F]"
                  },
                  { 
                    name: "GitHub", 
                    url: "https://github.com", 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    ),
                    color: "hover:text-white"
                  },
                  { 
                    name: "Twitter", 
                    url: "https://twitter.com", 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ),
                    color: "hover:text-[#1DA1F2]"
                  }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`glass-card w-12 h-12 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            

          </motion.div>
        </div>
      </section>
    </div>
  )
}