import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import CycleCalendar from '../components/CycleCalendar'
import LogForm from '../components/LogForm'
import API_URL from '../config'

const Tracker = () => {
  const { token } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [prediction, setPrediction] = useState(null)

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cycle`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setLogs(data)
      calculatePrediction(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const calculatePrediction = (logsData) => {
    if (logsData.length < 2) return
    const sorted = [...logsData].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    )
    let totalGap = 0
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].startDate)
      const curr = new Date(sorted[i].startDate)
      totalGap += (curr - prev) / (1000 * 60 * 60 * 24)
    }
    const avgCycleLength = Math.round(totalGap / (sorted.length - 1))
    const lastStart = new Date(sorted[sorted.length - 1].startDate)
    const nextDate = new Date(lastStart)
    nextDate.setDate(nextDate.getDate() + avgCycleLength)
    setPrediction({ date: nextDate, cycleLength: avgCycleLength })
  }

  const handleLogAdded = () => {
    setShowForm(false)
    fetchLogs()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this log?')) return
    try {
      await fetch(`${API_URL}/api/cycle/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchLogs()
    } catch (err) {
      console.log(err)
    }
  }

  const moodEmoji = {
    happy: '', sad: '', angry: '', anxious: '', normal: ''
  }

  const getDaysUntil = () => {
    if (!prediction) return null
    const today = new Date()
    const diff = Math.ceil((prediction.date - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  const daysUntil = getDaysUntil()

  if (loading) return (
    <p className="text-center mt-20 text-gray-400">Loading tracker...</p>
  )

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">PERIOD TRACKER</h1>
        <p className="text-gray-400 text-sm mt-1">Track your cycle, know your body</p>
      </div>

      {/* Main Layout — Calendar + Right Panel */}
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 mb-8">

        {/* Left — Calendar (smaller) */}
        <div className="lg:w-1/2">
          <CycleCalendar logs={logs} prediction={prediction} />
        </div>

        {/* Right — Info Panel */}
        <div className="lg:w-1/2 flex flex-col gap-4">

          {/* Next Period Card */}
          <div className="bg-gradient-to-br from-pink-500 to-pink-400 rounded-2xl p-5 text-white">
            <p className="text-pink-100 text-sm mb-1">Next period expected</p>
            <p className="text-2xl font-bold">
              {prediction
                ? prediction.date.toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                : 'Log 2+ cycles to predict'
              }
            </p>
            {daysUntil !== null && (
              <div className="mt-3 bg-white bg-opacity-20 rounded-xl px-4 py-2 inline-block">
                <span className="text-white font-semibold text-sm">
                  {daysUntil > 0
                    ? `${daysUntil} days away`
                    : daysUntil === 0
                    ? 'Expected today!'
                    : `${Math.abs(daysUntil)} days late`
                  }
                </span>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Total Logs</p>
              <p className="text-3xl font-bold text-pink-500">{logs.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Avg Cycle</p>
              <p className="text-3xl font-bold text-pink-500">
                {prediction ? `${prediction.cycleLength}d` : '—'}
              </p>
            </div>
          </div>

          {/* Last Period Info */}
          {logs.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-2">Last period</p>
              <p className="font-semibold text-gray-700">
                {new Date(logs[0].startDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short'
                })}
                {' → '}
                {new Date(logs[0].endDate).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-sm text-gray-500">
                  {moodEmoji[logs[0].mood]} {logs[0].mood}
                </span>
                {logs[0].symptoms.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {logs[0].symptoms.map(s => (
                      <span
                        key={s}
                        className="text-xs bg-pink-50 text-pink-500 px-2 py-1 rounded-full capitalize"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Log Period Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition text-sm"
          >
            {showForm ? '✕ Cancel' : '+ Log Period'}
          </button>

        </div>
      </div>

      {/* Log Form */}
      {showForm && (
        <div className="max-w-5xl mx-auto mb-8">
          <LogForm token={token} onLogAdded={handleLogAdded} />
        </div>
      )}

      {/* Past Logs */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-base font-semibold text-gray-600 mb-3">
          Past Logs ({logs.length})
        </h2>

        {logs.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            No logs yet. Log your first period!
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {logs.map(log => (
            <div
              key={log._id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-pink-50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-700 text-sm">
                    {new Date(log.startDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short'
                    })}
                    {' → '}
                    {new Date(log.endDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {moodEmoji[log.mood]} {log.mood}
                  </p>
                  {log.symptoms.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                      {log.symptoms.map(s => (
                        <span
                          key={s}
                          className="text-xs bg-pink-50 text-pink-400 px-2 py-0.5 rounded-full capitalize"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {log.notes && (
                    <p className="text-xs text-gray-400 mt-1 italic">"{log.notes}"</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(log._id)}
                  className="text-red-300 hover:text-red-500 text-xs font-medium ml-2 flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Tracker