import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Supabase Client for Backend Storage Auth
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Use memory storage instead of Disk storage since free servers lose local files
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg and .png files are allowed!'));
        }
    }
});

router.post('/upload', upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase Storage Keys are missing in backend .env');
        }

        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9]/g, '')}.${fileExt}`;

        // 1. Upload the Multer Buffer directly to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw new Error(`Supabase Storage Error: ${uploadError.message}`);

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

        // 3. Save to Prisma Postgres
        const newUpload = await prisma.uploads.create({
            data: {
                filename: req.file.originalname,
                url: publicUrl,
            }
        });

        res.status(201).json({
            message: 'Image uploaded successfully',
            image: newUpload
        });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File too large! Maximum size is 5MB.' });
            }
        }
        next(error);
    }
});

export default router;
