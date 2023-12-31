import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormAction from '../components/FormAction';
import Input from '../components/Input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import your auth instance

export default function Login() {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState({ 'email-address': '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setLoginState({ ...loginState, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { 'email-address': email, password } = loginState;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/activities');
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        <Input
          id="email-address"
          type="email"
          labelText="Email address"
          placeholder="Enter your email address"
          handleChange={handleChange}
          value={loginState['email-address']}
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
