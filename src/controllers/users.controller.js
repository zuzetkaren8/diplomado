import { User } from '../models/user.js';
import { Task } from '../models/task.js';
import { Status } from '../constants/index.js';
import { encriptar } from '../common/bcrypt.js';
import { Op } from 'sequelize';

async function getUsers(req, res, next) {
  try {
    const users = await User.findAll({
        attributes: ['id', 'username', 'password', 'status'],
        order: [['id', 'DESC']],
        where: {
            status: Status.ACTIVE,
        },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
}
async function createUser(req, res, next) {
    const { username, password } = req.body;
    console.log('📥 Datos recibidos en req.body:', req.body);
    try {
        const user = await User.create({
            username,
            password,
        });
        res.json(user);
    } 
    catch (error) {
        next(error);
    }
}

async function getUser(req, res, next) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username', 'password', 'status'],
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
}
async function updateUser(req, res, next) {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        if (!username && !password) {
          return res
          .status(400)
          .json({ message: 'Username or password is required' });
        }
        const passwordEncriptado = await encriptar(password);

        const user = await User.update({
            username,
            password,
        }, {
            where: { id },
        })
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    const { id } = req.params;
    try {
        await User.destroy({
            where: { id },
        });
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
}
async function activateInactivate(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (!status) {
            res.status(400).json({ message: 'Invalid status' });
        }
        const user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        if (user.status === status) {
            res.status(409).json({ message: 'Same status' });
        }
            user.status = status;
            await user.save();
            res.json(user);
        
    } catch (error) {
        next(error);
    }
}
async function getTasks(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username'],
      include: [{
        model: Task,
        attributes: ['name', 'done'],
        // where: { done: false }, // Ensure tasks belong to the user
      }],
      where: { id },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
}
async function paginacion(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const orderBy = req.query.orderBy || 'id';
    const orderDir = (req.query.orderDir || 'DESC').toUpperCase();

    const validOrderFields = ['id', 'username', 'status'];
    const validOrderDirs = ['ASC', 'DESC'];

    if (!validOrderFields.includes(orderBy) || !validOrderDirs.includes(orderDir)) {
      return res.status(400).json({ message: 'Parámetros de orden inválidos' });
    }

    const offset = (page - 1) * limit;

    const where = search
      ? { username: { [Op.iLike]: `%${search}%` } }
      : {};

    const { count: total, rows: data } = await User.findAndCountAll({
      attributes: ['id', 'username', 'status'],
      where,
      limit,
      offset,
      order: [[orderBy, orderDir]]
    });

    const pages = Math.ceil(total / limit);

    res.json({ total, page, pages, data });

  } catch (error) {
    next(error);
  }
}
export default {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activateInactivate,
    getTasks,
    paginacion
};