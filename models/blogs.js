const mongoose =require("mongoose")
const blogSchema =new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    title:{
        type: String,
       require:true
        },
    post:{
        type:String,
        require:true
    },

    date:{ 
        type:Date,
        default:Date.now
    }
})
const Blog = mongoose.model ("Blog",blogSchema)
module.exports = Blog