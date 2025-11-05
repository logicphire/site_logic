import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Projetos from './pages/Projetos'
import Orcamento from './pages/Orcamento'
import Login from './pages/admin/Login'
import Register from './pages/admin/Register'
import Dashboard from './pages/admin/Dashboard'
import AdminProjetos from './pages/admin/Projetos'
import AdminOrcamentos from './pages/admin/Orcamentos'
import AdminContatos from './pages/admin/Contatos'
import AdminUsuarios from './pages/admin/Usuarios'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div className="min-h-screen flex flex-col bg-black text-white">
              <Header />
              <main className="flex-1">
                <Home />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/projetos" element={
            <div className="min-h-screen flex flex-col bg-black text-white">
              <Header />
              <main className="flex-1">
                <Projetos />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/orcamento" element={
            <div className="min-h-screen flex flex-col bg-black text-white">
              <Header />
              <main className="flex-1">
                <Orcamento />
              </main>
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/projetos" element={
            <ProtectedRoute>
              <AdminProjetos />
            </ProtectedRoute>
          } />
          <Route path="/admin/orcamentos" element={
            <ProtectedRoute>
              <AdminOrcamentos />
            </ProtectedRoute>
          } />
          <Route path="/admin/contatos" element={
            <ProtectedRoute>
              <AdminContatos />
            </ProtectedRoute>
          } />
          <Route path="/admin/usuarios" element={
            <ProtectedRoute>
              <AdminUsuarios />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
