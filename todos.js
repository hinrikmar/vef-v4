const xss = require('xss');
const isISO8601 = require('validator/lib/isISO8601');

const { getAssignmets, getCompletedAssignmets, createAssignmet, getAssignmet, updateAssignment, deleteRow} = require('./db');

function isEmpty(s) {
  return s == null && !s;
}

function validate(title, due, position, completed) {
  const errors = [];

  if (!isEmpty(title)) {
    if (typeof title !== 'string' || !(title.length > 0 && title.length < 129)) {
      errors.push({
        field: 'title',
        error: 'Titill verður að vera strengur sem er 1 til 128 stafir',
      });
    }
  }
  if (!isEmpty(due)) {
    if (!isISO8601(due)) {
      errors.push({
        field: 'due',
        error: 'Dagsetning verður að vera gild ISO 8601 dagsetning',
      });
    }
  }
  if (!isEmpty(position)) {
    console.log(parseInt(position, 10))
    console.log((parseInt(position, 10) === 0))
    console.log((position === '0'))
    if (isNaN(parseInt(position, 10)) || parseInt(position, 10) < 0 ) {
      errors.push({
        field: 'position',
        error: 'Staðsetning verður að vera heiltala stærri eða jöfn 0',
      });
    }
  }
  
  if (!(completed === false || completed === true)) {
    errors.push({
      field: 'completed',
      error: 'Lokið verður að vera boolean gildi',
    });
  }
  return errors;
}

async function listAssignments(order = 'ASC', Completed){
  
  if(Completed === 'true'){
    if(order.toLowerCase() === 'desc'){
      const result = await getCompletedAssignmets('DESC');
      return {
        success: true,
        item: item.rows,
      };
    }
  
    const result = await getCompletedAssignmets('ASC');
    return {
      success: true,
      item: item.rows,
    };
  }

  if(order.toLowerCase() === 'desc'){
    const result = await getAssignmets('DESC');
    return {
      success: true,
      item: item.rows,
    };
  }

  const result = await getAssignmets('ASC');
  return {
    success: true,
    item: item.rows,
  };
}

async function newAsignment(title, position, completed = false, due){
  
  const validationResult = validate(item.title, item.due, item.position, item.completed);

  if (validationResult.length > 0) {
    return {
      success: false,
      notFound: false,
      validation: validationResult,
    };
  }

  const result = await createAssignmet([xss(title), xss(position), xss(completed), xss(due)]);
  return {
    success: true,
    item: item.rows,
  };
}

async function getById(id){
  if (isNaN(parseInt(id, 10))) {
    return {
      success: false,
      notFound: true,
      validation: [],
    };
  }
  const result = await getAssignmet(id);
  return {
    success: true,
    item: item.rows,
  };
}

async function updateById(id, item) {

  if (isNaN(parseInt(id, 10))) { // eslint-disable-line
    return {
      success: false,
      notFound: true,
      validation: [],
    };
  }

  const result = await getAssignmet(id);

  if (result.rows.length === 0) {
    return {
      success: false,
      notFound: true,
      validation: [],
    };
  }

  const validationResult = validate(item.title, item.due, item.position, item.completed);

  if (validationResult.length > 0) {
    return {
      success: false,
      notFound: false,
      validation: validationResult,
    };
  }

  const changedColumns = [
    !isEmpty(item.title) ? 'title' : null,
    !isEmpty(item.due) ? 'due' : null,
    !isEmpty(item.position) ? 'position' : null,
    !isEmpty(item.completed) ? 'completed' : null,
  ].filter(Boolean);

  const changedValues = [
    !isEmpty(item.title) ? xss(item.title) : null,
    !isEmpty(item.due) ? xss(item.due) : null,
    !isEmpty(item.position) ? xss(item.position) : null,
    item.completed,
  ].filter(Boolean);
  const updates = [id, ...changedValues];

  const updatedColumnsQuery =
    changedColumns
      .map((column, i) => `${column} = $${i + 2}`);

  const updateResult = await updateAssignment(updates, updatedColumnsQuery.join(', '));

  return {
    success: true,
    item: updateResult.rows[0],
  };
}

async function deleteById(id){
  if (isNaN(parseInt(id, 10))) { // eslint-disable-line
    return {
      success: false,
      notFound: true,
      validation: [],
    };
  }
  result = await deleteRow(id);
  return {
    success: true,
    item: item.rows,
  };
}

module.exports = {
  listAssignments,
  newAsignment,
  getById,
  updateById,
  deleteById
};
