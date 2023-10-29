const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId, // Assuming you have another schema for authors
        ref: 'users', // Reference to the Author model
        required: true,
    },
    state: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
    read_count: {
        type: Number,
        default: 0,
    },
    reading_time: {
        type: Number,
    },
    body: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const Blog =  mongoose.model("Blog", blogSchema);

module.exports = Blog;