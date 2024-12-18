import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginateV2 from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  featuredImg: { type: String, required: true }, // Ensure featuredImg is required
  tags: [{ type: String, trim: true }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

postSchema.plugin(mongooseAggregatePaginateV2);

export const Post = mongoose.model("Post", postSchema);
