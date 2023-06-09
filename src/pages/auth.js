import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Router from 'next/router';

export default function Home() {
  const auth = async (event) => {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;

    const r = await fetch(
      'https://task-suggestion-api.onrender.com/api/auth/login',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }
    );
    const u = await r.json();

    if (u.status == 401) {
      alert('username/password mismatch!');
    } else {
      localStorage.setItem('jwt', u.access_token);

      Router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>Create Task App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles['form-container']}>
        <form onSubmit={auth} className={styles.form}>
          <input
            type='text'
            placeholder='username'
            name='username'
            className={[styles.field, styles.input].join(' ')}
          />
          <input
            type='password'
            placeholder='password'
            name='password'
            className={[styles.field, styles.input].join(' ')}
          />
          <input
            type='submit'
            value='login'
            className={[styles.btn, styles.input].join(' ')}
          />
        </form>
      </div>
    </>
  );
}
