"use client";
import Upload from "./form";
import { Button, ConfigProvider } from 'antd';
import { useState } from 'react';

interface Label {
    Name: string;
    Confidence: number;
    }

export function ImageRecognitionPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [labels, setLabels] = useState<Label[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
      };
    
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile) return;
    
        setLoading(true);
        setError(null);
    
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageBase64 = reader.result?.toString().split(',')[1];
    
          try {
            const response = await fetch('/api/imagerecog', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageBase64 }),
            });
    
            if (!response.ok) {
              throw new Error('Error fetching image recognition data');
            }
    
            const data = await response.json();
            setLabels(data.CustomLabels || []); // Ensure we handle custom labels properly
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        reader.readAsDataURL(selectedFile);
      };
    
    return (
        <div>
            <ConfigProvider
                theme={{
                token: {
                    colorPrimary: '#BB4747',
                    colorLink: '#BB4747',
                    colorText: '#BB4747',
                    colorBorder: '#BB4747',
                    colorBgContainerDisabled: 'bg-red-primary/30'
                },
                }}
            >
            <div className="flex-col flex md:px-10">
                <div className="flex flex-col sm:flex-row md:gap-2">
                    <div className="flex-col md:flex-grow p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col w-full h-52 rounded-2xl shadow-xl bg-red-primary bg-imagerecog bg-right-bottom bg-contain bg-no-repeat px-7 py-5 gap-2">
                            </div>
                            <div className="flex flex-col md:grid md:grid-cols-2 gap-5">
                                <div className="w-full 2xl:w-full h-[25rem] bg-white dark:bg-slate-900 shadow-md rounded-xl p-4">

                                {/* Image Recognition Form */}
                                <form onSubmit={handleSubmit}>
                                    <Upload onFileSelect={handleFileSelect} />
                                    <div className='p-6'>
                                    <Button
                                        type="primary" 
                                        htmlType="submit"
                                        className='flex bg-red-primary hover:bg-red-primary font-bold rounded-full w-full text-md h-auto py-2 px-7 tracking-wider border-red-800 border-2 border-b-4 active:border-b-2'
                                        disabled={!selectedFile || loading}
                                    >
                                        {loading ? 'Uploading...' : 'Process Image'}
                                    </Button>
                                    </div>
                                </form>
                                </div>
                                <div className="flex-col md:flex-grow">
                                <div className="flex flex-col md:grid md:grid-cols-5 gap-5">
                                    <div className="col-span-1 md:col-span-5 md:space-y-5">
                                        <div className="bg-white flex dark:bg-slate-900 shadow-md md:h-52 rounded-xl p-4 space-y-3">
                                        {error && <p className="error">{error}</p>}
                                        {labels.length > 0 && (
                                            <div>
                                            <h3>Detected Engine Type:</h3>
                                            <ul>
                                                {labels.map((label, index) => (
                                                <li key={index}>
                                                    {label.Name} ({label.Confidence.toFixed(2)}%)
                                                </li>
                                                ))}
                                            </ul>
                                            </div>
                                        )}
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 flex shadow-md h-auto md:h-44 w-full rounded-xl p-4">

                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-none w-full md:w-2/6 space-y-4 p-6 md:p-0 gap-4">
                        <div className="relative md:fixed pt-6 md:h-[calc(100vh-96px)] scrollbar-none md:overflow-y-auto md:scrollbar md:scrollbar-thumb-red-primary md:scrollbar-track-transparent">
                            
                        </div>
                    </div>
                </div>
            </div>
            </ConfigProvider>
        </div>
    )
}