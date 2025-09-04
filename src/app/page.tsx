'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Target, Coins } from 'lucide-react'
import { initWeb3Auth } from '@/lib/web3auth'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [tournaments, setTournaments] = useState<any[]>([])

  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      setTournaments(data || [])
    } catch (error) {
      console.error('Error loading tournaments:', error)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const web3auth = await initWeb3Auth()
      const web3authProvider = await web3auth.connect()
      
      if (web3authProvider) {
        const userInfo = await web3auth.getUserInfo()
        setUser(userInfo)
        
        // Save user to Supabase
        const { error } = await supabase
          .from('users')
          .upsert({
            id: userInfo.verifierId,
            email: userInfo.email,
            name: userInfo.name,
            role: 'player',
            oro_balance: 1000 // Starting balance
          })
        
        if (error) console.error('Error saving user:', error)
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = () => {
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Fantasy Horse League
            </h1>
          </div>
          <div className="flex space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">1000 ORO</span>
                </div>
                <span className="text-white">¡Hola, {user.name}!</span>
              </div>
            ) : (
              <>
                <Button 
                  onClick={handleLogin} 
                  disabled={isLoading}
                  className="fantasy-gradient"
                >
                  {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
                </Button>
                <Button 
                  onClick={handleAdminLogin}
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  Admin
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Construye tu Establo
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Crea tu equipo de caballos de carreras, compite contra otros jugadores y gana ORO en el juego de fantasía más emocionante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="fantasy-gradient text-lg px-8 py-4">
              <Trophy className="mr-2 h-5 w-5" />
              Unirse a Torneo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">
              <Target className="mr-2 h-5 w-5" />
              Ver Clasificación
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            ¿Cómo Funciona?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3 text-white">1. Únete</h4>
              <p className="text-slate-300">
                Regístrate con tu cuenta social y recibe 1000 ORO gratis para empezar.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <Trophy className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3 text-white">2. Construye</h4>
              <p className="text-slate-300">
                Selecciona tus caballos favoritos dentro del presupuesto para crear tu "Establo".
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <Target className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-3 text-white">3. Compite</h4>
              <p className="text-slate-300">
                Gana puntos basados en el rendimiento de tus caballos y sube en la clasificación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Tournaments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            Torneos Activos
          </h3>
          {tournaments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                  <h4 className="text-xl font-semibold mb-2 text-white">{tournament.name}</h4>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-300">Entrada: {tournament.entry_fee} ORO</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      tournament.is_locked 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {tournament.is_locked ? 'Cerrado' : 'Abierto'}
                    </span>
                  </div>
                  <Button 
                    className="w-full fantasy-gradient" 
                    disabled={tournament.is_locked}
                  >
                    {tournament.is_locked ? 'Ver Resultados' : 'Unirse'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No hay torneos activos en este momento</p>
              <p className="text-slate-500">¡Vuelve pronto para nuevas competencias!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            2024 Fantasy Horse League. Plataforma de juego responsable con moneda virtual.
          </p>
        </div>
      </footer>
    </div>
  )
}
