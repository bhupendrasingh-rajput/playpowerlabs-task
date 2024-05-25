const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const authRoutes = require('./Routes/auth');
const assignmentRoutes = require('./Routes/assignment');
const submissionRoutes = require('./Routes/submission');
const sequelize = require('./Config/database');

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        service: "Student-Assignment-App Server",
        status: "Active",
        time: new Date()
    })
})
app.use('/api/auth', authRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/submission', submissionRoutes);

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => console.log('Error: ' + err));
