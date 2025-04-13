import mongoose from 'mongoose';

const postDetailSchema = new mongoose.Schema({
    desc: { type: String },
    utilities: { type: String },
    pet: { type: String },
    income: { type: String },
    size: { type: Number },
    school: { type: Number },
    bus: { type: Number },
    restaurant: { type: Number },
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    type: { type: String, enum: ['buy', 'rent'], required: true },
    property: { type: String, enum: ['apartment', 'house', 'condo', 'land'], required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postDetail: postDetailSchema,
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavedPost' }],
});

postSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const postId = this._id;
    
    try {
      // Remove this post from all users' savedPosts arrays
      await mongoose.model('User').updateMany(
        { savedPosts: postId },
        { $pull: { savedPosts: postId } }
      );
      next();
    } catch (err) {
      next(err); // Pass error to the next middleware
    }
  });

const Post = mongoose.model('Post', postSchema);

export default Post;