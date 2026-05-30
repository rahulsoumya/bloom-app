import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['period', 'hygiene', 'healthcare', 'mentalhealth', 'experience', 'tips'],
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.model('Blog', blogSchema)