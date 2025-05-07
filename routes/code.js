import express from 'express';
import { exec, execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post('/submitCode', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const fileId = crypto.randomBytes(16).toString('hex');
    const extension = language === 'python' ? 'py' : 'js';
    const filename = path.join(__dirname, '../temp', `${fileId}.${extension}`);

    await fs.writeFile(filename, code);

    let output;
    if (language === 'python') {
      output = await executeCodePython(filename);
    } else {
      output = await executeCodeJavaScript(filename);
    }

    await fs.unlink(filename);

    res.json({ success: true, output });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function executeCodePython(filename, input = '') {
  return new Promise((resolve, reject) => {
    execFile('python', [filename], { timeout: 5000, input }, (error, stdout, stderr) => {
      if (error && error.killed) {
        reject(new Error('Execution timed out'));
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

function executeCodeJavaScript(filename, input = '') {
  return new Promise((resolve, reject) => {
    exec(`node "${filename}"`, { timeout: 5000, input }, (error, stdout, stderr) => {
      if (error && error.killed) {
        reject(new Error('Execution timed out'));
      } else if (stderr) {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
}

export default router;
