import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    category: { type: String },
    isBreaking: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, default: "draft" },
    videoUrl: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);