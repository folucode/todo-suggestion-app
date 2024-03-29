import { useState, useEffect } from 'react';
import authStyles from '../../styles/auth.module.css';
import Link from 'next/link';
import Router from 'next/router';
import Image from 'next/image';
import logo from '../../../public/svg/logo-auth.svg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // if (localStorage.getItem('tasuke-user') != null) {
    //   Router.push('/');
    // }
  }, []);

  const handleAuth = async (event) => {
    event.preventDefault();

    if (username == '' || password == '') {
      alert('username and password cannot be empty!');
    }

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const result = await data.json();

    localStorage.setItem('tasuke-user', JSON.stringify(result.data));

    Router.push('/');
  };

  return (
    <>
      <div className={authStyles.container}>
        <div className={authStyles['form-container']}>
          <Image src={logo} alt='app logo' />
          <h1>Login to your account</h1>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            placeholder='Enter your username...'
            name='username'
            onChange={(e) => setUsername(e.target.value)}
            //   onBlur={(e) => focusOutHandler(e, 'username')}
          />

          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            placeholder='Enter your password...'
            name='password'
            onChange={(e) => setPassword(e.target.value)}
            //   onBlur={(e) => focusOutHandler(e, 'password')}
          />

          <button onClick={handleAuth} type='submit'>
            Sign in
          </button>
          <p>
            Don't have an account?{' '}
            <Link href='/auth/sign-up' className={authStyles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
