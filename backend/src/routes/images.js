import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

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

        // Extract filename from the URL (e.g., /uploads/filename.jpg)
        // and delete the physical file
        const filename = image.url.split('/').pop();
        if (filename) {
            const filePath = path.join(process.cwd(), 'uploads', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
