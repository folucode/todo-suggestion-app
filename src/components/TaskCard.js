import styles from '../styles/task-card.module.css';
import circleSVG from '../../public/svg/circle.svg';
import calendarSVG from '../../public/svg/calendar.svg';
import checkCircle from '../../public/svg/check_circle.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import momentTZ from 'moment-timezone';
import moment from 'moment/moment';

export default function TaskCard(props) {
  const { index, task, onClickTask } = props;

  const [dueDate, setDueDate] = useState(null);

  const markAsDone = async (taskId) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks/${taskId}/mark-as-done`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));
  }, []);

  return (
    <>
      <div className={styles['task-card']} id={index}>
        <div className={styles['card-icon']}>
          <Image
            src={task.status == 'Pending' ? circleSVG : checkCircle}
            alt='circle icon'
            onClick={() => markAsDone(task.taskId)}
          />
        </div>
        <div
          className={styles['content-area']}
          onClick={() => onClickTask(task)}
        >
          <p className={styles['task-title']}>{task.name}</p>
          {task.description ? (
            <p className={styles['task-description']}>{task.description}</p>
          ) : (
            ''
          )}

          <div className={styles['card-footer']}>
            <div className={styles['card-footer-item']}>
              {task.dueDate ? (
                <>
                  <Image
                    src={calendarSVG}
                    alt='calendar'
                    width={16}
                    height={16}
                  />

                  <span>
                    {moment(task.dueDate).format('dddd, MMMM Do, [at] h:mm a')}
                  </span>
                </>
              ) : (
                ''
              )}
            </div>
            {task.label && task.label.length > 0 ? (
              <div className={styles['card-footer-item']}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='18'
                  viewBox='0 -960 960 960'
                  width='20'
                  fill={task.label[0].color}
                >
                  <path d='M542.308-131.692q-11.529 11.461-28.573 11.461-17.043 0-28.504-11.461l-352-352q-6.385-6.385-9.808-14.02T120-514v-286q0-16.077 11.961-28.039Q143.923-840 160-840h286q7.769 0 15.452 3.166 7.683 3.167 13.317 8.526l352 352.231Q839-463.846 839.385-446.5q.384 17.346-11.077 28.808l-286 286ZM513.425-160l286.344-286-353.425-354H160v286l353.425 354ZM259.91-660q16.629 0 28.359-11.64Q300-683.281 300-699.909q0-16.63-11.64-28.36Q276.72-740 260.09-740q-16.629 0-28.359 11.64Q220-716.719 220-700.091q0 16.63 11.64 28.36Q243.28-660 259.91-660ZM160-800Z' />
                </svg>

                <span>{task.label[0].name}</span>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
}
