'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trophy, Medal, Crown, TrendingUp, Users, Target, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  points: number
  winnings: string
  contests: number
  winRate: number
  badge?: string
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overall' | 'weekly' | 'daily'>('overall')

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      username: 'madeonlight',
      avatar: '🏆',
      points: 545,
      winnings: '$2,450',
      contests: 28,
      winRate: 67.8,
      badge: 'champion'
    },
    {
      rank: 2,
      username: 'ghosteagle',
      avatar: '👻',
      points: 522,
      winnings: '$2,100',
      contests: 31,
      winRate: 58.1
    },
    {
      rank: 3,
      username: 'UnicornRock',
      avatar: '🦄',
      points: 264,
      winnings: '$1,850',
      contests: 25,
      winRate: 72.0
    },
    {
      rank: 4,
      username: 'BestStableFever',
      avatar: '🐎',
      points: 200,
      winnings: '$1,650',
      contests: 22,
      winRate: 63.6
    },
    {
      rank: 5,
      username: 'alwaysWINNING',
      avatar: '💪',
      points: 175,
      winnings: '$1,420',
      contests: 19,
      winRate: 78.9
    },
    {
      rank: 6,
      username: 'farmgirl22',
      avatar: '👩‍🌾',
      points: 140,
      winnings: '$1,200',
      contests: 24,
      winRate: 45.8
    },
    {
      rank: 7,
      username: 'STAMPEDE',
      avatar: '🌪️',
      points: 135,
      winnings: '$1,100',
      contests: 18,
      winRate: 61.1
    },
    {
      rank: 8,
      username: 'ToughHorse2best',
      avatar: '💎',
      points: 109,
      winnings: '$950',
      contests: 16,
      winRate: 56.3
    },
    {
      rank: 9,
      username: 'FarmLife',
      avatar: '🚜',
      points: 100,
      winnings: '$875',
      contests: 21,
      winRate: 42.9
    },
    {
      rank: 10,
      username: 'readfortheoff',
      avatar: '📚',
      points: 96,
      winnings: '$800',
      contests: 15,
      winRate: 53.3
    }
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30'
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30'
      default:
        return 'bg-slate-800/40 border-slate-700/50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/30 backdrop-blur-sm bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="border-l border-slate-600 pl-4">
                <h1 className="text-xl font-bold text-white">Leaderboard</h1>
                <p className="text-sm text-slate-400">Top performers this season</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'daily'
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'weekly'
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setActiveTab('overall')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'overall'
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Overall
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 text-center">
            <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">$127,500</h3>
            <p className="text-slate-400">Total Prize Pool</p>
          </div>
          
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 text-center">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">8,247</h3>
            <p className="text-slate-400">Active Players</p>
          </div>
          
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 text-center">
            <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">156</h3>
            <p className="text-slate-400">Contests Today</p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {activeTab === 'overall' && 'Overall Rankings'}
                {activeTab === 'weekly' && 'This Week'}
                {activeTab === 'daily' && 'Today\'s Leaders'}
              </h2>
              <div className="text-sm text-slate-400">
                Last updated: 2 minutes ago
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-700/50">
            {leaderboardData.map((entry) => (
              <div
                key={entry.rank}
                className={`p-6 hover:bg-slate-800/60 transition-colors ${getRankBg(entry.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                        {entry.avatar}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-white">{entry.username}</h3>
                          {entry.badge === 'champion' && (
                            <Crown className="h-5 w-5 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{entry.contests} contests played</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{entry.points}</p>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Points</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">{entry.winnings}</p>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Winnings</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-400">{entry.winRate}%</p>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Win Rate</p>
                    </div>
                    
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Compete?</h3>
            <p className="text-slate-300 mb-6">
              Join the leaderboard and compete against the best players
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Enter Contest
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
