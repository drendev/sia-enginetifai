"use client";

// components/Autocomplete.tsx
import { useEffect, useRef, useState } from 'react';

const Autocomplete: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBxmylansmcHoGl-dJuk_C3mHkyqKBBThc&libraries=places`;
    script.async = true;
    script.onload = () => {
      if (typeof google !== 'undefined' && inputRef.current) {
        const options = {
          componentRestrictions: { country: 'ph' }
        };

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setCoordinates({ lat, lng });
            console.log('Latitude:', lat);
            console.log('Longitude:', lng);
          }
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div>
      <input className='w-64' ref={inputRef} type="text" placeholder="Enter your address" />
      {coordinates && (
        <div>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
