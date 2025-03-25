const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: './uploads/blogs',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}

const upload = multer({ storage, fileFilter });

const prisma = new PrismaClient();

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            include: {
                user_blog: { select: { avatar: true, name: true } }
            }
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

// Get a blog
router.get('/:id', async (req, res) => {
    const blogId = Number(req.params.id);
    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: blogId
            }
        });
        const relatedBlogs = await prisma.blog.findMany({
            where: { NOT: { id: blogId } },
            take: 4,
            orderBy: { createdAt: 'desc' }
        });
        const myBlogs = await prisma.blog.findMany({
            where: { author: req.user.email, NOT: { id: blogId } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ blog, relatedBlogs, myBlogs });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
    const blogId = Number(req.params.id);
    try {
        const deletedBlog = await prisma.blog.delete({
            where: {
                id: blogId
            }
        });
        if (deletedBlog.image === "default_blog.jpg")
            res.json(deletedBlog);
        else {
            fs.unlink("./uploads/blogs/" + deletedBlog.image, (err) => {
                if (err)
                    console.log(err.message)
                res.json(deletedBlog);
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

// Create a new blog
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, authorId } = req.body;
        const image = req.file ? req.file.filename : "default_blog.jpg";
        let blog = await prisma.blog.create({ data: { title, content, author, image } });
        blog = await prisma.blog.findFirst({
            where: { id: blog.id },
            include: {
                user_blog: { select: { avatar: true, name: true } }
            }
        })
        res.json(blog);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to create post' });
    }
});

module.exports = router;