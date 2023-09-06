import styles from '../styles/sidebar.module.css';

export default function Sidebar(props) {
  const sidebarClassName = `${styles.sidebar} ${
    props.isSidebarOpen ? '' : styles['sidebar-transition']
  }`;

  return (
    <div className={sidebarClassName}>
      <ul>
        <li className={styles.active}>
          <div className={styles['list-item']}>
            <a href=''>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='24'
                viewBox='0 -960 960 960'
                width='24'
                className={styles.inbox}
              >
                <path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-120H640q-30 38-71.5 59T480-240q-47 0-88.5-21T320-320H200v120Zm280-120q38 0 69-22t43-58h168v-360H200v360h168q12 36 43 58t69 22ZM200-200h560-560Z' />
              </svg>
              <span>Inbox</span>
            </a>
            <span>
              <div>10</div>
            </span>
          </div>
        </li>
        <li>
          <div className={styles['list-item']}>
            <a href=''>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='24'
                viewBox='0 -960 960 960'
                width='24'
                className={styles.today}
              >
                <path d='M360-300q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z' />
              </svg>
              <span>Today</span>
            </a>
            <span>
              <div>10</div>
            </span>
          </div>
        </li>
        <li>
          <div className={styles['list-item']}>
            <a href=''>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='24'
                viewBox='0 -960 960 960'
                width='24'
                className={styles.upcoming}
              >
                <path d='M600-80v-80h160v-400H200v160h-80v-320q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H600ZM320 0l-56-56 103-104H40v-80h327L264-344l56-56 200 200L320 0ZM200-640h560v-80H200v80Zm0 0v-80 80Z' />
              </svg>
              <span>Upcoming</span>
            </a>
            <span>
              <div>10</div>
            </span>
          </div>
        </li>
        <li>
          <div className={styles['list-item']}>
            <a href=''>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='24'
                viewBox='0 -960 960 960'
                width='24'
                className={styles.labels}
              >
                <path d='M120-540v-300h300v300H120Zm80-80h140v-140H200v140Zm-80 500v-300h300v300H120Zm80-80h140v-140H200v140Zm340-340v-300h300v300H540Zm80-80h140v-140H620v140Zm-80 500v-300h300v300H540Zm80-80h140v-140H620v140ZM340-620Zm0 280Zm280-280Zm0 280Z' />
              </svg>
              <span>Labels</span>
            </a>
            <span>
              <div>10</div>
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
}
