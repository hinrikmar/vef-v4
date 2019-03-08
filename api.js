const express = require('express');

const {listAssignments, newAsignment, getById, updateById, deleteById} = require('./todos');
/* todo importa frá todos.js */

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/* todo útfæra vefþjónustuskil */

async function createAssignment(req, res) {

  const { title, postion, completed, due} = req.body;

  

  const result = await newAsignment(title, postion, completed, due);
  res.status(200).json(result);
}

async function getAssignments(req, res) {

  const { order, completed } = req.query;
  const result = await listAssignments(order, completed);
  res.status(200).json(result);
}

async function getAssignmentById(req, res) {

  const { id } = req.params;
  const result = await getById(id);

  res.status(200).json(result);
}

async function updateAssignmentById(req, res) {

  const { id } = req.params;
  const { title, position, completed, due } = req.body;
  console.log('pos')
  console.log(position)
  const result = await updateById(id, {title, position, completed, due});

  res.status(200).json(result);
}

async function deleteAssignmentById(req, res) {

  const { id } = req.params;
  const result = await deleteById(id);

  res.status(200).json(result);
}

router.get('/', catchErrors(getAssignments));
router.post('/', catchErrors(createAssignment));
router.get('/:id', catchErrors(getAssignmentById));
router.patch('/:id', catchErrors(updateAssignmentById));
router.delete('/:id', catchErrors(deleteAssignmentById));
module.exports = router;

