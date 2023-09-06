import styles from '../styles/task-card.module.css';
import editSVG from '../../public/svg/edit.svg';
import deleteSVG from '../../public/svg/delete.svg';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import TaskForm from './TaskForm';
import momentTZ from 'moment-timezone';

export function TaskCard(props) {
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

    await fetch(`${process.env.LOCAL_PROD_URL}/tasks/${taskId}`, {
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
      `${process.env.LOCAL_PROD_URL}/tasks/${taskId}/mark-as-done`,
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
        <span>{dueDate}</span>
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
