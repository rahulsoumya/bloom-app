import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  age: {
    type: Number,
    default: null
  },
  photo: {
    type: String,
    default: null
  },
  photoPublicId: {
    type: String,
    default: null
  }
}, { timestamps: true })

export default mongoose.model('User', userSchema)