import React, { useEffect, useState, useRef } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useQuery, useQueryClient } from 'react-query';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { addActivity } from './../components/ActivityController';

interface Activity {
  id: string;
  name: string;
  geolocation: string; // Use the appropriate type for geolocation
  openingHours: string;
  closingHours: string;
  website: string;
  extraInformation: string;
}

// This type allows any string as a key and a string as a value
interface Urls {
  [key: string]: string;
}

const fetchActivities = async (): Promise<Activity[]> => {
  const snapshot = await getDocs(collection(db, 'activities'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Activity));
};

const Activities = () => {
  const queryClient = useQueryClient();
  const { data: activities, isLoading, isError, error } = useQuery('activities', fetchActivities);
  const [imageUrls, setImageUrls] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const imageInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const geolocationRef = useRef<HTMLInputElement | null>(null);
  const openingHoursRef = useRef<HTMLInputElement | null>(null);
  const closingHoursRef = useRef<HTMLInputElement | null>(null);
  const websiteRef = useRef<HTMLInputElement | null>(null);
  const extraInformationRef = useRef<HTMLTextAreaElement | null>(null);
  


  const handleAddActivity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check for image file selection
    if (!imageInputRef.current || !imageInputRef.current.files || imageInputRef.current.files.length === 0) {
      console.error('Image file is not selected');
      return;
    }
    const imageFile = imageInputRef.current.files[0];

  
    // Make sure all refs are not null before proceeding
    if (
      nameRef.current &&
      geolocationRef.current &&
      openingHoursRef.current &&
      closingHoursRef.current &&
      websiteRef.current &&
      extraInformationRef.current
    ) {
      const newActivityData = {
        name: nameRef.current.value,
        geolocation: geolocationRef.current.value,
        openingHours: openingHoursRef.current.value,
        closingHours: closingHoursRef.current.value,
        website: websiteRef.current.value,
        extraInformation: extraInformationRef.current.value,
      };
  
      try {
        await addActivity(newActivityData, imageFile);
        toggleModal();
        queryClient.invalidateQueries('activities');
      } catch (e) {
        console.error('Error while adding activity:', e);
      }
    } else {
      console.error('One of the form refs is undefined');
    }
  };
  

  useEffect(() => {
    const fetchImageUrls = async () => {
      const storage = getStorage();
      const urls: Urls = {};

      if (activities) {
        const downloadUrlPromises = activities.map((activity) => {
          const imageName = `${activity.name}.png`;
          const imageRef = ref(storage, `activities/${imageName}`);
          return getDownloadURL(imageRef)
            .then((url) => {
              urls[activity.id] = url;
            })
            .catch(() => {
              // Handle any errors here, such as setting a default image
            });
        });

        try {
          await Promise.all(downloadUrlPromises);
          setImageUrls(urls);
        } catch (error) {
          console.error('Error fetching image URLs:', error);
        }
      }
    };

    if (activities && activities.length > 0) {
      fetchImageUrls();
    }
  }, [activities]);

  if (isError) {
    return <div>Error: {error.message}</div>; // Show error message if there's an error
  }


  return (
    <div className="bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        Activities 
        <button 
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={toggleModal}
        >
          Add New Activity
        </button>
      </h1>

      {isModalOpen && (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-md shadow-xl relative w-96">
      <button 
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        onClick={toggleModal}
      >
        X
      </button>
      <h2 className="text-xl mb-4">Add New Activity</h2>
      <form onSubmit={handleAddActivity}>
        <div className="mb-4">
          <label className="block text-gray-700">Image</label>
          {/* Replace the text input with a file input */}
          <input type="file" ref={imageInputRef} className="mt-2 w-full p-2 border rounded-md" required />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input ref={nameRef} type="text" className="mt-2 w-full p-2 border rounded-md" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Geolocation (Placeholder)</label>
          <input ref={geolocationRef} type="text" className="mt-2 w-full p-2 border rounded-md" />
          {/* Here you would integrate the react-google-maps component */}
        </div>

        <div className="flex justify-between mb-4">
          <div className="mr-2">
            <label className="block text-gray-700">Opening Hours</label>
            <input ref={openingHoursRef} type="time" className="mt-2 p-2 border rounded-md" />
          </div>

          <div className="ml-2">
            <label className="block text-gray-700">Closing Hours</label>
            <input ref={closingHoursRef} type="time" className="mt-2 p-2 border rounded-md" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Website</label>
          <input ref={websiteRef} type="url" className="mt-2 w-full p-2 border rounded-md" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Extra Information</label>
          <textarea ref={extraInformationRef} className="mt-2 w-full p-2 border rounded-md"></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Add Activity
        </button>
      </form>
    </div>
  </div>
)}

      {isLoading && <p>Loading...</p>}

      {!isLoading && (
        <div>
          {activities?.map((activity: any, activityIndex: number) => (
            <div key={activity.name} className="bg-white p-4 mb-4 shadow-md rounded-md">
              <h2 className="text-xl font-semibold">{activity.name}</h2>
              <p className="text-gray-700">{activity.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;
