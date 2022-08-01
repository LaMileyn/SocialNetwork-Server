const Post = require("../models/post-model");
const User = require("../models/user-model");

class PostService {
    async createPost(postData) {
        const newPost = await Post.create(postData);
        return newPost;
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

    async deletePost(postId){
        await Post.deleteOne({_id: postId});
    }

    async getFeedPosts(userId){
        const currentUser = await User.findById(userId);
        const userPosts = await Post.find({userId}).populate(["user",'likes']);
        const friendPosts = await Promise.all(
            currentUser.followers.map(friendId => {
                Post.find({userId: friendId}).populate(["user",'likes'])
            })
        )
        // return userPosts.concat(friendPosts)
        return [...userPosts,...friendPosts]
    }

    async getUserPosts(userId){
        const posts = await Post.find({user : userId}).populate(["user",'likes']);
        return posts;
    }
}

module.exports = new PostService()