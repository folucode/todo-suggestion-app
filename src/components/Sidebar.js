import Image from 'next/image';
import styles from '../styles/sidebar.module.css';
import historySVG from '../../public/svg/history.svg';
import logo from '../../public/svg/logo.svg';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Sidebar(props) {
  const sidebarClassName = `${styles.sidebar} ${
    props.isSidebarOpen ? '' : styles['hide-sidebar']
  }`;

  const currentPath = useRouter();

  return (
    <div className={sidebarClassName}>
      <div className={styles['logo-area']}>
        <Image src={logo} alt='app logo' />
        <p>Tasuke</p>
      </div>

      <div className={styles['nav-items']}>
        <a href='/' className={styles['list-item']}>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M22 12H16L14 15H10L8 12H2'
              stroke={currentPath.pathname == '/' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z'
              stroke={currentPath.pathname == '/' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>

          <span>Inbox</span>
        </a>

        <a href='/labels' className={styles['list-item']}>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M9 5H2V12L8.29 18.29C9.23 19.23 10.77 19.23 11.71 18.29L15.29 14.71C16.23 13.77 16.23 12.23 15.29 11.29L9 5Z'
              stroke={currentPath.pathname == '/labels' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M6 9.01V9'
              stroke={currentPath.pathname == '/labels' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M15 5L21.3 11.3C21.5237 11.523 21.7013 11.7879 21.8224 12.0796C21.9435 12.3714 22.0059 12.6841 22.0059 13C22.0059 13.3159 21.9435 13.6286 21.8224 13.9204C21.7013 14.2121 21.5237 14.477 21.3 14.7L17 19'
              stroke={currentPath.pathname == '/labels' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>

          <span>Labels</span>
        </a>

        <a href='/activity' className={styles['list-item']}>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M10 2H14'
              stroke={currentPath.pathname == '/activity' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M12 14V10'
              stroke={currentPath.pathname == '/activity' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M4 13C4.24486 11.056 5.19466 9.26941 6.66925 7.97914C8.14384 6.68888 10.0407 5.98464 12 6C13.294 6.00138 14.5684 6.31665 15.7139 6.91876C16.8593 7.52088 17.8416 8.39187 18.5764 9.45702C19.3113 10.5222 19.7768 11.7497 19.933 13.0343C20.0892 14.3189 19.9315 15.6222 19.4733 16.8324C19.0152 18.0426 18.2703 19.1236 17.3025 19.9827C16.3348 20.8418 15.1731 21.4533 13.9171 21.7648C12.6611 22.0763 11.3482 22.0784 10.0912 21.771C8.83422 21.4637 7.67054 20.8559 6.7 20L4 17.6'
              stroke={currentPath.pathname == '/activity' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M9 17H4V22'
              stroke={currentPath.pathname == '/activity' ? '#0072BB' : 'white'}
              strokeWidth='1'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>

          <span>Activity</span>
        </a>
      </div>
    </div>
  );
}
