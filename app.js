const express =require("express")
const app =express()
const path =require("path")

const methodoverride=require("method-override")
const mongoose =require("mongoose")
const Blog =require("./models/blogs")
const serverError =require("./serverError")


mongoose.connect("mongodb://localhost:27017/blogapp",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("connection opened")
})
.catch((er)=>{
    console.log(`oh no error!!!, ${err}`)
})

app.set("view engine","ejs")
app.set("views",path.join(__dirname,'views'))
app.use(methodoverride("_method"))
app.use(express.urlencoded({extended:true}))
// app.get('/blogs/about',(req,res)=>{
//     res.render("blogs/about.ejs")
// })
function catchAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e =>next(e))
    }
}
app.get("/blogs",async (req,res)=>{
    // const{id} =req.params
    
    const listitems =await Blog.find({})
     res.render("blogs/home.ejs",{listitems})
})

app.get("/blogs/new",(req,res)=>{
     res.render("blogs/new.ejs")
 })
app.post("/blogs",catchAsync(async(req,res)=>{
    
    if(!newpost){
        throw new serverError(" enter new post")
     }const newpost = new Blog (req.body)
  
     await newpost.save()
    
    res.redirect('/blogs')
    
}))
app.get("/blogs/:id",catchAsync(async(req,res)=>{
    const{id} =req.params
    const show =await Blog.findById(id)
    if(!show){
        throw new serverError("no news found",404)
    }
    res.render('blogs/show.ejs',{show})
 }))


app.get('/blogs/:id/edit',async(req,res)=>{
    const{id} =req.params
    const edit =await Blog.findById(id)
    res.render("blogs/edit.ejs",{edit})
})
app.patch('/blogs/:id',async(req,res)=>{
    const{id} =req.params
    const updatepost =await Blog.findByIdAndUpdate(id,req.body,{new:true})
    res.redirect(`/blogs/${updatepost._id}`)

})
app.delete('/blogs/:id',async(req,res)=>{
    const{id} =req.params
    const deletepost =await Blog.findByIdAndDelete(id)
    res.redirect("/blogs")
})
app.use((err,req,res,next)=>{
    const {status=404,message ="something went wrong"} =err
    res.status(status).send(message)
    next(err)
})
app.listen(5000,()=>{
    console.log("app listening on port 5000")
})