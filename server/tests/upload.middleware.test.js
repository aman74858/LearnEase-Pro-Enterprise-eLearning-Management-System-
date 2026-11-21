import { createServer } from 'node:http';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import { expect, it } from 'vitest';
import { upload } from '../middleware/upload.js';

it('accepts a supported multipart image and stores its content', async () => {
  const app = express();
  app.post('/upload', upload.single('file'), (req, res) => {
    res.status(200).json({
      filename: req.file.filename,
      size: req.file.size,
    });
  });

  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  let uploadedFilePath;
  try {
    const payload = 'multer integration payload';
    const formData = new FormData();
    formData.append('file', new Blob([payload], { type: 'image/png' }), 'sample.png');

    const response = await fetch(`http://127.0.0.1:${server.address().port}/upload`, {
      method: 'POST',
      body: formData,
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    uploadedFilePath = path.resolve('uploads', result.filename);
    expect(result.size).toBe(Buffer.byteLength(payload));
    expect(await readFile(uploadedFilePath, 'utf8')).toBe(payload);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    if (uploadedFilePath) {
      await rm(uploadedFilePath, { force: true });
    }
  }
});
