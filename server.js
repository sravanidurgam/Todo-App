const express  = require('express');
const mongoose = require('mongoose');
const TaskSchema = require('./model');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

mongoose.connect('mongodb+srv://sravanidurgam758:sravanidurgam758@cluster0.8f7hyc1.mongodb.net/mernstack')
.then(() => console.log('DB connected'))
.catch(err => {
    console.error('DB connection error:', err);
    process.exit(1); // Exit the process if DB connection fails
});

app.post('/addtask', async (req, res) => {
    const { todo } = req.body;
    if (!todo) {
        return res.status(400).json({ error: 'Todo is required' });
    }
    try {
        const newData = new TaskSchema({ todo });
        await newData.save();
        const tasks = await TaskSchema.find();
        return res.json(tasks);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.get('/gettask', async (req, res) => {
    try {
        const tasks = await TaskSchema.find();
        return res.json(tasks);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        await TaskSchema.findByIdAndDelete(req.params.id);
        const tasks = await TaskSchema.find();
        return res.json(tasks);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
