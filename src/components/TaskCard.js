import styles from '../styles/task-card.module.css';
import editSVG from '../../public/svg/edit.svg';
import deleteSVG from '../../public/svg/delete.svg';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import TaskForm from './TaskForm';
import momentTZ from 'moment-timezone';

export default function TaskCard(props) {
  const { index, task } = props;

  const [showMore, setShowMore] = useState(false);
  const [isAddTaskShow, setIsAddTaskShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [dueDate, setDueDate] = useState(null);
  const [user, setUser] = useState(null);

  const toggleAddTask = () => setIsAddTaskShow(!isAddTaskShow);

  const showMoreRef = useRef();

  const handleEditTask = (e) => {
    e.preventDefault();

    let reminderTime = null;
    let dueDate = null;

    if (task.reminders.length > 0) {
      const timeInISO = new Date(task.reminders[0].time).toISOString();

      reminderTime = momentTZ(timeInISO).tz(user.user.timezone).toDate();
    }

    if (task.dueDate != null) {
      const timeInISO = new Date(task.dueDate).toISOString();

      dueDate = momentTZ(timeInISO).tz(user.user.timezone).toDate();
    }

    const initialValues = {
      taskId: task.taskId,
      taskName: task.name,
      description: task.description,
      priority: task.priority,
      dueDate,
      reminderTime,
      recurringFrequency: task.isRecurring
        ? task.recurringFrequency.frequency
        : null,
    };

    setInitialValues(initialValues);

    setIsEdit(true);
    setIsAddTaskShow(true);

    return;
  };

  const deleteTask = async (e, taskId) => {
    e.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    setShowMore(false);
  };

  const markAsDone = async (event, taskId) => {
    event.preventDefault();

    const r = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks/${taskId}/mark-as-done`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    setShowMore(false);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    setUser(user);

    if (task.dueDate != null) {
      const timeInISO = new Date(task.dueDate).toISOString();

      setDueDate(
        new Date(
          momentTZ(timeInISO).tz(user.user.timezone).toString()
        ).toDateString()
      );
    }

    const handleOutsideClick = (e) => {
      if (showMore) {
        const element = showMoreRef.current;

        if (element && !element.contains(e.target)) {
          setShowMore(!showMore);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showMore]);

  return (
    <>
      <div className={styles['task-card']} id={index}>
        <div className={styles['task-title']}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            viewBox='0 -960 960 960'
            width='24'
            onClick={(e) => markAsDone(e, task.taskId)}
          >
            <path d='m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z' />
          </svg>
          <h3>{task.name}</h3>
          <div style={{ marginLeft: 'auto' }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='24'
              viewBox='0 -960 960 960'
              width='24'
              onClick={() => setShowMore(!showMore)}
            >
              <path d='M249.231-420.001q-24.749 0-42.374-17.625-17.624-17.625-17.624-42.374 0-24.749 17.624-42.374 17.625-17.625 42.374-17.625 24.75 0 42.374 17.625Q309.23-504.749 309.23-480q0 24.749-17.625 42.374-17.624 17.625-42.374 17.625Zm230.769 0q-24.749 0-42.374-17.625-17.625-17.625-17.625-42.374 0-24.749 17.625-42.374 17.625-17.625 42.374-17.625 24.749 0 42.374 17.625 17.625 17.625 17.625 42.374 0 24.749-17.625 42.374-17.625 17.625-42.374 17.625Zm230.769 0q-24.75 0-42.374-17.625Q650.77-455.251 650.77-480q0-24.749 17.625-42.374 17.624-17.625 42.374-17.625 24.749 0 42.374 17.625 17.624 17.625 17.624 42.374 0 24.749-17.624 42.374-17.625 17.625-42.374 17.625Z' />
            </svg>
            {showMore && (
              <div className={styles['card-more']} ref={showMoreRef}>
                <div
                  className={styles['card-more-item']}
                  onClick={(e) => handleEditTask(e)}
                >
                  <Image src={editSVG} alt='edit icon' />
                  <p>Edit task</p>
                </div>
                <div
                  className={styles['card-more-item']}
                  onClick={(e) => deleteTask(e, task.taskId)}
                >
                  <Image src={deleteSVG} alt='delete icon' />
                  <p>Delete task</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles['task-description']}>{task.description}</div>
        <div className={styles['card-footer']}>
          <div className={styles['card-footer-item']}>
            {dueDate ? (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='20'
                  viewBox='0 -960 960 960'
                  width='18'
                >
                  <path d='M595.385-240q-35.077 0-59.847-24.769-24.769-24.77-24.769-59.846 0-35.077 24.769-59.847 24.77-24.769 59.847-24.769 35.076 0 59.846 24.769Q680-359.692 680-324.615q0 35.076-24.769 59.846Q630.461-240 595.385-240Zm-370.77 120Q197-120 178.5-138.5 160-157 160-184.615v-510.77Q160-723 178.5-741.5 197-760 224.615-760h70.769v-89.231h43.077V-760h286.154v-89.231h40.001V-760h70.769Q763-760 781.5-741.5 800-723 800-695.385v510.77Q800-157 781.5-138.5 763-120 735.385-120h-510.77Zm0-40h510.77q9.23 0 16.923-7.692Q760-175.385 760-184.615v-350.77H200v350.77q0 9.23 7.692 16.923Q215.385-160 224.615-160ZM200-575.385h560v-120q0-9.23-7.692-16.923Q744.615-720 735.385-720h-510.77q-9.23 0-16.923 7.692Q200-704.615 200-695.385v120Zm0 0V-720v144.615Z' />
                </svg>
                <span>{dueDate}</span>
              </>
            ) : (
              ''
            )}
          </div>
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

            <span>{task.label.length > 0 ? task.label[0].name : ''}</span>
          </div>
        </div>
      </div>
      {isAddTaskShow && (
        <TaskForm
          initialValues={initialValues}
          isEdit={isEdit}
          isAddTaskShow={isAddTaskShow}
          toggleAddTask={toggleAddTask}
        />
      )}
    </>
  );
}
