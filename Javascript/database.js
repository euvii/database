const { readFileSync, writeFileSync, existsSync, mkdirSync, closeSync, unlinkSync } = require('fs');
const { dirname } = require('path');

class Database {
  constructor(filePath = './database.json', autoBackup = false) {
    this.data = {};
    this.filePath = filePath;
    this.lockFilePath = `${filePath}.lock`;
    this.autoBackup = autoBackup;
    this.fileDescriptor = null;
    this.ensureFileExists();
    this.load().catch((error) => console.error('Failed to load data:', error));
    if (this.autoBackup) {
      this.backup(`${filePath}.backup`);
    }
  }

  ensureFileExists() {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, '{}', { encoding: 'utf-8' });
    }
  }

  load() {
    return new Promise((resolve, reject) => {
      try {
        const fileData = readFileSync(this.filePath, 'utf-8');
        this.data = fileData.trim() === '' ? {} : JSON.parse(fileData);
        resolve();
      } catch (error) {
        console.error('Failed to load JSON data:', error);
        this.data = {};
        reject(error);
      }
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      try {
        writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), { encoding: 'utf-8' });
        if (this.autoBackup) {
          this.backup(`${this.filePath}.backup`);
        }
        resolve();
      } catch (error) {
        console.error('Failed to save JSON data:', error);
        reject(error);
      }
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof key !== 'string') throw new Error('Key must be a string');
        this.data[key] = value;
        this.save().then(resolve).catch(reject);
      } catch (error) {
        console.error('Failed to set value:', error);
        reject(error);
      }
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof key !== 'string') throw new Error('Key must be a string');
        resolve(this.data[key]);
      } catch (error) {
        console.error('Failed to get value:', error);
        reject(error);
      }
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof key !== 'string') throw new Error('Key must be a string');
        delete this.data[key];
        this.save().then(resolve).catch(reject);
      } catch (error) {
        console.error('Failed to delete value:', error);
        reject(error);
      }
    });
  }

  has(key) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof key !== 'string') throw new Error('Key must be a string');
        resolve(key in this.data);
      } catch (error) {
        console.error('Failed to check if key exists:', error);
        reject(error);
      }
    });
  }

  backup(fileName) {
    return new Promise((resolve, reject) => {
      try {
        writeFileSync(fileName, JSON.stringify(this.data, null, 2));
        resolve();
      } catch (error) {
        console.error('Failed to create backup:', error);
        reject(error);
      }
    });
  }

  reset() {
    return new Promise((resolve, reject) => {
      try {
        this.data = {};
        this.save().then(resolve).catch(reject);
      } catch (error) {
        console.error('Failed to reset database:', error);
        reject(error);
      }
    });
  }

  fetch() {
    return new Promise((resolve) => {
      resolve({ ...this.data });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.fileDescriptor !== null) {
        try {
          closeSync(this.fileDescriptor);
          this.fileDescriptor = null;
        } catch (error) {
          console.error('Failed to close file descriptor:', error);
          reject(error);
        }
      }
      if (existsSync(this.lockFilePath)) {
        unlinkSync(this.lockFilePath);
      }
      resolve();
    });
  }
}

module.exports = Database;