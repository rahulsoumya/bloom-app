import CycleLog from '../models/CycleLog.js'

// Save new cycle log
export const addCycleLog = async (req, res) => {
  const { startDate, endDate, mood, symptoms, notes } = req.body

  try {
    const log = await CycleLog.create({
      userId: req.user.id,
      startDate,
      endDate,
      mood,
      symptoms,
      notes
    })

    res.status(201).json({ message: 'Cycle log saved', log })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Get all logs for logged in user
export const getCycleLogs = async (req, res) => {
  try {
    const logs = await CycleLog.find({ userId: req.user.id })
      .sort({ startDate: -1 })

    res.status(200).json(logs)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Delete a cycle log
export const deleteCycleLog = async (req, res) => {
  try {
    const log = await CycleLog.findById(req.params.id)

    if (!log) {
      return res.status(404).json({ message: 'Log not found' })
    }

    // make sure user can only delete their own log
    if (log.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await CycleLog.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Log deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}