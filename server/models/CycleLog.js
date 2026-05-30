import mongoose from 'mongoose'

const cycleLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'normal'],
    default: 'normal'
  },
  symptoms: {
    type: [String],
    enum: ['cramps', 'headache', 'bloating', 'fatigue', 'backpain', 'nausea'],
    default: []
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true })

export default mongoose.model('CycleLog', cycleLogSchema)