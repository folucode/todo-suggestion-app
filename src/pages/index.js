import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import loader from '../../public/loader.svg';
import Image from 'next/image';
import { io } from 'socket.io-client';
import Sidebar from '@/components/Sidebar';
import TaskForm from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';

export default function Home() {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [suggestedTask, setSuggestedTask] = useState({});
  const [completedTasks, setCompletedTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [value, onChange] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddTaskShow, setIsAddTaskShow] = useState(false);

  const toggleAddTask = () => setIsAddTaskShow(!isAddTaskShow);

  useEffect(() => {
    if (localStorage.getItem('tasuke-user') == 'undefined') {
      Router.push('/auth/login');
    }

    // console.log(process.env.BASE_PROD_API_URL);

    const socket = io(process.env.NEXT_PUBLIC_PROD_API_URL);

    socket.on('connect', function () {
      console.log('socket.io connected...');
      getTasks();
    });

    socket.on('createTask', function (data) {
      if (data.status == 'success') {
        getTasks();
      } else {
        console.log(data);
      }
    });

    socket.on('updateTask', function (data) {
      if (data.status == 'success') {
        getTasks();
      } else {
        console.log(data);
      }
    });

    socket.on('deleteTask', function (data) {
      if (data.status == 'success') {
        if (data.data.taskStatus == 'Pending') {
          let removedTaskIndex = pendingTasks.findIndex(
            (task) => (task.taskId = data.data.taskId)
          );

          pendingTasks.splice(removedTaskIndex, 1);
        } else {
          let removedTaskIndex = completedTasks.findIndex(
            (task) => (task.taskId = data.data.taskId)
          );

          completedTasks.splice(removedTaskIndex, 1);
        }
      } else {
        console.log(data);
      }
    });

    socket.on('completeTask', function (data) {
      if (data.status == 'success') {
        let task = pendingTasks.find(
          (task) => (task.taskId = data.data.taskId)
        );

        completedTasks.push(task);
      } else {
        console.log(data);
      }
    });
  }, []);

  useEffect(() => {
    // suggestTask();
  }, [suggestedTasks]);

  const getTasks = async () => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const r = await fetch(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    const tasks = await r.json();

    if (tasks.data.length < 1) {
      setPendingTasks([]);
      setCompletedTasks([]);
      return;
    }

    const pending = tasks.data.filter((task) => task._id == 'Pending');
    const completed = tasks.data.filter((task) => task._id == 'Completed');

    if (pending.length < 1) {
      setPendingTasks([]);
    } else {
      setPendingTasks(pending[0].tasks);
    }

    if (completed.length < 1) {
      setCompletedTasks([]);
    } else {
      setCompletedTasks(completed[0].tasks);
    }
  };

  const suggestTask = () => {
    if (suggestedTasks.length == 0) setSuggestedTasks([...tasks]);

    suggestedTasks.sort((task1, task2) => task1.priority - task2.priority);

    const suggestedTask = suggestedTasks.shift();

    setSuggestedTask({ ...suggestedTask });
  };

  return (
    <>
      <Head>
        <title>Tasuke</title>
        <meta name='description' content='Task management application' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='' />
      </Head>

      <div className={styles.page}>
        <div className={styles.navigation}>
          <div className={styles.left_group}>
            <svg
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={styles.menu}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 -960 960 960'
            >
              <path d='M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z' />
            </svg>
            <input type='text' name='search' className={styles.search} />
          </div>

          <div className={styles.right_group}>
            <svg
              className={styles.add}
              xmlns='http://www.w3.org/2000/svg'
              height='24'
              viewBox='0 -960 960 960'
              width='24'
              onClick={toggleAddTask}
            >
              <path d='M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z' />
            </svg>
            <svg
              className={styles.notification}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 -960 960 960'
            >
              <path d='M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z' />
            </svg>
          </div>
        </div>

        <main className={styles.main}>
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <div
            className={styles['tasks-area']}
            style={{ marginLeft: isSidebarOpen ? '300px' : '0' }}
          >
            <h1>Inbox</h1>

            <div className={styles['tasks-sections']}>
              <div className={styles.section}>
                <h2>Pending Tasks</h2>
                {pendingTasks.map((task, index) => (
                  <TaskCard
                    index={task.taskId}
                    task={task}
                    dueDate={task.dueDate}
                    key={index}
                  />
                ))}
              </div>
              <div className={styles.section}>
                <h2>Completed Tasks</h2>
                {completedTasks.map((task, index) => (
                  <TaskCard
                    index={task.taskId}
                    task={task}
                    dueDate={task.dueDate}
                    key={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        {isAddTaskShow && (
          <TaskForm
            initialValues={{}}
            isEdit={false}
            isAddTaskShow={isAddTaskShow}
            toggleAddTask={toggleAddTask}
          />
        )}
      </div>
    </>
  );
}
