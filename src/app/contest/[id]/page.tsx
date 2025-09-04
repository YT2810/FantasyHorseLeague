'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Check, Clock, MapPin, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Horse {
  id: string
  name: string
  jockey: string
  trainer: string
  odds: string
  cost: number
  position: number
  silks: string
}

interface Contest {
  id: string
  name: string
  track: string
  date: string
  time: string
  prize: string
  entry: string
  participants: number
  status: string
}

interface Race {
  id: string
  name: string
  time: string
  horses: Horse[]
}

export default function ContestPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedHorses, setSelectedHorses] = useState<{[raceId: string]: Horse}>({})
  const [budget] = useState(50000)
  const [usedBudget, setUsedBudget] = useState(0)
  
  // Mock contest data
  const contest: Contest = {
    id: params.id,
    name: 'KEENELAND CHALLENGE',
    track: 'Keeneland',
    date: 'Today',
    time: '2:00 PM EST',
    prize: '$10,000',
    entry: '$25',
    participants: 1247,
    status: 'OPEN'
  }

  // Mock races data - structured by race
  const races: Race[] = [
    {
      id: 'race-1',
      name: 'Race 1 - Maiden Special Weight',
      time: '2:00 PM',
      horses: [
        {
          id: 'r1-h1',
          name: 'THUNDER BOLT',
          jockey: 'J. Rosario',
          trainer: 'T. Pletcher',
          odds: '3-1',
          cost: 8000,
          position: 1,
          silks: 'red'
        },
        {
          id: 'r1-h2',
          name: 'LIGHTNING STRIKE',
          jockey: 'J. Velazquez',
          trainer: 'S. McGaughey III',
          odds: '5-2',
          cost: 9000,
          position: 2,
          silks: 'blue'
        },
        {
          id: 'r1-h3',
          name: 'STORM CHASER',
          jockey: 'L. Saez',
          trainer: 'B. Cox',
          odds: '4-1',
          cost: 7000,
          position: 3,
          silks: 'green'
        },
        {
          id: 'r1-h4',
          name: 'WIND RUNNER',
          jockey: 'F. Geroux',
          trainer: 'K. McPeek',
          odds: '8-1',
          cost: 5000,
          position: 4,
          silks: 'yellow'
        }
      ]
    },
    {
      id: 'race-2',
      name: 'Race 2 - Allowance Optional Claiming',
      time: '2:30 PM',
      horses: [
        {
          id: 'r2-h1',
          name: 'GOLDEN ARROW',
          jockey: 'T. Gaffalione',
          trainer: 'D. Stewart',
          odds: '2-1',
          cost: 10000,
          position: 1,
          silks: 'orange'
        },
        {
          id: 'r2-h2',
          name: 'SILVER BULLET',
          jockey: 'J. Alvarado',
          trainer: 'W. Mott',
          odds: '7-2',
          cost: 8500,
          position: 2,
          silks: 'purple'
        },
        {
          id: 'r2-h3',
          name: 'BRONZE MEDAL',
          jockey: 'I. Ortiz Jr.',
          trainer: 'B. Baffert',
          odds: '5-1',
          cost: 6500,
          position: 3,
          silks: 'pink'
        },
        {
          id: 'r2-h4',
          name: 'COPPER COIN',
          jockey: 'M. Franco',
          trainer: 'C. Brown',
          odds: '12-1',
          cost: 3500,
          position: 4,
          silks: 'cyan'
        }
      ]
    }
  ]

  const handleHorseSelect = (raceId: string, horse: Horse) => {
    const currentSelection = selectedHorses[raceId]
    const newSelectedHorses = { ...selectedHorses }
    
    if (currentSelection && currentSelection.id === horse.id) {
      // Deselect if clicking the same horse
      delete newSelectedHorses[raceId]
      setUsedBudget(usedBudget - horse.cost)
    } else {
      // Calculate budget change
      const costDifference = currentSelection 
        ? horse.cost - currentSelection.cost 
        : horse.cost
      
      if (usedBudget + costDifference <= budget) {
        newSelectedHorses[raceId] = horse
        setUsedBudget(usedBudget + costDifference)
      } else {
        return // Can't afford this selection
      }
    }
    
    setSelectedHorses(newSelectedHorses)
  }

  const getSilkColor = (color: string) => {
    const colors: { [key: string]: string } = {
      red: 'bg-red-500',
      blue: 'bg-blue-500', 
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      cyan: 'bg-cyan-500'
    }
    return colors[color] || 'bg-gray-500'
  }

  const selectedHorsesArray = Object.values(selectedHorses)

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
                <h1 className="text-xl font-bold text-white">{contest.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {contest.track}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {contest.time}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">{contest.prize}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Prize Pool</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{contest.entry}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Entry Fee</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{contest.participants.toLocaleString()}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Entries</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Horse Selection */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Select Horses</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{selectedHorsesArray.length}/{races.length}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Races Selected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-cyan-400">${(budget - usedBudget).toLocaleString()}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Remaining</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {races.map((race) => (
                  <div key={race.id} className="border border-slate-600/50 rounded-lg p-4">
                    <div className="mb-4 pb-3 border-b border-slate-600/30">
                      <h3 className="text-lg font-bold text-white">{race.name}</h3>
                      <p className="text-sm text-slate-400">Post Time: {race.time}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {race.horses.map((horse) => {
                        const isSelected = selectedHorses[race.id]?.id === horse.id
                        const currentSelection = selectedHorses[race.id]
                        const costDifference = currentSelection ? horse.cost - currentSelection.cost : horse.cost
                        const canSelect = usedBudget + costDifference <= budget || isSelected
                        
                        return (
                          <div
                            key={horse.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500/20 ring-1 ring-blue-500/50'
                                : canSelect
                                ? 'border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50'
                                : 'border-slate-700 bg-slate-800/10 opacity-50 cursor-not-allowed'
                            }`}
                            onClick={() => canSelect && handleHorseSelect(race.id, horse)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {horse.position}
                                  </div>
                                  <div className={`w-5 h-5 rounded-full border-2 border-white ${getSilkColor(horse.silks)}`}></div>
                                </div>
                                
                                <div>
                                  <h4 className="text-base font-bold text-white">{horse.name}</h4>
                                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                                    <span>J: {horse.jockey}</span>
                                    <span>T: {horse.trainer}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-sm font-bold text-white">{horse.odds}</p>
                                  <p className="text-xs text-slate-400">Odds</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-green-400">${horse.cost.toLocaleString()}</p>
                                  <p className="text-xs text-slate-400">Cost</p>
                                </div>
                                <div className="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center">
                                  {isSelected ? (
                                    <Check className="h-3 w-3 text-blue-400" />
                                  ) : (
                                    <Plus className="h-3 w-3 text-slate-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lineup Summary */}
          <div className="space-y-6">
            {/* Budget Summary */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Budget</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Budget:</span>
                  <span className="text-white font-semibold">${budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Used:</span>
                  <span className="text-red-400 font-semibold">${usedBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-600 pt-3">
                  <span className="text-slate-300">Remaining:</span>
                  <span className="text-green-400 font-semibold">${(budget - usedBudget).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${(usedBudget / budget) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{Math.round((usedBudget / budget) * 100)}% used</p>
              </div>
            </div>

            {/* Selected Horses */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Stable ({selectedHorsesArray.length}/{races.length})</h3>
              
              {selectedHorsesArray.length > 0 ? (
                <div className="space-y-3">
                  {races.map((race) => {
                    const selectedHorse = selectedHorses[race.id]
                    if (!selectedHorse) return null
                    
                    return (
                      <div key={race.id} className="border border-slate-600/30 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">{race.name}</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border border-white ${getSilkColor(selectedHorse.silks)}`}></div>
                            <span className="text-white font-medium">{selectedHorse.name}</span>
                          </div>
                          <span className="text-green-400 font-semibold">${selectedHorse.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">Select one horse from each race to build your stable</p>
              )}
            </div>

            {/* Enter Contest */}
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-4 text-lg"
              disabled={selectedHorsesArray.length !== races.length}
            >
              <Trophy className="mr-2 h-5 w-5" />
              {selectedHorsesArray.length === races.length ? 'Enter Contest' : `Select ${races.length - selectedHorsesArray.length} more horses`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
