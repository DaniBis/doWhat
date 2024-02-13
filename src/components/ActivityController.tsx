import React, { useEffect, useState } from 'react';

type GoogleActivity = {
  name: string; 
};

const GoogleActivities = () => {
  const [googleActivities, setGoogleActivities] = useState<GoogleActivity[]>([]);
  
  useEffect(() => {
    const fetchActivitiesFromGoogle = async () => {
      const location = '13.7563,100.5018'; // Use appropriate latitude and longitude
      const radius = '5000'; // Use appropriate radius
      const type = 'tourist_attraction'; // Specify the type of places you are looking for
      const keyword = 'things to do'; // Use appropriate keyword

      // Set your API key in environment securely, do not expose it in your client-side code
      const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY; 
      const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      console.log(GOOGLE_PLACES_API_KEY);
      const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
      url.search = new URLSearchParams({
        key: GOOGLE_PLACES_API_KEY,
        location: location,
        radius: radius,
        type: type,
        keyword: keyword,
      }).toString();

      try {
        const response = await fetch(`${proxyurl}${url.toString()}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGoogleActivities(data.results || []);
      } catch (error) {
        console.error('Error fetching activities from Google:', error);
      }
    };

    fetchActivitiesFromGoogle();
  }, []);

  // Render the activities as a list
  return (
    <ul>
      {googleActivities.map((activity, index) => (
        <li key={index}>{activity.name}</li>
      ))}
    </ul>
  );
};

export default GoogleActivities;
