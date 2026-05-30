import Blog from '../models/Blog.js'

// GET all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const blogs = await Blog.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
    res.status(200).json(blogs)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET single blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name')
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    res.status(200).json(blog)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// POST create blog
export const createBlog = async (req, res) => {
  const { title, content, category, isAnonymous } = req.body
  try {
    const blog = await Blog.create({
      title,
      content,
      category,
      isAnonymous,
      author: req.user.id
    })
    res.status(201).json({ message: 'Blog posted!', blog })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// PATCH like a blog
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    )
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    res.status(200).json({ likes: blog.likes })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// DELETE blog — only author can delete
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' })
    }
    await Blog.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Blog deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}