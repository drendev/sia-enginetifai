"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } =  useSession();
  const [file, setFile] = useState<File | undefined>();

  const user = session?.user?.username;
  
  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (typeof file === "undefined") return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append('upload_preset', 'last-try');
    formData.append('transformation', 'w_110,h_110');
    formData.append('api_key', '778527333889189');
    
    

    const results = await fetch('https://api.cloudinary.com/v1_1/hnqdnvduj/image/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json());

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        picture: results.secure_url,
        username: user
      })
    })

    if(response.ok){
      console.log('Image uploaded successfully');
    }
    else {
      console.log('Something went wrong.');
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList
    }
    setFile(target.files?.[0])
  }
  return (
    <main>
      <h1>Test Upload</h1>
      <form onSubmit={handleOnSubmit}>

        <input type="file" accept="image/*" onChange={handleOnChange}/>

        <button type="submit">Upload</button>
      </form>
    </main>
  );
}
