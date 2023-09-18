import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import menuSVG from '../../public/svg/menu.svg';
import notificationsSVG from '../../public/svg/notifications.svg';
import settingsSVG from '../../public/svg/settings.svg';
import accountSVG from '../../public/svg/account.svg';
import logoutSVG from '../../public/svg/logout.svg';
import Router, { useRouter } from 'next/router';

export default function Navbar(props) {
  const { toggleSidebar } = props;

  const handleLogout = async () => {
    localStorage.removeItem('tasuke-user');

    Router.push('/auth/login');
  };

  const currentPath = useRouter();
  const currentPage = currentPath.pathname.replace('/', '');

  return (
    <div className={styles.navigation}>
      <div className={styles['left-group']}>
        <Image
          src={menuSVG}
          alt='menu icon'
          onClick={toggleSidebar}
          className={styles['nav-bar-icon']}
        />
        <p>{currentPage == '' ? 'Inbox' : currentPage}</p>
      </div>

      <div className={styles['right-group']}>
        <Image
          src={notificationsSVG}
          alt='notifications icon'
          className={styles['nav-bar-icon']}
        />
        <Image
          src={settingsSVG}
          alt='settings icon'
          className={styles['nav-bar-icon']}
        />
        <div className={styles['nav-account']}>
          <p>{`Tosin`}</p>
          <Image
            src={accountSVG}
            alt='account icon'
            className={styles['nav-bar-icon']}
          />
        </div>
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
