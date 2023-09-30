import React from 'react';
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

  return (
    <div className="bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>

      {isLoading && <p>Loading...</p>}

      {!isLoading && (
        <div>
          {activities?.map((activity: any) => (
            <div key={activity.name} className="bg-white p-4 mb-4 shadow-md rounded-md">
              <div className="text-xl font-semibold">{activity.img}</div>
              <h2 className="text-xl font-semibold">{activity.name}</h2>
              <p className="text-gray-700">{activity.description}</p>
              {/* Add more activity details */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;