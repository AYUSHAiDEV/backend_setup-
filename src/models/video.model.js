import mongoose ,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema=new Schema({
    videoFile:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    duration:{
        type:Number,
        required:true
    },
    ispublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
},{
    timestamps:true,
})
videoschema.plugin(mongooseAggregatePaginate)

export const video=mongoose.model("video",videoschema)