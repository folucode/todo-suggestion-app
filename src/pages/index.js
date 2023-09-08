import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import loader from '../../public/loader.svg';
import Image from 'next/image';
import { io } from 'socket.io-client';
import Sidebar from '@/components/Sidebar';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [suggestedTask, setSuggestedTask] = useState({});
  const [completedTasks, setCompletedTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddTaskShow, setIsAddTaskShow] = useState(false);

  const toggleAddTask = () => setIsAddTaskShow(!isAddTaskShow);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (localStorage.getItem('tasuke-user') == null) {
      Router.push('/auth/login');
    }

    const socket = io(process.env.NEXT_PUBLIC_LOCAL_API_URL);

    socket.on('connect', function () {
      console.log('socket.io connected...');
      getTasks();
    });

    socket.on('createTask', function (data) {
      console.log(data);
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
        // if (data.data.taskStatus == 'Pending') {
        //   let removedTaskIndex = pendingTasks.findIndex(
        //     (task) => (task.taskId = data.data.taskId)
        //   );

        //   pendingTasks.splice(removedTaskIndex, 1);
        // } else {
        //   let removedTaskIndex = completedTasks.findIndex(
        //     (task) => (task.taskId = data.data.taskId)
        //   );

        //   completedTasks.splice(removedTaskIndex, 1);
        // }
        getTasks();
      } else {
        console.log(data);
      }
    });

    socket.on('completeTask', function (data) {
      if (data.status == 'success') {
        getTasks();
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

    const r = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/tasks`, {
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
        <Navbar toggleSidebar={toggleSidebar} toggleAddTask={toggleAddTask} />

        <main className={styles.main}>
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <div
            className={styles['main-area']}
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

        <TaskForm
          initialValues={{}}
          isEdit={false}
          isAddTaskShow={isAddTaskShow}
          toggleAddTask={toggleAddTask}
        />
      </div>
    </>
  );
}
