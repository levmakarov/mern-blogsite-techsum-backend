const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { checkToken } = require('../firebaseAdmin');
const multer = require('multer');
const path = require('path');

const prisma = new PrismaClient();

// Create a new user
router.post('/', async (req, res) => {
    const { name, email, gender, birthday, job, city } = req.body;
    try {
        const user = await prisma.user.create({ data: { name, email, gender, birthday: new Date(birthday), job, city } });
        res.json(user);
    } catch (error) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: `The email ${email} is already in use.`, });
        } else {
            res.status(400).json({ error: "Network error" });
        }
    }
});

// Verify Token
router.post('/verify_token', async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = await checkToken(token);
        if (decodedToken === "")
            res.status(400).json({ error: "Invalid token" });
        else {
            const user = await prisma.user.findFirst({ where: { email: decodedToken.email } });
            res.json(user);
        }
    } catch (error) {
        res.status(400).json({ error: "Network error" });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Update user
router.put('/', upload.single('avatar'), async (req, res) => {
    const { name, email, gender, birthday, job, city } = req.body;
    try {
        let updatedUser = await prisma.user.update({
            where: { email },
            data: {
                name, gender: gender === "true", birthday: new Date(birthday), job, city
            }
        });
        if(req.file) {
            updatedUser = await prisma.user.update({
                where: { email },
                data: { avatar: req.file.filename }
            });
        }
        res.json(updatedUser);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to update profile." });
    }
})

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

// Get a user
router.get('/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await prisma.user.findFirst({ where: { email } });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to find user.' });
    }
});

module.exports = router;
