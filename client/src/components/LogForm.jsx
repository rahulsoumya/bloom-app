import { useState } from 'react'
import API_URL from '../config'

const symptoms = ['cramps', 'headache', 'bloating', 'fatigue', 'backpain', 'nausea']
const moods = ['happy', 'sad', 'angry', 'anxious', 'normal']
const moodEmoji = {
  happy: '😊', sad: '😢', angry: '😠', anxious: '😰', normal: '😐'
}

const LogForm = ({ token, onLogAdded }) => {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    mood: 'normal',
    notes: ''
  })
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date cannot be before start date')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/cycle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          symptoms: selectedSymptoms
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      onLogAdded()
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">
        Log Your Period
      </h2>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">Mood</label>
          <div className="flex gap-3 flex-wrap">
            {moods.map(mood => (
              <button
                type="button"
                key={mood}
                onClick={() => setForm({ ...form, mood })}
                className={`px-4 py-2 rounded-full text-sm capitalize transition
                  ${form.mood === mood
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                  }`}
              >
                {moodEmoji[mood]} {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="text-sm text-gray-600 block mb-2">
            Symptoms (select all that apply)
          </label>
          <div className="flex gap-2 flex-wrap">
            {symptoms.map(symptom => (
              <button
                type="button"
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-3 py-1 rounded-full text-sm capitalize transition
                  ${selectedSymptoms.includes(symptom)
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                  }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm text-gray-600">Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Any additional notes..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
        >
          {loading ? 'Saving...' : 'Save Log'}
        </button>

      </form>
    </div>
  )
}

export default LogForm