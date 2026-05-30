import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  imagePublicId: {
    type: String
  },
  category: {
    type: String,
    enum: ['pads', 'tampons', 'cups', 'skincare', 'hygiene', 'wellness'],
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true })

export default mongoose.model('Product', productSchema)