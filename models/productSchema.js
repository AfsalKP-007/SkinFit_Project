const mongoose = require("mongoose")
const {Schema} = mongoose


const productSchema = new Schema({

 
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    salePrice:{
        type:Number,
        default:0
    },
    qty:{
        type:Number,
        default:0
    },
    photos:[{
        type:[String],
        required:true
    }],
    isBlocked:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["Available","Out of stock", "Discountinued"],
        required:true,
        default:"Available"
    }
},{timestamps:true})


const Product = mongoose.model("Address",productSchema)
module.exports = Product