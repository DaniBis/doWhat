import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useQuery } from 'react-query';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchActivities = async () => {
  const snapshot = await getDocs(collection(db, 'activities'));
  const activities = snapshot.docs.map((doc) => doc.data());
  return activities;
};

const Activities: React.FC = () => {
  const { data: activities, isLoading } = useQuery('activities', fetchActivities);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (activities) {
        const storage = getStorage();
        const imageUrlsArray: string[] = [];

        try {
          for (const activity of activities) {

            const imageName = `${activity.name}.png`; 
            const imageRef = ref(storage, `${imageName}`);

            const imageUrl = await getDownloadURL(imageRef);
            imageUrlsArray.push(imageUrl);
          }

          setImageUrls(imageUrlsArray);
        } catch (error) {
          console.error('Error fetching image URLs:', error);
        }
      }
    };

    fetchImageUrls();
  }, [activities]);

  return (
    <div className="bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>

      {isLoading && <p>Loading...</p>}

      {!isLoading && (
        <div>
          {activities?.map((activity: any, activityIndex: number) => (
            <div key={activity.name} className="bg-white p-4 mb-4 shadow-md rounded-md">
              <h2 className="text-xl font-semibold">{activity.name}</h2>
              <p className="text-gray-700">{activity.description}</p>
              {imageUrls[activityIndex] && (
                <div className="image-item">
                  <img src={imageUrls[activityIndex]} alt={`Image ${activityIndex}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;
