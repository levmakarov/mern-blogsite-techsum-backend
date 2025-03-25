const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new user
const createUser = async (name, email) => {
    return await prisma.user.create({ data: { name, email } });
};

// Create a new post
const createPost = async (title, content, userId) => {
    return await prisma.post.create({ data: { title, content, userId } });
};

// Get all posts with user info
const getPosts = async () => {
    return await prisma.post.findMany({ include: { user: true } });
};

module.exports = { createUser, createPost, getPosts };
