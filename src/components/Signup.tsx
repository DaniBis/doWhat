import { useState } from 'react';
import { signupFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase'; // directly import the auth instance from your firebase configuration

const fields = signupFields;
let fieldsState = {};

fields.forEach(field => (fieldsState[field.id] = ''));

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      const { username, 'email-address': email, password } = signupState;
    
      console.log('Username:', username, 'Email:', email, 'Password:', password);
    
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        await updateProfile(user, {
          displayName: username,
        });
    
        console.log('User signed up successfully!');
      } catch (error) {
        console.error('Error signing up:', error);
    
        // Handle specific error
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('The email address is already in use by another account.');
        } else {
          setErrorMessage('Error signing up. Please try again.');
        }
      }
    };
    

  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
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
        ))}
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
