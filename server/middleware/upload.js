// upload.js — Why do we need it?
// Jab admin product add karta hai toh ek image file bhi upload karta hai. Normal express.json() sirf JSON data handle karta hai — files handle nahi kar sakta.
// multer ek library hai jo file uploads handle karti hai. Ye file ko pehle server ke uploads/ folder mein save karta hai, phir hum Cloudinary pe bhej dete hain.



import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

export default upload