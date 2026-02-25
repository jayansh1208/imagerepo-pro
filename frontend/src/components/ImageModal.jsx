import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Download, Trash2, Loader2 } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, image, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!image) return null;

    const imageUrl = image.url.startsWith('http')
        ? image.url
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${image.url}`;

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = image.filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Failed to download image", error);
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = image.filename;
            a.target = '_blank';
            a.click();
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl glass p-2 text-left align-middle shadow-2xl transition-all">
                                <div className="relative group flex items-center justify-center bg-dark-900/50 rounded-xl min-h-[50vh]">
                                    <img
                                        src={imageUrl}
                                        alt={image.filename}
                                        className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
                                    />

                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setIsDeleting(true);
                                                onDelete(image.id).finally(() => setIsDeleting(false));
                                            }}
                                            disabled={isDeleting}
                                            className="p-2.5 bg-dark-900/80 hover:bg-red-600 focus:bg-red-600 text-white rounded-full backdrop-blur-md transition-colors shadow-lg disabled:opacity-50"
                                            title="Delete Image"
                                        >
                                            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="p-2.5 bg-dark-900/80 hover:bg-primary-600 text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
                                            title="Download"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="p-2.5 bg-dark-900/80 hover:bg-slate-700 text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
                                            title="Close"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-white/10 mt-2 flex justify-between items-center">
                                    <div>
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white truncate max-w-md">
                                            {image.filename}
                                        </Dialog.Title>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Uploaded on {new Date(image.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors md:hidden"
                                    >
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
