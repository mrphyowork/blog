const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    title: {
      type: String,
      required: [true, "Please add the title."],
    },
    content: {
      type: String,
      required: [true, "Please add the content."],
    },
  },
  {
    timestamps: true,

    // 👇 Add this block
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString(); // copy _id into id
        delete ret._id; // remove _id
        delete ret.__v; // optional: remove version key
      },
    },
  }
);

module.exports = mongoose.model("Blog", blogSchema);
