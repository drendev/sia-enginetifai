"use client";

import { useState } from 'react';

interface Label {
  Name: string;
  Confidence: number;
  
}

export default function UploadImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
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

  console.log(labels)
  return (
    <div className='mt-16'>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload an image"
        />
        <button type="submit" disabled={!selectedFile || loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {labels.length > 0 && (
        <div>
          <h3>Detected Labels:</h3>
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
  );
}
