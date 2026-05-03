import mongoose from mongoose;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
      type: String, //cloudinary public_id
      required: true,
    },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String, //cloudinary url
    required: true,
  },
  thumbnail: {
    type: String, //cloudinary url
    required: true,
  },
  owenr:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  duration: {
    type: Number, //in seconds
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  isPunlished: {
    type: Boolean,
    default: true,
  },
},
{
    timestamps: true,
});

videoSchema.plugin(mongooseAggregatePaginate);

export default Video;