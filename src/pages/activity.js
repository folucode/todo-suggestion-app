import { HeadComponent } from '@/components/Head';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import mainStyles from '@/styles/Home.module.css';
import styles from '@/styles/activity.module.css';
import { useEffect, useRef, useState } from 'react';
import completedSVG from '../../public/svg/completed_action.svg';
import uncompletedSVG from '../../public/svg/uncompleted_action.svg';
import updatedSVG from '../../public/svg/updated_action.svg';
import addedSVG from '../../public/svg/added_action.svg';
import deleteSVG from '../../public/svg/delete_action.svg';
import Image from 'next/image';
import momentTZ from 'moment-timezone';

export default function Activity() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activities, setActivities] = useState([]);
  const [selectedAction, setSelectedAction] = useState('All actions');
  const [selectedActionSVG, setSelectedActionSVG] = useState('');
  const [user, setUser] = useState('');

  const [isActionsListOpen, setIsActionsListOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const actions = [
    {
      svg: addedSVG,
      action: 'Added Task',
    },
    {
      svg: updatedSVG,
      action: 'Updated Task',
    },
    {
      svg: completedSVG,
      action: 'Completed Task',
    },
    {
      svg: uncompletedSVG,
      action: 'Uncompleted Task',
    },
    {
      svg: deleteSVG,
      action: 'Deleted Task',
    },
  ];

  const actionListRef = useRef();

  useEffect(() => {
    getActivities();
  }, [selectedAction]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isActionsListOpen) {
        const element = actionListRef.current;

        if (element && !element.contains(e.target)) {
          setIsActionsListOpen(!isActionsListOpen);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isActionsListOpen]);

  const getActivities = async () => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));
    setUser(user);

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/activities/${
        selectedAction == 'All actions' ? '' : selectedAction
      }`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    const result = await data.json();

    setActivities(result.data.activities);
  };

  const getActionSVG = (userAction) => {
    const action = actions.find((action) => action.action == userAction);

    return action.svg;
  };

  return (
    <div>
      <HeadComponent />

      <div className={mainStyles.page}>
        <Sidebar isSidebarOpen={isSidebarOpen} />

        <main className={mainStyles.main}>
          <Navbar toggleSidebar={toggleSidebar} />

          <div className={mainStyles['main-area']}>
            <div className={styles['activity-area']}>
              <div
                className={styles['activity-actions-area']}
                ref={actionListRef}
              >
                <div
                  className={styles['selected-action']}
                  onClick={() => setIsActionsListOpen(!isActionsListOpen)}
                >
                  {selectedActionSVG != '' ? (
                    <Image src={selectedActionSVG} />
                  ) : (
                    ''
                  )}
                  <p>{selectedAction}</p>
                </div>
                <div
                  className={`${styles['actions']}  ${
                    isActionsListOpen ? styles['show-actions'] : ''
                  }`}
                >
                  <div
                    className={styles['individual-action']}
                    onClick={() => {
                      setSelectedAction('All actions');
                      setSelectedActionSVG('');
                      setIsActionsListOpen(!isActionsListOpen);
                    }}
                  >
                    <p style={{ justifyContent: 'center' }}>All Actions</p>
                  </div>
                  {actions.map((action, index) => (
                    <div
                      className={styles['individual-action']}
                      key={index}
                      onClick={() => {
                        setSelectedAction(action.action);
                        setSelectedActionSVG(action.svg);
                        setIsActionsListOpen(!isActionsListOpen);
                      }}
                    >
                      <Image src={action.svg} alt={action.action} />
                      <p>{action.action}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles['user-actions-list']}>
                {activities.length > 0
                  ? activities.map((activity, index) => (
                      <div key={index}>
                        <p className={styles['user-actions-list-header']}>
                          {activity._id}
                        </p>

                        {activity.actions.map((action, index) => (
                          <div
                            className={styles['individual-user-actions']}
                            key={index}
                          >
                            <Image
                              src={getActionSVG(action.action)}
                              alt={action.action}
                            />
                            <div
                              className={styles['individual-user-actions-main']}
                            >
                              <p>{action.comment}</p>
                              {action.newValue !== '' ? (
                                <p>
                                  <i style={{ color: 'gray' }}>
                                    {action.newValue}
                                  </i>
                                </p>
                              ) : (
                                ''
                              )}
                              <span>{action.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  : ''}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
