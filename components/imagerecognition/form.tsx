"use client";

import { UploadOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, ConfigProvider } from 'antd';

interface UploadProps {
  onFileSelect: (file: File) => void;
}

const Upload: React.FC<UploadProps> = ({ onFileSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    onFileSelect(file);

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#BB4747',
            colorLink: '#BB4747',
            colorText: '#BB4747',
            colorBorder: '#BB4747',
          },
        }}
      >
        <h1 className='text-red-900 font-sans font-bold text-xl pb-5'> Upload Engine Image </h1>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-10 text-center hover:border-opacity-30 rounded-lg h-60 cursor-pointer transition-colors ${
            isDragActive ? 'border-red-primary/60' : 'border-red-primary'
          }`}
        >
          <input {...getInputProps()} />
          {selectedImage ? (
            <>
              <img src={selectedImage} alt="Selected" className="max-w-full h-36 mx-auto" />
              <div className="my-4 text-md text-gray-600">Click to change engine image</div>
            </>
          ) : (
            <>
              <div className="text-4xl text-red-primary"><UploadOutlined /></div>
              <div className="my-4 text-lg text-gray-600">Select or capture engine image</div>
              <button className="bg-red-primary text-white py-2 px-4 rounded hover:bg-red-primary/75">
                Select Image
              </button>
            </>
          )}
        </div>
      </ConfigProvider>
    </>
  );
};

export default Upload;
