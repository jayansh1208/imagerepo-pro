import { useState, useCallback, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadDropzone({ onUploadSuccess }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const uploadFile = async (file) => {
        if (!file) return;

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.error('Only .jpg and .png files are allowed!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File too large! Maximum size is 5MB.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(percentComplete);
                }
            });

            const promise = new Promise((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(new Error(JSON.parse(xhr.response).error || 'Upload failed'));
                    }
                });
                xhr.addEventListener('error', () => reject(new Error('Network Error')));
                xhr.open('POST', `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/upload`);
                xhr.send(formData);
            });

            const response = await promise;
            toast.success('Image Uploaded!');
            if (onUploadSuccess) onUploadSuccess(response.image);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        uploadFile(file);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        uploadFile(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className={`glass relative overflow-hidden transition-all duration-300 ${isDragging ? 'border-primary-500 scale-[1.02] bg-dark-700/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-white/10 hover:border-white/20'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
            >
                <div className="p-12 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]">
                    {isUploading ? (
                        <div className="w-full max-w-xs flex flex-col items-center gap-4">
                            <UploadCloud className="w-12 h-12 text-primary-500 animate-bounce" />
                            <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-sm font-medium text-slate-300">Uploading... {uploadProgress}%</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-dark-700/50 flex items-center justify-center mb-6 group-hover:bg-dark-700 transition-colors">
                                <UploadCloud className="w-8 h-8 text-primary-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Click or drag image to upload</h3>
                            <p className="text-slate-400 mb-6">Supports .JPG and .PNG (max 5MB)</p>
                            <button
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                Select File
                            </button>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}
