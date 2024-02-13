import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc, getDocs, DocumentData } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';
import  GoogleActivities  from './../components/ActivityController';

interface Activity {
  id: string;
  name?: string;
  geolocation?: string;
  openingHours?: string;
  closingHours?: string;
  website?: string;
  extraInformation?: string;
  imageUrl?: string;
}

const addActivity = async (newActivity: Omit<Activity, 'id'>, imageFile: File) => {
  const imageRef = ref(getStorage(), `activities/${imageFile.name}`);
  const uploadResult = await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(uploadResult.ref);
  const docRef = await addDoc(collection(db, 'activities'), {
    ...newActivity,
    imageUrl,
  });
  return docRef.id;
};

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const geolocationRef = useRef<HTMLInputElement>(null);
  const openingHoursRef = useRef<HTMLInputElement>(null);
  const closingHoursRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const extraInformationRef = useRef<HTMLTextAreaElement>(null);

  const fetchActivities = async () => {
    const querySnapshot = await getDocs(collection(db, 'activities'));
    setActivities(querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageInputRef.current?.files?.[0]) return;
    const imageFile = imageInputRef.current.files[0];
    const newActivityData = {
      name: nameRef.current?.value,
      geolocation: geolocationRef.current?.value,
      openingHours: openingHoursRef.current?.value,
      closingHours: closingHoursRef.current?.value,
      website: websiteRef.current?.value,
      extraInformation: extraInformationRef.current?.value,
    };
  
    try {
      await addActivity(newActivityData as Omit<Activity, 'id'>, imageFile);
      setIsModalOpen(false);
      // Refresh the activities list
      await fetchActivities();  // fetchActivities is the function defined in the useEffect
    } catch (error) {
      console.error('Error while adding activity:', error);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);


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

      {activities.length > 0 ? (
            <div className='grid grid-cols-3 gap-4'>
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white p-4 shadow-md rounded-md">
                  <img src={activity.imageUrl} />
                  <h2 className="text-xl font-semibold text-black">{activity.name}</h2>
                </div>
              ))}
              <GoogleActivities />;
            </div>
          ) : (
            <p>No activities found or they are still loading...</p>
          )}
        </div>
  );
};

export default Activities;
