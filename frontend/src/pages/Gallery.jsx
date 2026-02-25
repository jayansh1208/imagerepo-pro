import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import ImageModal from '../components/ImageModal';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/images`);
                if (!res.ok) throw new Error('Failed to fetch images');
                const data = await res.json();
                setImages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/images/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete image');

            // Update local state by filtering out the deleted image
            setImages(images.filter(img => img.id !== id));
            setSelectedImage(null);
            toast.success('Image deleted successfully');
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-primary-500">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-slate-400">Loading your gallery...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500 max-w-lg mx-auto text-center glass p-8 rounded-2xl border-red-500/20">
                <AlertCircle className="w-12 h-12 mb-4 text-red-500 mx-auto" />
                <p className="text-xl font-medium text-white mb-2">Connection Error</p>
                <p className="text-slate-400 text-sm mb-4">{error}</p>
                <div className="bg-red-500/10 p-4 rounded-lg text-left">
                    <p className="text-sm text-red-400 font-medium mb-1">Troubleshooting:</p>
                    <ul className="text-sm leading-relaxed text-red-300 list-disc list-inside">
                        <li>Ensure the Node.js backend server is running.</li>
                        <li>Check if `VITE_API_URL` correctly points to the backend (or defaults to `http://localhost:3000`).</li>
                        <li>Verify PostgreSQL database is accessible and Prisma migrations have been run.</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Your Gallery</h1>
                <p className="text-lg text-slate-400">View and manage all your uploaded images ({images.length})</p>
            </motion.div>

            {images.length === 0 ? (
                <div className="text-center py-24 px-4 glass rounded-2xl border-dashed border-white/20">
                    <p className="text-xl text-slate-300 mb-6">You haven't uploaded any images yet.</p>
                    <a href="/upload" className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/25 cursor-pointer">
                        Go to Upload Page
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {images.map((img, i) => {
                        const imageUrl = img.url.startsWith('http')
                            ? img.url
                            : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${img.url}`;

                        return (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: Math.min(i * 0.05, 0.5) }}
                                className="group cursor-pointer glass overflow-hidden flex flex-col hover:border-primary-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 transform hover:-translate-y-1"
                                onClick={() => setSelectedImage(img)}
                            >
                                <div className="aspect-square bg-dark-900/80 overflow-hidden relative">
                                    <img
                                        src={imageUrl}
                                        alt={img.filename}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/40 transition-colors flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 text-white font-medium px-4 py-2 bg-primary-600/90 rounded-lg backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg">
                                            View full
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-1 border-t border-white/10 bg-dark-800/80">
                                    <p className="text-sm font-medium text-white truncate" title={img.filename}>
                                        {img.filename}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(img.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                image={selectedImage}
                onDelete={handleDelete}
            />
        </div>
    );
}
