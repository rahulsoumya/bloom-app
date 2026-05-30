import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'



//GET ALL PRODUCT
export const getAllProducts = async(req,res) =>{                                        // This line extracts category from the URL's query string.
    try{                                                                              //req.query = URL mein ? ke baad jo bhi aata hai, woh sab key-value pairs ke form mein store hue
        const { category } = req.query                                    
        const filter = category ? { category } :{}                                     // agar category di hai toh filter lagao
        const products = await Product .find(filter).sort({createdAt: -1})             // DB se products lo
        res.status(200).json(products)
    }
    catch(err){
        res.status(500).json({message: 'server error',error:err.message})
    }
}


// GET SINGLE Product
export const getProductById = async (req,res) => {
    try{
        const product = await Product.findById(req.params.id)
        if(!product) {
            return res.status(404).json({message: 'product not dound'})
        }
        res.status(200).json(product)
    }
    catch(err){
        res.status(500).json({message:'server error',error:err.message})
    }     
}

// POST ADD PRODUCT (ADMIN ONLY)
export const addProduct = async (req,res) =>{
    // console.log('BODY:', req.body)   fasi thili
    // console.log('FILE:', req.file)
    try{
        const {name , description, price, category,stock} = req.body                                    //Form se product ki details lo (text fields)

        if(!req.file) {
            return res.status(400).json({message: 'image is required'})                                //Check karo — kya image upload ki gayi hai? Nahi ki toh error do.
        }

        //upload image in cloudeinary
        const result = await cloudinary.uploader.upload(req.file.path,{folder: 'bloom/products'})        //Image ko Cloudinary pe upload karo (cloud storage), ek folder mein save hogi.


        const product = await Product .create({
            name,
            description,
            price,
            category,
            stock,
            image:result.secure_url,                                                              // image ka URL
            imagePublicId: result.public_id,                                                      // future mein delete ke liye
            createdBy: req.user.id                                                                // ✅ yahan user ka ID aa raha ha
    })
    res.status(201).json({ message: 'product added',product })
    }
    catch(err){
        res.status(500).json({ message: 'Server error',error:err.message })
    }
} 


//DLLETE product (admin only)
export const deleteProduct = async (req,res) =>{
try{
const  product = await Product.findById(req.params.id)
if(!product){
    return res.status(404).json({message:'Product not found'})
}
//delete image from cloudinary too
await cloudinary.uploader.destroy(product.imagePublicId)
await Product.findByIdAndDelete(req.params.id)

res.status(200).json({message:'product deleted'})
}
catch(err){
    res.status(500).json({message:'Server error',error:err.message})
 }
}
 