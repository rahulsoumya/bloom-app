import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//generateToken function:
//Jab koi register ya login kare, usse ek digital pass (token) milta hai. Ye pass 7 din valid rahega. Har baar API call karne pe ye pass dikhana padega.
const generateToken = (user)=>{
    return jwt.sign(
        {id:  user._id ,role: user.role },  // user ki pehchaan
        process.env.JWT_SECRET,       // secret key se lock karo
        {expiresIn:'7d'}              // 7 din baad expire hoga
    )
}


//REGISTER function:
export const register = async (req,res) =>{
    const{ name , email , password } = req.body

    try {
        const existingUser = await User.findOne({ email })                        //Pehle check karo — kya ye email pehle se registered hai? Agar haan, rok do.
        if(existingUser){
            return res.status(400).jason({message:'Email already registered'})
        }


        const hashedPassword = await bcrypt.hash(password,10)                    //Password ko lock kar do before saving. Never save plain password in DB. 10 means kitni baar encrypt karna hai (more = more secure but slower).


        const user = await User.create({                                        //Sab theek hai toh user ko database mein save karo.
            name,
            email,
            password: hashedPassword
         })

         res.status(201).json({                                                //User ko token aur uski details wapas bhejo. Frontend ye token localStorage mein save karega.
            message:'Registered successfully',
            token:generateToken(user),
            user:{ id: user._id , name: user.name , email: user.email , role: user.role }
         })
    }
    catch(err){
        res.status(500).json({ message:'server error',error:err.message })
    }
}


//LOGIN
export const login = async (req,res) =>{
    const{ email , password } = req.body


    try{
        const user = await User.findOne({ email })                                //Email se user dhundo DB mein. Nahi mila? Error do.
        if(!user){
            return res.status(400).json({message: 'incalid email or password' })
        }

        const isMatch = await bcrypt.compare(password,user.password)             //Jo password user ne diya usse DB ke hashed password se compare karo. bcrypt.compare automatically unhash karke match karta hai.
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        res.status(200).json({                                                   //Sab match? Token do aur frontend ko user details bhejo.
            message: 'Login successful',
            token: generateToken(user),
            user:{id: user._id, name: user.name, email: user.email, role: user.role }
        })

    }
    catch(err){
        res.status(500).json({ message:'Server error',erroe:err.message })
    }
}
