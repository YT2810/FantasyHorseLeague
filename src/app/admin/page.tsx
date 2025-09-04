'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Lock, Unlock, Trophy, Calculator, Save, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useDropzone } from 'react-dropzone'

interface Horse {
  id?: string
  horse_number: number
  horse_name: string
  jockey: string
  trainer: string
  morning_line_odds: number
  virtual_cost: number
}

interface Race {
  id?: string
  race_number: number
  race_name: string
  post_time: string
  track: string
  horses: Horse[]
}

interface Tournament {
  id?: string
  name: string
  entry_fee: number
  total_budget: number
  is_locked: boolean
  races: Race[]
}

export default function AdminDashboard() {
  const [tournament, setTournament] = useState<Tournament>({
    name: '',
    entry_fee: 100,
    total_budget: 50000,
    is_locked: false,
    races: []
  })
  const [isUploading, setIsUploading] = useState(false)
  const [pdfData, setPdfData] = useState<{tournament_name: string; races: Race[]} | null>(null)
  const [activeTab, setActiveTab] = useState('upload')

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || file.type !== 'application/pdf') {
      alert('Por favor selecciona un archivo PDF válido')
      return
    }

    setIsUploading(true)
    try {
      // Simular parsing de PDF - en producción esto sería una llamada a Supabase Edge Function
      const mockData = {
        tournament_name: "Derby de Kentucky - Sábado",
        races: [
          {
            race_number: 1,
            race_name: "Carrera 1 - Maiden Special Weight",
            post_time: "14:00",
            track: "Churchill Downs",
            horses: [
              { horse_number: 1, horse_name: "Thunder Bolt", jockey: "J. Rodriguez", trainer: "M. Smith", morning_line_odds: 3.5, virtual_cost: 0 },
              { horse_number: 2, horse_name: "Lightning Strike", jockey: "A. Garcia", trainer: "P. Johnson", morning_line_odds: 5.0, virtual_cost: 0 },
              { horse_number: 3, horse_name: "Storm Chaser", jockey: "L. Martinez", trainer: "R. Williams", morning_line_odds: 8.0, virtual_cost: 0 },
              { horse_number: 4, horse_name: "Wind Runner", jockey: "C. Davis", trainer: "S. Brown", morning_line_odds: 12.0, virtual_cost: 0 },
              { horse_number: 5, horse_name: "Speed Demon", jockey: "M. Wilson", trainer: "T. Miller", morning_line_odds: 15.0, virtual_cost: 0 }
            ]
          },
          {
            race_number: 2,
            race_name: "Carrera 2 - Allowance Optional Claiming",
            post_time: "14:30",
            track: "Churchill Downs",
            horses: [
              { horse_number: 1, horse_name: "Golden Arrow", jockey: "K. Anderson", trainer: "D. Taylor", morning_line_odds: 2.5, virtual_cost: 0 },
              { horse_number: 2, horse_name: "Silver Bullet", jockey: "N. Thomas", trainer: "J. Jackson", morning_line_odds: 4.0, virtual_cost: 0 },
              { horse_number: 3, horse_name: "Bronze Star", jockey: "H. White", trainer: "L. Harris", morning_line_odds: 6.5, virtual_cost: 0 },
              { horse_number: 4, horse_name: "Copper Flash", jockey: "B. Martin", trainer: "C. Thompson", morning_line_odds: 10.0, virtual_cost: 0 },
              { horse_number: 5, horse_name: "Iron Will", jockey: "G. Garcia", trainer: "A. Martinez", morning_line_odds: 20.0, virtual_cost: 0 }
            ]
          }
        ]
      }

      setPdfData(mockData)
      setTournament(prev => ({
        ...prev,
        name: mockData.tournament_name,
        races: mockData.races
      }))
      setActiveTab('validate')
    } catch (error) {
      console.error('Error parsing PDF:', error)
      alert('Error al procesar el PDF')
    } finally {
      setIsUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  })

  const calculateHorseCosts = () => {
    const baseCost = 5000
    const multiplier = 100000

    const updatedRaces = tournament.races.map(race => ({
      ...race,
      horses: race.horses.map(horse => ({
        ...horse,
        virtual_cost: Math.round(baseCost + (multiplier / (horse.morning_line_odds + 1)))
      }))
    }))

    setTournament(prev => ({
      ...prev,
      races: updatedRaces
    }))
  }

  const saveTournament = async () => {
    try {
      // Guardar torneo en Supabase
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .insert({
          name: tournament.name,
          entry_fee: tournament.entry_fee,
          total_budget: tournament.total_budget,
          is_locked: tournament.is_locked,
          created_by: 'admin' // En producción esto sería el ID del admin autenticado
        })
        .select()
        .single()

      if (tournamentError) throw tournamentError

      // Guardar carreras y caballos
      for (const race of tournament.races) {
        const { data: raceData, error: raceError } = await supabase
          .from('races')
          .insert({
            tournament_id: tournamentData.id,
            race_number: race.race_number,
            race_name: race.race_name,
            post_time: race.post_time,
            track: race.track
          })
          .select()
          .single()

        if (raceError) throw raceError

        const horsesData = race.horses.map(horse => ({
          race_id: raceData.id,
          horse_number: horse.horse_number,
          horse_name: horse.horse_name,
          jockey: horse.jockey,
          trainer: horse.trainer,
          morning_line_odds: horse.morning_line_odds,
          virtual_cost: horse.virtual_cost
        }))

        const { error: horsesError } = await supabase
          .from('horses')
          .insert(horsesData)

        if (horsesError) throw horsesError
      }

      alert('Torneo guardado exitosamente')
      setActiveTab('results')
    } catch (error) {
      console.error('Error saving tournament:', error)
      alert('Error al guardar el torneo')
    }
  }

  const toggleTournamentLock = async () => {
    const newLockStatus = !tournament.is_locked
    setTournament(prev => ({ ...prev, is_locked: newLockStatus }))
    
    // En producción, actualizar en la base de datos
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({ is_locked: newLockStatus })
        .eq('name', tournament.name)
      
      if (error) throw error
      alert(`Torneo ${newLockStatus ? 'bloqueado' : 'desbloqueado'} exitosamente`)
    } catch (error) {
      console.error('Error updating tournament lock status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg">
          {[
            { id: 'upload', label: 'Subir PDF', icon: Upload },
            { id: 'validate', label: 'Validar Datos', icon: Eye },
            { id: 'pricing', label: 'Calcular Precios', icon: Calculator },
            { id: 'results', label: 'Resultados', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Subir Programa de Carreras (PDF)</h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                {isUploading ? (
                  <p className="text-slate-300">Procesando PDF...</p>
                ) : isDragActive ? (
                  <p className="text-blue-400">Suelta el archivo aquí...</p>
                ) : (
                  <div>
                    <p className="text-slate-300 mb-2">
                      Arrastra y suelta un archivo PDF aquí, o haz clic para seleccionar
                    </p>
                    <p className="text-slate-500 text-sm">
                      Solo archivos PDF son aceptados
                    </p>
                  </div>
                )}
              </div>
            </div>

            {pdfData && (
              <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">PDF procesado exitosamente</span>
                </div>
                <p className="text-slate-300 mt-2">
                  Torneo: {pdfData.tournament_name} - {pdfData.races.length} carreras detectadas
                </p>
              </div>
            )}
          </div>
        )}

        {/* Validate Tab */}
        {activeTab === 'validate' && tournament.races.length > 0 && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Validar Datos del Torneo</h2>
                <Button onClick={calculateHorseCosts} className="fantasy-gradient">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calcular Precios
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre del Torneo
                  </label>
                  <input
                    type="text"
                    value={tournament.name}
                    onChange={(e) => setTournament(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Costo de Entrada (ORO)
                  </label>
                  <input
                    type="number"
                    value={tournament.entry_fee}
                    onChange={(e) => setTournament(prev => ({ ...prev, entry_fee: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Presupuesto Total
                  </label>
                  <input
                    type="number"
                    value={tournament.total_budget}
                    onChange={(e) => setTournament(prev => ({ ...prev, total_budget: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  />
                </div>
              </div>

              {tournament.races.map((race, raceIndex) => (
                <div key={raceIndex} className="mb-6 bg-slate-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {race.race_name} - {race.post_time}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-2 text-slate-300">#</th>
                          <th className="text-left py-2 text-slate-300">Caballo</th>
                          <th className="text-left py-2 text-slate-300">Jockey</th>
                          <th className="text-left py-2 text-slate-300">Entrenador</th>
                          <th className="text-left py-2 text-slate-300">Odds ML</th>
                          <th className="text-left py-2 text-slate-300">Costo Virtual</th>
                        </tr>
                      </thead>
                      <tbody>
                        {race.horses.map((horse, horseIndex) => (
                          <tr key={horseIndex} className="border-b border-slate-700/50">
                            <td className="py-2 text-white">{horse.horse_number}</td>
                            <td className="py-2 text-white font-medium">{horse.horse_name}</td>
                            <td className="py-2 text-slate-300">{horse.jockey}</td>
                            <td className="py-2 text-slate-300">{horse.trainer}</td>
                            <td className="py-2 text-slate-300">{horse.morning_line_odds}-1</td>
                            <td className="py-2 text-yellow-400 font-semibold">
                              ${horse.virtual_cost.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <div className="flex space-x-4">
                <Button onClick={saveTournament} className="fantasy-gradient">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Torneo
                </Button>
                <Button 
                  onClick={toggleTournamentLock}
                  variant={tournament.is_locked ? "destructive" : "outline"}
                  className={tournament.is_locked ? "" : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"}
                >
                  {tournament.is_locked ? (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Desbloquear Torneo
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Bloquear Torneo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Ingresar Resultados</h2>
              <p className="text-slate-300 mb-4">
                Ingresa los números de los caballos ganadores para cada posición. 
                Para empates, separa los números con comas (ej: &quot;1,3&quot; para empate en primer lugar).
              </p>
              
              {tournament.races.map((race, index) => (
                <div key={index} className="mb-6 bg-slate-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">{race.race_name}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        1er Lugar
                      </label>
                      <input
                        type="text"
                        placeholder="ej: 3 o 1,3"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        2do Lugar
                      </label>
                      <input
                        type="text"
                        placeholder="ej: 5 o 2,5"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        3er Lugar
                      </label>
                      <input
                        type="text"
                        placeholder="ej: 1 o 4,6"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button className="fantasy-gradient">
                <Save className="mr-2 h-4 w-4" />
                Guardar Resultados
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
