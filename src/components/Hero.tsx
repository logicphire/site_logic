import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Rocket, Code2, Smartphone, Palette } from 'lucide-react'

export default function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Tech Background Image */}
      <div className="absolute inset-0">
        {/* Background image - Opções para testar: */}
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
          alt="Tech background"
          className="w-full h-full object-cover opacity-20"
          loading="eager"
        />
        {/* 
        OPÇÕES DE IMAGEM PARA TESTAR (troque a URL acima):
        
        1. CIRCUITOS/HARDWARE (atual):
        https://images.unsplash.com/photo-1518335935020-cda438ca1d3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80
        
        2. WORKSPACE LIMPO:
        https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80
        
        3. ABSTRACT TECH/REDE:
        https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2032&q=80
        
        4. SERVIDOR/DATA CENTER:
        https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2061&q=80
        
        5. KEYBOARD/SETUP:
        https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2079&q=80
        */}
        
        {/* Tech pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="tech-grid"></div>
          <div className="code-lines"></div>
          <div className="floating-elements"></div>
        </div>
        
        {/* Floating code elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Code snippets */}
          <motion.div 
            className="absolute top-20 left-20 text-primary/30 font-mono text-sm"
            animate={{ 
              opacity: [0.2, 0.6, 0.2],
              y: [0, -10, 0] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div>{'<div className="hero">'}</div>
            <div className="ml-4">{'const logic = () => {'}</div>
            <div className="ml-8">{'return innovation;'}</div>
            <div className="ml-4">{'};'}</div>
            <div>{'</div>'}</div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-32 right-16 text-accent-purple/30 font-mono text-xs"
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
              x: [0, 5, 0] 
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          >
            <div>{'// Building the future'}</div>
            <div>{'npm install innovation'}</div>
            <div>{'git commit -m "magic"'}</div>
          </motion.div>
          
          <motion.div 
            className="absolute top-1/2 right-1/4 text-accent-cyan/25 font-mono text-xs"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 2, 0] 
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          >
            <div>{'function createMagic() {'}</div>
            <div className="ml-2">{'while(coding) {'}</div>
            <div className="ml-4">{'dreams++; '}</div>
            <div className="ml-2">{'}'}</div>
            <div>{'}'}</div>
          </motion.div>
        </div>
        
        {/* Purple gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-dark-900/60 to-secondary/40"></div>
      </div>
      
      {/* Background with animated elements */}
      <div className="absolute inset-0">
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-accent-purple/30 to-accent-pink/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 0.8, 1.2],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-accent-cyan/15 to-accent-blue/15 rounded-full blur-3xl"
          animate={{ 
            scale: [0.8, 1.4, 0.8],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex items-center justify-center min-h-screen text-center pt-20">
        <motion.div 
          className="space-y-20 py-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Main heading - Sem o nome da empresa */}
          <motion.h1 
            className="text-5xl md:text-7xl font-light leading-tight max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-white">Criamos </span>
            <span className="bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple bg-clip-text text-transparent font-medium">
              experiências digitais
            </span>
            <span className="text-white"> que </span>
            <span className="bg-gradient-to-r from-accent-pink via-secondary to-primary bg-clip-text text-transparent font-medium italic">
              transformam negócios
            </span>
          </motion.h1>
          
          {/* Stats - Centralizadas */}
          <motion.div 
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {[
              { number: "50+", label: "Projetos" },
              { number: "20+", label: "Clientes" },
              { number: "100%", label: "Satisfação" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                  index === 0 ? 'text-primary' : 
                  index === 1 ? 'text-accent-cyan' : 'text-accent-pink'
                }`}>
                  {stat.number}
                </div>
                <p className="text-sm text-gray-400 font-mono tracking-wider">
                  {stat.label.toUpperCase()}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTA Buttons - Centralizados */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <Link
              to="/projetos"
              className="glass-button-primary group"
            >
              <span className="relative z-10">Ver nossos projetos</span>
            </Link>
            
            <Link
              to="/orcamento"
              className="glass-button-secondary"
            >
              <span className="relative z-10">Solicitar orçamento</span>
            </Link>
          </motion.div>
          
          {/* Tech symbols scattered */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Programming symbols */}
            {[
              { symbol: '<>', top: '15%', left: '10%', delay: 0 },
              { symbol: '{}', top: '25%', right: '15%', delay: 1 },
              { symbol: '[]', top: '70%', left: '20%', delay: 2 },
              { symbol: '/>', top: '60%', right: '25%', delay: 3 },
              { symbol: '()', top: '40%', left: '5%', delay: 4 },
              { symbol: '=>', top: '80%', right: '10%', delay: 5 },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="absolute text-2xl text-primary/20 font-mono font-bold"
                style={{ 
                  top: item.top, 
                  left: item.left, 
                  right: item.right 
                }}
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.1, 0.3, 0.1],
                  rotate: [0, 10, 0],
                }}
                transition={{ 
                  duration: 6,
                  delay: item.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {item.symbol}
              </motion.div>
            ))}
          </div>

          {/* Floating tech icons */}
          <motion.div 
            className="flex justify-center space-x-8 pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {[
              { Icon: Zap, color: 'text-primary' },
              { Icon: Rocket, color: 'text-secondary' },
              { Icon: Code2, color: 'text-accent-cyan' },
              { Icon: Smartphone, color: 'text-accent-purple' },
              { Icon: Palette, color: 'text-accent-pink' }
            ].map(({ Icon, color }, index) => (
              <motion.div
                key={index}
                className={`${color} opacity-60 hover:opacity-100 transition-opacity cursor-default`}
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{ 
                  duration: 3,
                  delay: index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.2 }}
              >
                <Icon size={32} strokeWidth={1.5} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}