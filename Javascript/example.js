const database = require('./database');

const db = new database('./example');

db.set('name', 'John Doe')
  .then(() => {
    console.log('Data set successfully!');
    return db.get('name');
  })
  .then((name) => {
    console.log(`Fetched data: ${name}`);
    return db.has('name');
  })
  .then((hasName) => {
    console.log(`Has name key? ${hasName}`);
    return db.delete('name');
  })
  .then(() => {
    console.log('Data deleted successfully!');
    return db.has('name');
  })
  .then((hasNameAfterDelete) => {
    console.log(`Has name key after deletion? ${hasNameAfterDelete}`);
    return db.backup('your-data-base-file-path.backup');
  })
  .then(() => {
    console.log('Backup created successfully!');
    return db.reset();
  })
  .then(() => {
    console.log('Database reset successfully!');
    return db.close();
  })
  .then(() => {
    console.log('Database closed successfully!');
  })
  .catch((error) => {
    console.error('Error occurred during database operations:', error);
  });
