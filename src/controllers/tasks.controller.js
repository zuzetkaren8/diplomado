import { Task } from "../models/task.js";

async function getTasks(req, res, next) {
    const { userId } = req.user; // Assuming userId is set in the request by authentication middleware
    try {
        const tasks = await Task.findAll({
            attributes: ['id', 'name','done'],
            order: [['name', 'ASC']],
            where: {
                userId: userId // Filter tasks by the authenticated user's ID
            }
        });
        res.json(tasks);
    } catch (error) {
        next(error);
    }
}

async function createTask(req, res, next) {
    const { userId } = req.user; // Assuming userId is set in the request by authentication middleware
    const { name} = req.body;
    try {
        const task = await Task.create({ name, userId });
        res.json({ task });
    } catch (error) {
        next(error);
    }
}

async function getTask(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user; // Assuming userId is set in the request by authentication middleware
    try {
        const task = await Task.findOne({
            attributes: ['name', 'done'],
            where: { id, userId } // Ensure the task belongs to the authenticated user
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function updateTask(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;
    const { userId } = req.user; // Assuming userId is set in the request by authentication middleware
    try {
        const task = await Task.update(
            { name },
            { where: { id, userId } } // Ensure the task belongs to the authenticated user
        );
        if (task[0] === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function taskDone(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user; // Assuming userId is set in the request by authentication middleware
    const { done } = req.body; // Assuming 'done' is a boolean field in the request body
    try {
        const task = await Task.update(
            { done },
            { where: { id, userId } } // Ensure the task belongs to the authenticated user
        );
        if (task[0] === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function deleteTask(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user; // Assuming userId is set in the request by authentication middleware
    try {
        const task = await Task.destroy({
            where: { id, userId } // Ensure the task belongs to the authenticated user
        });
        if (task === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
}
export default {
    getTasks,
    getTask,
    createTask,
    updateTask,
    taskDone,
    deleteTask
};