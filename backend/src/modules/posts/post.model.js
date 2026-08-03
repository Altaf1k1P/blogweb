import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginateV2 from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  featuredImg: { type: String, required: true },
  tags: [{ type: String, trim: true }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

postSchema.plugin(mongooseAggregatePaginateV2);

// Optimized Database Indexes
postSchema.index({ owner: 1 });
postSchema.index({ isPublished: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ isPublished: 1, createdAt: -1 }); // Compound index for fast landings

export const Post = mongoose.model("Post", postSchema);
