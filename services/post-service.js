const Post = require("../models/post-model");
const User = require("../models/user-model");

class PostService {
    async createPost(postData) {
        const newPost = await Post.create(postData);
        const response = await Post.findById(newPost._id).populate(["user", "likes"])
        return response;
    }

    async updatePost(postData, postId) {
        await Post.findOneAndUpdate(
            {_id: postId},
            postData
        )
    }

    async getOnePost(postId) {
        const post = await Post.findById(postId);
        return post;
    }

    async likeOrDislike(postId, userId) {
        const post = await Post.findById(postId);
        if (!post.likes.includes(userId)) {
            await post.updateOne({$push: {likes: userId}})
            return "Post has been liked"
        } else {
            await post.updateOne({$pull: {likes: userId}})
            return "Post has been disliked"
        }
    }

    async deletePost(postId) {
        await Post.deleteOne({_id: postId});
    }

    async getFeedPosts(userId) {
        const currentUser = await User.findById(userId);
        const posts = await Post.find({
            $or: [
                {user: userId},
                {user: {$in: currentUser.followers}}
            ]
        }).populate(["user", 'likes']).sort({createdAt: -1})
        return posts
    }

    async getUserPosts(userId) {
        const posts = await Post
            .find({user: userId})
            .sort({createdAt: -1})
            .populate(["user", 'likes']);
        return posts;
    }
}

module.exports = new PostService()