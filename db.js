
const { Client } = require('pg');

/**
 * Execute an SQL query.
 *
 * @param {string} sqlQuery - SQL query to execute
 * @param {array} [values=[]] - Values for parameterized query
 *
 * @returns {Promise} Promise representing the result of the SQL query
 */
async function query(sqlQuery, values = []) {
  const connectionString = process.env.DATABASE_URL;

  const client = new Client({ connectionString });
  await client.connect();

  let result;

  try {
    result = await client.query(sqlQuery, values);
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  } finally {
    await client.end();
  }

  return result;
}

async function getAssignmets(order){
  console.log(order);
  const q = `
    SELECT * 
    FROM assignment 
    ORDER BY position ${order}`;

  return query(q);
}

async function getCompletedAssignmets(order){
  console.log('gi');
  const q = `
    SELECT * 
    FROM assignment 
    WHERE completed = true
    ORDER BY position ${order}`;

  return query(q);
}

async function getAssignmet(id){
  const q = `
    SELECT * 
    FROM assignment 
    WHERE id = ($1)`;

  return query(q, [id]);
}

async function createAssignmet(data){
  const q = `
    INSERT INTO assignment
    (title, position, completed, due)
    VALUES ($1, $2, $3, $4);`;

  return query(q, data);
}

async function updateAssignment(updates, data) {
  console.log(data)
  const q = `
  UPDATE assignment
  SET ${data}, updated = current_timestamp
  WHERE id = $1
  RETURNING id, title, position, due, created, updated, completed`;

  return query(q, updates);
}

async function deleteRow(id) {
  const q = 'DELETE FROM assignment WHERE id = $1';
  return query(q, [id]);
}

module.exports = {
  query,
  getAssignmets,
  getCompletedAssignmets,
  createAssignmet,
  getAssignmet,
  updateAssignment,
  deleteRow,
};
