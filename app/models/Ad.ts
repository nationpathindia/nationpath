import mongoose, { Schema, models } from "mongoose";

const AdSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    targetUrl: { type: String, required: true },

    placement: {
      type: String,
      enum: [
        "homepage_top",
        "homepage_mid",
        "article_sidebar",
        "category_sidebar",
      ],
      required: true,
    },

    size: {
      type: String,
      enum: ["970x90", "728x90", "300x250", "160x600"],
      required: true,
    },

    advertiser: { type: String },
    budget: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },

    startDate: Date,
    endDate: Date,

    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },

    revenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Ad = models.Ad || mongoose.model("Ad", AdSchema);

export default Ad;