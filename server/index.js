import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cycleRoutes from './routes/cycleRoutes.js'
import articleRoutes from './routes/articleRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth',authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cycle', cycleRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/user', userRoutes)
app.use('/api/orders', orderRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(PORT, () => console.log(`server running on port ${PORT}`))
    })
    .catch((err) => console.log('DB error: ',err))

app.get('/',(req,res) =>{
    res.send('Bloom API running')
})    


