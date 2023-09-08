import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import addSVG from '../../public/svg/add.svg';
import logoutSVG from '../../public/svg/logout.svg';
import Router from 'next/router';

export default function Navbar(props) {
  const { toggleSidebar, toggleAddTask } = props;

  const handleLogout = async () => {
    localStorage.removeItem('tasuke-user');

    Router.push('/auth/login');
  };

  return (
    <div className={styles.navigation}>
      <div className={styles.left_group}>
        <svg
          onClick={toggleSidebar}
          className={styles.menu}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
        >
          <path d='M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z' />
        </svg>
        <input type='text' name='search' className={styles.search} />
      </div>

      <div className={styles.right_group}>
        <Image
          src={addSVG}
          onClick={toggleAddTask}
          className={styles['nav-bar-icon']}
          alt='add icon'
        />
        <svg
          className={styles['nav-bar-icon']}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 -960 960 960'
        >
          <path d='M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z' />
        </svg>
        <Image
          src={logoutSVG}
          alt='logout icon'
          className={styles['nav-bar-icon']}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
