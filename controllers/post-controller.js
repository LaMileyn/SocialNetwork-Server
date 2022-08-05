const postService = require("./../services/post-service");


class PostController {
    async create(req, res, next) {
        try {
            const newPost = await postService.createPost(req.body);
            res.status(200).json(newPost)
        } catch (err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {
            await postService.updatePost(req.body, req.params.id);
            res.status(200).json("Updated")
        } catch (err) {
            next(err)
        }
    }

    async getOne(req, res, next) {
        try {
            const postId = req.params.id;
            const post = await postService.getOnePost(postId);
            res.status(200).json(post);
        } catch (err) {
            next(err)
        }
    }

    async likeDislike(req, res, next) {
        try {
            const message = await postService.likeOrDislike(req.params.id, req.body.userId)
            return res.status(200).json(message)
        } catch (err) {
            next(err)
        }
    }

    async delete(req, res, next) {
        try {
            await postService.deletePost(req.params.userId)
            return res.status(200).json("Deleted")
        } catch (err) {
            next(err)
        }
    }


    async getFeedPosts(req, res, next) {
        try {
            const posts = await postService.getFeedPosts(req.user.id);
            res.status(200).json(posts)
        } catch (err) {
            next(err)
        }
    }


    async getUserPosts(req, res, next) {
        try {
            const posts = await postService.getUserPosts(req.params.userId);
            res.status(200).json(posts)
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new PostController();