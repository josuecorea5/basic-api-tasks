const res = require("express/lib/response")
const pool = require('../db');

const getAllTasks = async(req,res,next) => {
  try {
    const Alltasks = await pool.query("SELECT * FROM task");
    res.status(200).json(Alltasks.rows);
  } catch (error) {
    next(error);
  }
}

const getTask = async (req,res,next) => {
  try {
    const { id } = req.params;
    const task = await pool.query(`SELECT * FROM task WHERE id=$1`, [id]);
    if(task.rows.length === 0) {
      return res.status(404).json({ message: 'task not found'}); 
    }
    res.status(200).json(task.rows[0]);
  } catch (error) {
    next(error)
  }
}

const createTask = async (req,res,next) => {
  const { title, description } = req.body;
  try {
    const task = await pool.query("INSERT INTO task (title,description) VALUES ($1, $2) RETURNING * ", [title, description]);
    res.json(task.rows[0]);
  } catch (error) {
    next(error)
  }
}

const updateTask = async (req,res,next) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query("UPDATE task SET title=$1, description=$2 WHERE id=$3 RETURNING *",[title,description,id]);
    if(result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found"});
    }
    return res.json(result.rows[0]);
  } catch (error) {
    next(error)
  }
}

const deleteTask = async(req,res,next) => {
  try {
    const { id } = req.params;
    const task = await pool.query(`DELETE FROM task WHERE id=$1`, [id]);
    if(task.rowCount === 0) {
      return res.status(404).json({ message: 'task not found'});
    }
    return res.sendStatus(204);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
}