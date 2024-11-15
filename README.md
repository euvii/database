# Database Class - README

This project provides a simple file-based database system using Node.js. It allows you to store, retrieve, delete, check for keys, and back up data in JSON format. The database can be accessed asynchronously with `Promises`.

## Features

- **Set data**: Store key-value pairs in the database.
- **Get data**: Retrieve data stored under a specific key.
- **Delete data**: Remove data from the database using a key.
- **Check key existence**: Check if a key exists in the database.
- **Backup data**: Create a backup of the database in a specified file.
- **Reset database**: Clear all data stored in the database.
- **Close database**: Close the database and release any resources.
- **Auto-backup option**: Option to automatically back up data when saving.

## Installation

To use the database class in your Node.js project, follow the steps below:

1. Clone or download the repository.
2. Install the necessary dependencies by running:
   ```bash
   npm install
   ```
3. Create an instance of the `Database` class in your project.

## Usage

### Importing the Database Class

To use the `Database` class, import it into your project.

```typescript
const Database = require('./database');  // Import the Database class
```

### Creating an Instance

Create an instance of the `Database` class, passing the file path for storing data as an argument.

```typescript
const db = new Database('your-data-base-file-path');
```

The `Database` constructor accepts two parameters:
- `filePath`: The file path where the database will be stored. Defaults to `'./database.json'`.
- `autoBackup`: A boolean that enables automatic backup after saving the data. Defaults to `false`.

### Example Operations

#### Set Data
You can store data by calling the `set()` method. It accepts a key and a value.

```typescript
db.set('name', 'John Doe')
  .then(() => {
    console.log('Data set successfully!');
  })
  .catch((error) => {
    console.error('Error setting data:', error);
  });
```

#### Get Data
You can retrieve data by calling the `get()` method with the key.

```typescript
db.get('name')
  .then((name) => {
    console.log(`Fetched data: ${name}`);
  })
  .catch((error) => {
    console.error('Error getting data:', error);
  });
```

#### Check If Key Exists
You can check if a key exists in the database with the `has()` method.

```typescript
db.has('name')
  .then((exists) => {
    console.log(`Has name key? ${exists}`);
  })
  .catch((error) => {
    console.error('Error checking if key exists:', error);
  });
```

#### Delete Data
You can delete a key-value pair from the database by calling the `delete()` method.

```typescript
db.delete('name')
  .then(() => {
    console.log('Data deleted successfully!');
  })
  .catch((error) => {
    console.error('Error deleting data:', error);
  });
```

#### Backup Data
You can back up your database to a file using the `backup()` method.

```typescript
db.backup('your-data-base-file-path.backup')
  .then(() => {
    console.log('Backup created successfully!');
  })
  .catch((error) => {
    console.error('Error creating backup:', error);
  });
```

#### Reset the Database
To clear all data in the database, you can call the `reset()` method.

```typescript
db.reset()
  .then(() => {
    console.log('Database reset successfully!');
  })
  .catch((error) => {
    console.error('Error resetting database:', error);
  });
```

#### Close the Database
When you're done with the database, you can close it using the `close()` method.

```typescript
db.close()
  .then(() => {
    console.log('Database closed successfully!');
  })
  .catch((error) => {
    console.error('Error closing database:', error);
  });
```

### File Structure

The file-based database is stored as a `.json` file. Each operation is asynchronous, and the data is stored in the specified file in JSON format. The class provides methods for working with the database, including automatic backups and error handling.

### Methods Overview

#### `set(key: string, value: any): Promise<void>`
Stores a key-value pair in the database.

#### `get(key: string): Promise<any>`
Retrieves the value for a given key.

#### `delete(key: string): Promise<void>`
Deletes a key-value pair from the database.

#### `has(key: string): Promise<boolean>`
Checks if the database contains a given key.

#### `backup(fileName: string): Promise<void>`
Creates a backup of the database to the specified file.

#### `reset(): Promise<void>`
Clears all data from the database.

#### `close(): Promise<void>`
Closes the database and cleans up any resources, including removing lock files.

## Error Handling

All operations on the database return Promises, so you should handle errors using `.catch()` or `try/catch` blocks.

Example:

```typescript
db.set('name', 'John Doe')
  .catch((error) => {
    console.error('Error setting data:', error);
  });
```

## Conclusion

This simple file-based database system provides essential operations such as setting, getting, deleting, and backing up data. It also supports auto-backup and safe closing of the database to ensure data integrity. 

You can easily integrate this database into any Node.js project that requires persistent data storage in a file-based format.
