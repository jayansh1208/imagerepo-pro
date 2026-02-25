import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto pt-12">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-4 tracking-tight">
                    Manage Your Images
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    A minimalist platform to securely store and view your visual assets with lightning fast performance.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <DashboardCard
                    title="Upload Image"
                    description="Drag and drop or browse files to add new images to your repository."
                    icon={UploadCloud}
                    to="/upload"
                    delay={0.1}
                />
                <DashboardCard
                    title="View Gallery"
                    description="Browse your uploaded images, view them in high-res, and download."
                    icon={ImageIcon}
                    to="/gallery"
                    delay={0.2}
                />
            </div>
        </div>
    );
}
