import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
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
    enum: ['nutrition', 'hygiene', 'menstrual', 'mental', 'skincare'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  imagePublicId: {
    type: String
  },
  readTime: {
    type: String,
    default: '3 min read'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

export default mongoose.model('Article', articleSchema)