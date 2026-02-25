import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DashboardCard({ title, description, icon: Icon, to, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Link to={to} className="block group">
                <div className="glass p-8 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-primary-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    <div className="w-16 h-16 rounded-full bg-dark-700/50 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                        <Icon className="w-8 h-8 text-primary-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                        <p className="text-slate-400">{description}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
