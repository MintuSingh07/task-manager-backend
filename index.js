const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./user.model");
const Task = require('./task.model');

const app = express();
const PORT = 8000;
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/task_manage")
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(`Error is: ${err}`));

// Show all tesks
app.get("/", async (req, res) => {
    const {email} = req.body;

    try {
        
        const user = await User.findOne({email});

        if (!user) {
            res.status(404).json({ message: "User doesn't exist" })
        };

        const userTasks = await Task.find({ _id: { $in: user.tasks } });
        res.status(200).json({ message: "Task get successfully", userTasks })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!(email || password)) {
        console.log("Please fill up all fields!");
    }
    if (!user) {
        return res.status(400).json({ message: "Invalid user" })
    }
    try {
        const conparePass = bcrypt.compareSync(password, user.password);
        if (user.email !== email) {
            res.status(400).json({ error: "Please enter correct email" });
        }
        if (!conparePass) {
            res.status(400).json({ error: "Please enter correct password" });
        }
        return res.status(200).json({ message: "Login successfully", User: user });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

// REGISTER
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email && password) {
            const isUser = await User.findOne({ email });
            const hashedPassword = bcrypt.hashSync(password);
            if (!isUser) {
                const newUser = new User({
                    email,
                    password: hashedPassword
                });
                await newUser.save();
                return res.status(200).json({ message: "User register sucessfully" });
            }
            else {
                return res.status(400).json({ message: "User already exist" });
            }
        }
        else {
            return res.status(400).json({ message: "All fields are required" });
        }
    } catch (error) {
        res.status(400).json({ error: error });
    };
});


// add task
app.post("/addtask", async (req, res) => {
    const { title, description, email } = req.body;
    try {

        if (!email && !title && !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User doesn't exist" })
        };
        const task = new Task({
            title,
            description,
            createdTime: Date.now(),
            user: user,
        })
        await task.save();
        user.tasks.push(task);
        await user.save();
        res.status(200).json({ message: "Task added successfully", task });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// update task
app.put("/updatetask", async (req, res) => {
    const { title, description, email } = req.body;
    const taskId = req.query.taskId
    try {

        if (!email && !title && !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User doesn't exist" })
        };
        const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description })
        await updatedTask.save();
        res.status(200).json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete("/deletetask", async (req, res) => {
    const taskId = req.query.taskId;
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);
        await User.findOneAndUpdate(
            { email },
            { $pull: { tasks: taskId } }
        );

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})