import { readFileSync, writeFileSync, existsSync, mkdirSync, closeSync, unlinkSync } from 'fs';
import { dirname } from 'path';

class database {
  private data: Record<string, any> = {};
  private filePath: string;
  private lockFilePath: string;
  private fileDescriptor: number | null = null;

  constructor(filePath: string = './database.json', private autoBackup: boolean = false) {
    this.filePath = filePath;
    this.lockFilePath = ${filePath}.lock;
    this.ensureFileExists();
    this.load();
    if (this.autoBackup) {
      this.backup(${filePath}.backup);
    }
  }

  private ensureFileExists() {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, '{}', { encoding: 'utf-8' });
    }
  }

  private load(): Promise<void> {
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

  private save(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), { encoding: 'utf-8' });
        if (this.autoBackup) {
          this.backup(${this.filePath}.backup);
        }
        resolve();
      } catch (error) {
        console.error('Failed to save JSON data:', error);
        reject(error);
      }
    });
  }

  set(key: string, value: any): Promise<void> {
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

  get(key: string): Promise<any> {
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

  delete(key: string): Promise<void> {
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

  has(key: string): Promise<boolean> {
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

  backup(fileName: string): Promise<void> {
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

  reset(): Promise<void> {
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

  fetch(): Promise<Record<string, any>> {
    return new Promise((resolve) => {
      resolve({ ...this.data });
    });
  }

  close(): Promise<void> {
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

export default database;