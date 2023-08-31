import authStyles from '../styles/auth.css';

export const SignUp = () => {
  return (
    <div className={authStyles.container}>
      <h1>okay!</h1>
      <input type='text' placeholder='Enter your email...' />
      <input type='text' placeholder='Enter your password...' />
      <button type='button'>SignUp with email</button>
    </div>
  );
};
