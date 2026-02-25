import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UploadDropzone from '../components/UploadDropzone';

export default function Upload() {
    const navigate = useNavigate();

    const handleUploadSuccess = () => {
        setTimeout(() => {
            navigate('/gallery');
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto pt-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 text-center"
            >
                <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Upload New Image</h1>
                <p className="text-lg text-slate-400">Add an image to your repository securely.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <UploadDropzone onUploadSuccess={handleUploadSuccess} />
            </motion.div>
        </div>
    );
}
