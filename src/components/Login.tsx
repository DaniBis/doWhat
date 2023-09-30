import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormAction from '../components/FormAction';
import Input from '../components/Input';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setLoginState({ ...loginState, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = loginState;

    const isUserExists = await checkIfUserExists(username, password);

    if (isUserExists) {
        navigate('/activities');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  const checkIfUserExists = async (username, password) => {
    const usersCollection = collection(db, 'Users');
    const q = query(usersCollection, where('username', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        <Input
          id="username"
          type="text"
          labelText="Username"
          placeholder="Enter your username"
          handleChange={handleChange}
          value={loginState.username}
          isRequired={true}
        />
        <Input
          id="password"
          type="password"
          labelText="Password"
          placeholder="Enter your password"
          handleChange={handleChange}
          value={loginState.password}
          isRequired={true}
        />
        {errorMessage && (
          <div className="text-red-500">{errorMessage}</div>
        )}
        <FormAction handleSubmit={handleSubmit} text="Login" />
        <p className="text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign up here</Link>
        </p>
      </div>
    </form>
  );
}
