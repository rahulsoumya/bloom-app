import Article from '../models/Article.js'
import cloudinary from '../config/cloudinary.js'

// GET all articles
export const getAllArticles = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
    res.status(200).json(articles)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET single article
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }
    res.status(200).json(article)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// POST add article — admin only
export const addArticle = async (req, res) => {
  try {
    const { title, content, category, readTime } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'bloom/articles'
    })

    const article = await Article.create({
      title,
      content,
      category,
      readTime,
      image: result.secure_url,
      imagePublicId: result.public_id,
      createdBy: req.user.id
    })

    res.status(201).json({ message: 'Article added', article })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// DELETE article — admin only
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }

    await cloudinary.uploader.destroy(article.imagePublicId)
    await Article.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Article deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}