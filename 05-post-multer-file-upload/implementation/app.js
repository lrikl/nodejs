'use strict';

const config = require('config');
const multer = require('multer');
const path = require('path');
const express = require('express');
const fs = require('fs'); 

const app = express();

const publicPath = path.join(__dirname, 'public');
const uploadsPath = path.join(__dirname, 'uploads/');

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(express.static(publicPath));

app.listen(config.port, () => {
    console.log(`server start on http://localhost:${config.port}`);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'form.html'));
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).toLowerCase().replace(/ /g, '_');
        cb(null, `${name}-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/zip' && file.mimetype !== 'application/x-zip-compressed') { // виставив x-zip-compressed бо в мене файли .zip з таким типом 
        return cb(null, false);
    }

    return cb(null, true);
}

const limits = {
    fileSize: config.fileSize
}

const upload = multer({ storage, fileFilter, limits });

app.post('/upload-file', (req, res) => {
    upload.single('file')(req, res, err => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                console.log('The file is too large');
                return res.status(400).send('The file is too large');
            }

            if (err instanceof multer.MulterError) {
                console.log('error multer');
                return res.status(400).json({ error: 'error multer: ' + err.message })
            }

            return res.status(500).json({ error: 'server error' });
        }

        if (!req.file) {
            console.log("only zip files");
            return res.status(400).send('only zip files');
        }

        console.log('the file was uploaded successfully');
        res.send('the file was uploaded successfully');
    });
});