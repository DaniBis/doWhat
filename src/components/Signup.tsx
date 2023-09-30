import { useState } from 'react';
import { signupFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import { db } from '../firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';


const fields = signupFields;
let fieldsState = {};

fields.forEach(field => fieldsState[field.id] = '');

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isExists = await checkIfUserExists(signupState.username, signupState["email-address"]);

    if (!isExists) {
      await createAccount(signupState);
    } else {
      setErrorMessage('Username or email already exists');
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  // Function to check if a user with the same username or email already exists
  const checkIfUserExists = async (username, email) => {
    const usersCollection = collection(db, 'Users');
    const q = query(usersCollection, where('username', '==', username), where('email-address', '==', email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  // Add a new signup entry to the Firestore collection
  const createAccount = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'Users'), data);
      console.log('Document written with ID: ', docRef.id);
      // Handle success or redirect to a different page
    } catch (error) {
      console.error('Error adding document: ', error);
      // Handle errors, show an error message, etc.
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map(field =>
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        )}
        {errorMessage && (
          <div className="text-red-500">{errorMessage}</div>
        )}
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}