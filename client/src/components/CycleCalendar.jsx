import { useState } from 'react'

const CycleCalendar = ({ logs, prediction }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthName = currentDate.toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric'
  })

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  const periodDates = new Set()
  logs.forEach(log => {
    const start = new Date(log.startDate)
    const end = new Date(log.endDate)
    const current = new Date(start)
    while (current <= end) {
      periodDates.add(current.toDateString())
      current.setDate(current.getDate() + 1)
    }
  })

  const predictedDates = new Set()
  if (prediction) {
    for (let i = 0; i < 5; i++) {
      const d = new Date(prediction.date)
      d.setDate(d.getDate() + i)
      predictedDates.add(d.toDateString())
    }
  }

  const today = new Date().toDateString()

  const getDayStyle = (dateString) => {
    if (periodDates.has(dateString))
      return 'bg-pink-500 text-white font-semibold rounded-lg'
    if (predictedDates.has(dateString))
      return 'bg-pink-100 text-pink-500 font-medium rounded-lg border border-pink-300'
    if (dateString === today)
      return 'bg-gray-800 text-white font-semibold rounded-lg'
    return 'text-gray-500 hover:bg-pink-50 rounded-lg'
  }

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="text-gray-400 hover:text-pink-500 font-bold w-7 h-7 flex items-center justify-center rounded-lg hover:bg-pink-50"
        >
          ←
        </button>
        <h2 className="text-sm font-semibold text-gray-700">{monthName}</h2>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="text-gray-400 hover:text-pink-500 font-bold w-7 h-7 flex items-center justify-center rounded-lg hover:bg-pink-50"
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {days.map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-300 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1
          const dateString = new Date(year, month, day).toDateString()
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center text-xs transition ${getDayStyle(dateString)}`}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-pink-500" />
          <span className="text-xs text-gray-400">Period</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-pink-100 border border-pink-300" />
          <span className="text-xs text-gray-400">Predicted</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-gray-800" />
          <span className="text-xs text-gray-400">Today</span>
        </div>
      </div>

    </div>
  )
}

export default CycleCalendar