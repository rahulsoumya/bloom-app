import User from '../models/User.js'
import cloudinary from '../config/cloudinary.js'
import bcrypt from 'bcryptjs'

// GET profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// UPDATE profile
export const updateProfile = async (req, res) => {
  try {
    const { name, age } = req.body
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (name) user.name = name
    if (age) user.age = age

    // upload new photo if provided
    if (req.file) {
      // delete old photo from cloudinary
      if (user.photoPublicId) {
        await cloudinary.uploader.destroy(user.photoPublicId)
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bloom/profiles'
      })
      user.photo = result.secure_url
      user.photoPublicId = result.public_id
    }

    await user.save()

    res.status(200).json({
      message: 'Profile updated!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        photo: user.photo
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// CHANGE password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.status(200).json({ message: 'Password changed successfully!' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}