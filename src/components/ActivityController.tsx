import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

type GoogleActivity = {
  name: string;
};

const GoogleActivities = () => {
  const [googleActivities, setGoogleActivities] = useState<GoogleActivity[]>([]);

  useEffect(() => {
    window.initMap = () => {
      const center = new window.google.maps.LatLng(18.788977, 98.992616);
      
      const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: center,
        zoom: 15
      });
      
      const request: google.maps.places.PlaceSearchRequest = {
        location: center,
        radius: 500,
        type: 'restaurant'
      };
      
      const service = new window.google.maps.places.PlacesService(map);
      
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const validActivities = results.filter(place => place.name).map(place => ({
            name: place.name || ''
          }));
          
          setGoogleActivities(validActivities);
        }
      });
    };

    const loadGoogleMapsScript = () => {
      if (typeof window.google === 'undefined') {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDg7TB7Vm3yTiPK8NAuUOXJ0HBwCqbHdew&loading=async&libraries=places`;
        script.async = true;
        document.head.appendChild(script);
      } else {
        window.initMap();
      }
    };

    loadGoogleMapsScript();
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '0px' }} />
      <ul>
        {googleActivities.map((activity, index) => (
          <li key={index}>{activity.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleActivities;
