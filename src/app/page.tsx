'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trophy, Target, Coins, Play, Star, TrendingUp, Calendar, MapPin, Clock } from 'lucide-react'
import { initWeb3Auth } from '@/lib/web3auth'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<{name: string; email: string; verifierId: string} | null>(null)
  useEffect(() => {
    loadTournaments()
  }, [])

  const loadTournaments = async () => {
    try {
      const { error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      // setTournaments(data || [])
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

  // Mock data for demo
  const mockTournaments = [
    {
      id: '1',
      name: 'KEENELAND CHALLENGE',
      track: 'Keeneland',
      date: 'Today',
      time: '2:00 PM EST',
      prize: '$10,000',
      entry: '$25',
      participants: 1247,
      status: 'LIVE'
    },
    {
      id: '2', 
      name: 'CHURCHILL DOWNS CLASSIC',
      track: 'Churchill Downs',
      date: 'Tomorrow',
      time: '3:30 PM EST',
      prize: '$5,000',
      entry: '$10',
      participants: 892,
      status: 'OPEN'
    },
    {
      id: '3',
      name: 'SANTA ANITA DERBY',
      track: 'Santa Anita',
      date: 'Saturday',
      time: '5:00 PM PST',
      prize: '$25,000',
      entry: '$50',
      participants: 2156,
      status: 'OPEN'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/30 backdrop-blur-sm bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Fantasy Horse League</h1>
                  <p className="text-xs text-slate-400">A New Breed of Gaming</p>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
              <a href="#contests" className="text-slate-300 hover:text-white transition-colors">Contests</a>
              <a href="/leaderboard" className="text-slate-300 hover:text-white transition-colors">Leaderboard</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">About</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-full">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold text-sm">1,000 ORO</span>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{user.name[0]}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={handleLogin} 
                    disabled={isLoading}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    {isLoading ? 'Connecting...' : 'Sign In'}
                  </Button>
                  <Button 
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play Now
                  </Button>
                  <Button 
                    onClick={handleAdminLogin}
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                  >
                    Admin
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                A New Breed of Gaming
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Is Here
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Your home for Daily Horse Racing contests. Choose a track, pick your horses, win and collect!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-8 py-4"
                onClick={() => window.location.href = '/contest/1'}
              >
                <Play className="mr-2 h-5 w-5" />
                Play Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => window.location.href = '/leaderboard'}
              >
                <Target className="mr-2 h-5 w-5" />
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Contests */}
      <section id="contests" className="py-16 bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-white">Featured Contests</h3>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              View All Contests
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {mockTournaments.map((tournament) => (
              <div key={tournament.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{tournament.name}</h4>
                    <div className="flex items-center text-slate-400 text-sm space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {tournament.track}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {tournament.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {tournament.time}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tournament.status === 'LIVE' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {tournament.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{tournament.prize}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Prize Pool</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{tournament.entry}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Entry Fee</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{tournament.participants.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Entries</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  disabled={tournament.status === 'LIVE'}
                  onClick={() => window.location.href = `/contest/${tournament.id}`}
                >
                  {tournament.status === 'LIVE' ? 'Contest Live' : 'Enter Contest'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">It&apos;s Simple</h3>
            <p className="text-xl text-slate-300">Three easy steps to start winning</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white">Choose a Track</h4>
              <p className="text-slate-300 text-lg leading-relaxed">
                Select from daily racing contests at premier tracks like Keeneland, Churchill Downs, and Santa Anita.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white">Pick Your Horses</h4>
              <p className="text-slate-300 text-lg leading-relaxed">
                Build your stable within budget constraints. Use our data and insights to make winning selections.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-white">Win and Collect</h4>
              <p className="text-slate-300 text-lg leading-relaxed">
                Earn points based on your horses&apos; performance and climb the leaderboard to win real prizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-6">Start Winning Big Today</h3>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of players competing in daily horse racing contests
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-12 py-4">
            <Play className="mr-2 h-6 w-6" />
            Play Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Fantasy Horse League</h4>
                  <p className="text-sm text-slate-400">A New Breed of Gaming</p>
                </div>
              </div>
              <p className="text-slate-400 mb-4">
                The premier destination for daily horse racing fantasy contests. 
                Play responsibly with virtual currency.
              </p>
            </div>
            
            <div>
              <h5 className="text-white font-semibold mb-4">Game</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contests</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rewards</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Responsible Gaming</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Fantasy Horse League. All rights reserved. Play responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
