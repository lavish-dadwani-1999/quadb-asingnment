const {Router} = require("express")
const { check,validationResult } = require("express-validator")
const router = Router()
const {uuid} = require("uuidv4")
const Users = require("../models/User")
const Cloudinary = require("../utils/cloudinary")
const configbuffer = require("../utils/configbuffer")
const multer = require("../utils/multer")

router.post("/insert", [
    check('user_name').isLength({ min: 3 }).withMessage('Must be at least 3 chars long'),
    check('user_email').isEmail(),
    check('user_password').isAlphanumeric().withMessage('Must be only alphaNumeric chars').isLength({ min: 8 }).withMessage('Must be at least 8 chars long')
],multer.single('fileUpload'), async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    try{
        const {user_name , user_email,user_password,user_image} = req.body
        const image = null
      if(user_image){
        var imagecontent = configbuffer(req.file.originalname, req.file.buffer);  // converting the buffer into string
        const responce = await  Cloudinary.uploader.upload(imagecontent) 
        if(responce){
            image = responce
        }   // cloudinery is used to upload file
      }
        let user = req.body
        if(!user_name || !user_email || !user_password ) return res.status(400).send({message:"invalid Credentials"})
        console.log(user)
        const user1 = await Users.findOne({
            where: {
                user_email
            }
        });
        console.log(user1)
        if(user1) return res.status(400).send({message:"email already exits"})
        var user_id = uuid()
        const date = new Date()
        const newUser =  await Users.create({user_name,user_email,user_password,user_id:user_id,last_login:date,user_image:image}) 
        await newUser.save()  
        res.status(201).redirect("/")
    }catch(err){
        console.log(err)
        // if (err.fields.hasOwnProperty("user_email")) {
        //     return res.status(403).send(`Email already occupied`);
        // }
        if (err.name === "ValidationError")
            return res.status(400).send(`Validation Error: ${err.message}`);

        return res.status(500).send("serverError");
    }
})

router.get("/details/:id",async (req,res)=>{
    try{
        const user_id = req.params.id
        const user = await Users.findOne({
            where: {
                user_id
            }
        })
        if(!user) return res.status(400).send({message:"user not found"})
        console.log(user,"use")
        res.status(200).json(user)
    }catch(err){
        console.log(err)
        return res.status(500).send("serverError");
    }
})



router.put("/update/:id",async (req,res)=>{
    try{
        const {user_name, user_email,user_image} = req.body
        var email = null
        var name = null
       var image = null
       if(user_image){
        var imagecontent = configbuffer(req.file.originalname, req.file.buffer);  // converting the buffer into string
        const responce = await  Cloudinary.uploader.upload(imagecontent) 
        if(responce){
            image = responce
        }   // cloudinery is used to upload file
      }
        const user_id = req.params.id
        const user = await Users.findOne({
            where: {
                user_id
            }
        })
        if(!user) return res.status(400).send({message:"user not found"})
        console.log(user,"use")
        if(user_email){
            email= user_email
        }else email= user.user_email
        if(user_name){
            name= user_name
        }else name = user.user_name
        user.update({ user_name: name , user_email:email,user_image:image })
        res.redirect("/")
    }catch(err){
        console.log(err)
        return res.status(500).send("serverError");
    }
})


router.delete("/delete/:id", async (req,res)=>{
    try{
        const user_id = req.params.id
        const user = await Users.findOne({
            where: {
                user_id
            }

        })
        if(!user) return res.status(400).send({message:"user not found"})
        user.destroy()
        res.redirect("/")
    }catch(err){
        console.log(err)
        res.status(500).send({message:"server error"})
    }
})

router.get("/image/:id", async (req,res)=>{
    try{
        const user_id = req.params.id
        const user = await Users.findOne({
            where: {
                user_id
            }

        })
        if(!user) return res.status(400).send({message:"user not found"})
        res.status(200).json(user.user_image)
    }catch(err){

    }
})

router.get("/all", async (req,res)=>{
    try{
        const data = await Users.findAll({ })
        res.status(200).json(data)
    }catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
})

module.exports = router