import { db, storage } from './../firebase'; // Adjust the import path as needed
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface NewActivity {
  name: string;
  geolocation: string; // Assuming geolocation is a string, adjust the type as needed
  openingHours: string;
  closingHours: string;
  website: string;
  extraInformation: string;
}

export const addActivity = async (newActivity: NewActivity, imageFile: File) => {
  try {
    // First, upload the image to Firebase Storage
    const imageRef = ref(storage, `activities/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Then, add the new activity with the image URL to Firestore
    const docRef = await addDoc(collection(db, 'activities'), {
      ...newActivity,
      imageUrl // Add the image URL to the activity document
    });

    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e; // Throw the error so you can catch it where the function is called
  }
};
