import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-white/10 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-white hover:text-primary-500 transition-colors">
                    <Camera className="w-6 h-6 text-primary-500" />
                    <span className="font-bold text-lg tracking-tight">ImageRepo Pro</span>
                </Link>
                <div className="flex gap-4">
                    <Link to="/upload" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Upload
                    </Link>
                    <Link to="/gallery" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Gallery
                    </Link>
                </div>
            </div>
        </nav>
    );
}
