import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import Router from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [suggestedTask, setSuggestedTask] = useState({});
  const [completedTasks, setCompletedTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('jwt') == null) {
      Router.push('/auth');
    }

    getTasks();
    getCompletedTasks();
  }, [refresh]);

  useEffect(() => {
    suggestTask();
  }, [suggestedTasks]);

  const getTasks = async () => {
    const token = localStorage.getItem('jwt');
    const r = await fetch(
      'https://task-suggestion-api.onrender.com/api/tasks',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tasks = await r.json();

    setTasks(tasks);
    setSuggestedTasks([...tasks]);
  };

  const getCompletedTasks = async () => {
    const token = localStorage.getItem('jwt');

    const r = await fetch(
      'https://task-suggestion-api.onrender.com/api/tasks/completed',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tasks = await r.json();

    setCompletedTasks([...tasks]);
  };

  const suggestTask = () => {
    if (suggestedTasks.length == 0) setSuggestedTasks([...tasks]);

    suggestedTasks.sort((task1, task2) => task1.priority - task2.priority);

    const suggestedTask = suggestedTasks.shift();

    setSuggestedTask({ ...suggestedTask });
  };

  const handleAddTask = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('jwt');
    const title = event.target.elements.title.value;
    const note = event.target.elements.note.value;
    const priority = event.target.elements.priority.value;

    if (!title) {
      alert('task title cannot be empty');
      return;
    }

    let t = await fetch('https://task-suggestion-api.onrender.com/api/tasks', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, note, priority }),
    }).then((r) => r.json());

    setTasks([...tasks, t]);

    event.target.reset();
  };

  const markAsDone = async (event, taskIndex) => {
    event.preventDefault();

    const token = localStorage.getItem('jwt');
    const r = await fetch(
      'https://task-suggestion-api.onrender.com/api/tasks/' +
        taskIndex +
        '/mark-as-done',
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((r) => r.json());

    if (r) {
      setRefresh(!refresh);
    }
  };

  const deleteTask = async (e, taskIndex) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt');
    const r = await fetch(
      'https://task-suggestion-api.onrender.com/api/tasks/' + taskIndex,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((r) => r.json());

    if (r) {
      setRefresh(!refresh);
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
      <main className={styles.main}>
        <div className={styles['pending-tasks']}>
          <div className={styles.items}>
            <h2 className={styles.header}>Pending Tasks</h2>
            {tasks.map((task) => (
              <a href='#' className={styles.card} key={task.taskID}>
                <h2 className={inter.className}>{task.title}</h2>
                <p className={inter.className}>{task.note}</p>
                <p>
                  <b>
                    <u>Status:</u>
                  </b>{' '}
                  {task.status}
                </p>
                <button
                  type='button'
                  onClick={(e) => deleteTask(e, task.taskID)}
                >
                  Delete
                </button>
              </a>
            ))}
          </div>
        </div>

        <div className={styles['suggested-task']}>
          <h2 className={styles.header}>Suggested Task</h2>
          <a href='#' className={styles.card}>
            <h2 className={inter.className}>{suggestedTask.title}</h2>
            <p className={inter.className}>{suggestedTask.note}</p>
            <p>
              <b>
                <u>Status:</u>
              </b>{' '}
              {suggestedTask.status}
            </p>

            <button
              className={styles['mark-as-done']}
              type='submit'
              onClick={(e) => markAsDone(e, suggestedTask.taskID)}
            >
              Mark as done
            </button>
            <button
              className={styles['mark-as-done']}
              type=''
              onClick={suggestTask}
            >
              Suggest another task
            </button>
          </a>

          <form className={styles.form} onSubmit={handleAddTask}>
            <h2>Add a task:</h2>
            <input
              id='title'
              name='title'
              type='text'
              placeholder='title'
              className={styles.field}
            />{' '}
            <br></br>
            <input
              id='note'
              name='note'
              type='text'
              placeholder='note'
              className={styles.field}
            />{' '}
            <br></br>
            <input
              id='priority'
              name='priority'
              type='text'
              placeholder='priority'
              className={styles.field}
            />{' '}
            <br></br>
            <button type='submit'>Add</button>
          </form>
        </div>

        <div className={styles['completed-tasks']}>
          <div className={styles.items}>
            <h2 className={styles.header}>Completed Tasks</h2>
            {completedTasks.map((task) => (
              <a href='#' className={styles.card} key={task.taskID}>
                <h2 className={inter.className}>{task.title}</h2>
                <p className={inter.className}>{task.note}</p>
                <p>
                  <b>
                    <u>Status:</u>
                  </b>{' '}
                  {task.status}
                </p>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
