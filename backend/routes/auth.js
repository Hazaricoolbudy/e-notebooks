const express = require('express')
const User = require('../models/User')
const bcrypt=require('bcryptjs')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const jwt=require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')

const JWT_TOKEN='MYNAMEISHAZARITHECODER'

// ROUTE 1 Create a user using POST "api/auth/createuser", doesn't login reauired auth 
router.post('/createuser', [
    //validation for create a new user
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })

], async (req, res) => {
    // check there are errors, return bad request and error
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    // check weather the user with this email exist already
    let user = await User.findOne({ email: req.body.email })
    console.log(user);
    try {
         


        if (user) {
            return res.status(400).json({ "error": "user with this email already exist" })

        }
        const salt=await bcrypt.genSalt(10);

         const    secPass=await bcrypt.hash(req.body.password,salt) 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data={
            user:{
                id:user.id
            }
        }
       const authToken=await jwt.sign(data,JWT_TOKEN)
       console.log(authToken);
        res.json(authToken)

    } catch (error) {
        console.log(error.message);
        res.status(500).send('some error is occured')

    }
    //     .then(user=>res.json(user)).catch(err=>
    //         console.log(err));
    //    res.json({"error":"please enter a valid a unique email"})
    //    res.send(req.body)
})


//  ROUTE 2 authenticate  a user using POST "api/auth/createuser", doesn't login reauired auth 

router.post('/login', [
    //validation for create a new user
    
    body('email','Eneter a valid email').isEmail(),
    body('password',"password cannot be blank").exists()

], 

async(req,res)=>{
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }

    const {email, password}=req.body
    try {
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({error:"Please try to login with correct cradential"}
            
            )
        }
        const passwordCompare=await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            return res.status(400).json({error:"Please try to login with correct cradential"}

        )}
        const payload={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(payload,JWT_TOKEN)
        res.json({authToken})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal server error occured')
    }

})

// ROUTE 3 GET LOGIN USER DETAILS using POST "api/auth/getuser",  login reauired auth 


router.post('/getuser', fetchuser, async (req, res) => {
try {
    userid=req.user.id;
    const user= await User.findById(userid).select('-password')
    res.send(user)

} catch (error) {
    console.log(error.message);
    res.status(500).send('Internal server error occured')

}
})



module.exports = router;