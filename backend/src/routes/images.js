import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const prisma = new PrismaClient();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

router.get('/images', async (req, res, next) => {
    try {
        const images = await prisma.uploads.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(images);
    } catch (error) {
        next(error);
    }
});

router.delete('/images/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the image first to get its URL/filename
        const image = await prisma.uploads.findUnique({
            where: { id }
        });

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Delete from database
        await prisma.uploads.delete({
            where: { id }
        });

        // Delete completely from Supabase Storage by extracting the filename from URL
        if (image.url && image.url.includes('/gallery/')) {
            const urlParts = image.url.split('/gallery/');
            if (urlParts.length > 1) {
                const filename = urlParts[1];
                await supabase.storage.from('gallery').remove([filename]);
            }
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
