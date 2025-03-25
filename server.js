require('dotenv').config()
const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded('application-json'));
app.use(express.static('uploads'))

app.get('/', (req, res) => {
    res.send("Hello from Express API");
})

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const { verifyToken } = require('./firebaseAdmin')

app.use('/api/user', userRoutes);
app.use('/api/blog', verifyToken, blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));