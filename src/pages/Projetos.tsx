import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../services/api'

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
  destaque: boolean;
}

export default function Projetos() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar projeto em destaque
  const projetoDestaque = projects.find(p => p.destaque);

  // Projetos que não estão em destaque
  const projetosRegulares = projects.filter(p => !p.destaque);

  // Extrair categorias únicas dos projetos
  const categoriasUnicas = ['Todos', ...new Set(projects.map(p => p.categoria))];

  const projetosFiltrados = selectedCategory === 'Todos' 
    ? projetosRegulares 
    : projetosRegulares.filter(p => p.categoria === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-dark-900">
        {/* Skeleton do Projeto em Destaque */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-800 to-dark-700 animate-pulse"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
            <div className="max-w-3xl">
              {/* Skeleton Badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-9 w-48 bg-white/10 rounded-full animate-pulse"></div>
                <div className="h-1 w-1 bg-white/20 rounded-full"></div>
                <div className="h-6 w-24 bg-white/10 rounded animate-pulse"></div>
              </div>

              {/* Skeleton Title */}
              <div className="space-y-4 mb-6">
                <div className="h-20 w-full bg-white/10 rounded-2xl animate-pulse"></div>
                <div className="h-20 w-3/4 bg-white/10 rounded-2xl animate-pulse"></div>
              </div>

              {/* Skeleton Description */}
              <div className="space-y-3 mb-10">
                <div className="h-6 w-full bg-white/5 rounded-lg animate-pulse"></div>
                <div className="h-6 w-5/6 bg-white/5 rounded-lg animate-pulse"></div>
                <div className="h-6 w-4/6 bg-white/5 rounded-lg animate-pulse"></div>
              </div>

              {/* Skeleton Tech Stack */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-24 bg-white/5 rounded-xl animate-pulse"></div>
                ))}
              </div>

              {/* Skeleton Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-16 w-full sm:w-64 bg-primary/30 rounded-2xl animate-pulse"></div>
                <div className="h-16 w-full sm:w-64 bg-white/10 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Skeleton Grid de Projetos */}
        <section className="py-24 bg-gradient-to-b from-dark-900 to-dark-800">
          <div className="max-w-7xl mx-auto px-6">
            {/* Skeleton Header */}
            <div className="text-center mb-16">
              <div className="h-14 w-96 bg-white/10 rounded-2xl mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 w-64 bg-white/5 rounded-lg mx-auto animate-pulse"></div>
            </div>

            {/* Skeleton Filtros */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-32 bg-white/10 rounded-xl animate-pulse"></div>
              ))}
            </div>

            {/* Skeleton Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden"
                >
                  {/* Skeleton Image */}
                  <div className="h-64 bg-gradient-to-br from-white/10 to-white/5 animate-pulse"></div>
                  
                  {/* Skeleton Content */}
                  <div className="p-6">
                    <div className="h-8 w-3/4 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 w-full bg-white/5 rounded animate-pulse"></div>
                      <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse"></div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-6 w-16 bg-white/5 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-12 w-full bg-primary/20 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const getLinkIcon = (tipo: string) => {
    switch(tipo) {
      case 'playstore':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
          </svg>
        );
      case 'appstore':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-dark-900">
      {/* Projeto em Destaque - Full Width Hero */}
      {projetoDestaque && (
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src={projetoDestaque.imagem} 
            alt={projetoDestaque.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/95 to-dark-900/80"></div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="px-4 py-2 bg-primary rounded-full text-white text-sm font-bold uppercase tracking-wider">
                  🌟 Projeto em Destaque
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{projetoDestaque.plataforma}</span>
              </div>

              {/* Title */}
              <h1 className="text-6xl md:text-8xl font-black mb-6 text-white leading-none">
                {projetoDestaque.titulo}
              </h1>

              {/* Description */}
              <p className="text-2xl text-gray-300 mb-10 leading-relaxed">
                {projetoDestaque.descricao}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-3 mb-10">
                {projetoDestaque.tecnologias.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-gray-300 text-sm hover:bg-white/10 transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href={projetoDestaque.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-10 py-5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getLinkIcon(projetoDestaque.tipoLink || 'website')}
                  <span>Ver Projeto</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>

                <Link
                  to="/orcamento"
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white rounded-2xl font-bold text-lg transition-all text-center"
                >
                  Quero um Projeto Assim
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>
      )}

      {/* Filtros + Grid de Projetos */}
      <section className="py-24 relative bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Explore Nosso <span className="text-primary">Portfólio</span>
            </h2>
            <p className="text-xl text-gray-400">
              Mais de {projects.length} projetos desenvolvidos com excelência
            </p>
          </motion.div>

          {/* Category Filters */}
          <div className="flex justify-center gap-4 mb-16 flex-wrap">
            {categoriasUnicas.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-2xl font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid - Bento Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetosFiltrados.map((projeto, index) => (
              <motion.div
                key={projeto.id}
                className="group relative overflow-hidden rounded-3xl bg-dark-800 border border-white/5 hover:border-primary/50 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredProject(projeto.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={projeto.imagem} 
                    alt={projeto.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-dark-800/60 to-transparent"></div>
                  
                  {/* Overlay on Hover */}
                  <div className={`absolute inset-0 bg-primary/90 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                    hoveredProject === projeto.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="text-center px-6">
                      <p className="text-white text-lg mb-4">{projeto.descricao}</p>
                      <div className="flex gap-2 justify-center flex-wrap">
                        {projeto.tecnologias.slice(0, 4).map((tech, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white/20 rounded-lg text-white text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold mb-3">
                    {projeto.categoria}
                  </span>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {projeto.titulo}
                  </h3>

                  <p className="text-gray-400 text-sm mb-6">{projeto.plataforma}</p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.a
                      href={projeto.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40 px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {getLinkIcon(projeto.tipoLink || 'site')}
                      Ver {projeto.tipo}
                    </motion.a>

                    <Link
                      to="/orcamento"
                      className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all text-center"
                    >
                      Orçamento
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 relative bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white">
              Pronto para começar <br/>
              <span className="text-primary">seu projeto?</span>
            </h2>
            
            <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Transforme sua ideia em realidade. Nossa equipe está pronta para criar algo incrível.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/orcamento"
                className="px-12 py-6 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-xl transition-all shadow-xl shadow-primary/30"
              >
                Solicitar Orçamento
              </Link>
              
              <Link
                to="/#contato"
                className="px-12 py-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl font-bold text-xl transition-all"
              >
                Falar Conosco
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
