const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const { s3, dynamo } = require('../aws-config');
const { verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'insulink-uploads', //process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `educational/${Date.now()}_${file.originalname}`);
        }
    })
});

router.post('/', verifyAdmin, upload.single('file'), async (req, res) => {
    const { title, description } = req.body;
    const file = req.file;

    const item = {
        resourceId: uuidv4(),
        title,
        description,
        fileUrl: file.location,
        uploadedAt: new Date().toISOString()
    };

    try {
        await dynamo.put({
            TableName: 'EducationalResources',
            Item: item
        }).promise();

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to upload resource',
            details: err });
    }
});

module.exports = router;