const {Router } = require("express")
const Users = require("../models/User")
const router = Router()

router.get("/",async (req,res)=>{
    try{
        const responce = await Users.findAll({ })
        res.render("dashbord", {
            responce,
            length:responce.length,
            title:"home page"
        })
    }catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
})

router.get("/user/create" ,(req,res)=>{
    res.render("insert" , {title:"insert user"})
})

router.get("/user/update/:id" , async (req,res)=>{
    try{
        const id  = req.params.id
        const responce = await Users.findOne({ user_id:id })
        res.render("update", {
            responce,
            title:"Update page",
            id:responce.user_id
        })
    }catch(err){
        console.log(err)
        res.status(500).send("server error")
    }
})

module.exports = router