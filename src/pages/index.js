import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { io } from 'socket.io-client';
import Sidebar from '@/components/Sidebar';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import Navbar from '@/components/Navbar';
import addTaskSVG from '../../public/svg/add_task.svg';
import addStepSVG from '../../public/svg/add_step.svg';
import circleSVG from '../../public/svg/circle.svg';
import calendarSVG from '../../public/svg/calendar.svg';
import editSVG from '../../public/svg/edit.svg';
import deleteSVG from '../../public/svg/delete.svg';
import DatePicker from 'react-datepicker';
import momentTZ from 'moment-timezone';

export default function Home() {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [currentTaskOldState, setCurrentTaskOldState] = useState({});

  const [taskId, setTaskId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [recurringFrequency, setRecurringFrequency] = useState('');
  const [labelId, setLabelId] = useState('');
  const [labelName, setLabelName] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (localStorage.getItem('tasuke-user') == null) {
      Router.push('/auth/login');
    }

    const socket = io(process.env.NEXT_PUBLIC_PROD_API_URL);

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
        getTasks();
      } else {
        console.log(data);
      }
    });

    socket.on('completeTask', function (data) {
      if (data.status == 'success') {
        console.log(data);
        getTasks();
      } else {
        console.log(data);
      }
    });
  }, []);

  useEffect(() => {
    let debounceTimer;

    const debounceDelay = 1000;

    handleEditTask();

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(handleEditTask, debounceDelay);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [
    taskName,
    description,
    priority,
    labelId,
    dueDate,
    reminderTime,
    recurringFrequency,
  ]);

  const handleEditTask = async () => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const data = {
      name: taskName,
      description,
      priority,
      dueDate,
      labelId,
      reminderTime,
      recurringFrequency,
    };

    const updates = {};

    Object.keys(data).forEach((value) => {
      if (currentTaskOldState[value] != '' && data[value] != '') {
        if (currentTaskOldState.hasOwnProperty(value)) {
          if (value == 'reminderTime' || value == 'dueDate') {
            if (String(currentTaskOldState[value]) !== String(data[value])) {
              updates[value] = data[value];
            }
          } else {
            if (currentTaskOldState[value] !== data[value]) {
              updates[value] = data[value];
            }
          }
        }
      } else if (currentTaskOldState[value] == '' && data[value] != '') {
        updates[value] = data[value];
      }
    });

    console.log(updates);

    if (Object.keys(updates).length > 0) {
      await fetch(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
          body: JSON.stringify(updates),
        }
      );
    }

    setCurrentTaskOldState({ ...currentTaskOldState, ...updates });
  };

  const getTasks = async () => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const r = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

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

  const handleAddTask = async (e, taskName) => {
    if (e.key === 'Enter') {
      const user = JSON.parse(localStorage.getItem('tasuke-user'));

      setPendingTasks([{ name: taskName, status: 'Pending' }, ...pendingTasks]);

      await fetch(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ name: taskName }),
      });
      e.target.value = '';
    }
  };

  const handleDeleteTask = async (taskId) => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    let newPendingTasks = pendingTasks.filter((task) => task.taskId !== taskId);

    setPendingTasks(newPendingTasks);
    onClickTask(newPendingTasks[0]);

    await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks/${taskId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
  };

  const onClickTask = (task) => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const dueDate = task.dueDate
      ? momentTZ(new Date(task.dueDate).toISOString())
          .tz(user.user.timezone)
          .toDate()
      : '';

    const reminderTime = task.reminderTime
      ? momentTZ(new Date(task.dueDate).toISOString())
          .tz(user.user.timezone)
          .toDate()
      : '';

    setTaskName(task.name);

    setTaskId(task.taskId);

    setDueDate(dueDate);

    task.description ? setDescription(task.description) : setDescription('');

    task.priority ? setPriority(task.priority) : setPriority('');

    task.labelId ? setLabelId(task.labelId) : setLabelId('');

    setReminderTime(reminderTime);

    const data = {
      taskId: task.taskId ? task.taskId : '',
      name: task.name ? task.name : '',
      description: task.description ? task.description : '',
      priority: task.priority ? task.priority : '',
      dueDate,
      labelId: task.labelId ? task.labelId : '',
      reminderTime,
      // recurringFrequency,
    };

    setCurrentTaskOldState(data);
  };

  const markAsDone = async (taskId) => {
    console.log(taskId);
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

  return (
    <>
      <Head>
        <title>Tasuke</title>
        <meta name='description' content='Task management application' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='' />
      </Head>

      <div className={styles.page}>
        <Sidebar isSidebarOpen={isSidebarOpen} />

        <main className={styles.main}>
          <Navbar toggleSidebar={toggleSidebar} />

          <div className={styles['tasks-area']}>
            <div className={styles['pending-area']}>
              <p className={styles['task-header']}>Pending Tasks</p>
              <div className={styles['task-list']}>
                {pendingTasks.map((task, index) => (
                  <div key={index}>
                    <TaskCard
                      index={task.taskId}
                      task={task}
                      dueDate={task.dueDate}
                      onClickTask={onClickTask}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles['completed-area']}>
              <p className={styles['task-header']}>Completed Tasks</p>
              <div className={styles['task-list']}>
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
            <div className={styles['edit-area']}>
              <div className={styles['first-column']}>
                <div className={styles['title-area']}>
                  <Image
                    src={circleSVG}
                    alt='circle icon'
                    onClick={() => markAsDone(currentTask.taskId)}
                  />
                  <input
                    type='text'
                    name='TaskName'
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                </div>
                <div className={styles['subtask-area']}>
                  <Image src={addStepSVG} alt='add step icon' />
                  <input type='text' placeholder='Add step' />
                </div>
              </div>
              <div className={styles['second-column']}>
                <Image src={calendarSVG} alt='calendar icon' />
                <DatePicker
                  selected={dueDate}
                  onChange={(e) => setDueDate(e)}
                  placeholderText='Set due date'
                  showTimeSelect
                  name='dueDate'
                  dateFormat='MMMM d, yyyy h:mm aa'
                  className={styles['due-date']}
                  value={dueDate}
                  autoComplete='off'
                />
              </div>
              <textarea
                value={description}
                name='description'
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Add description'
              />
              <Image
                src={deleteSVG}
                alt='delete icon'
                className={styles['delete-icon']}
                onClick={() => handleDeleteTask(taskId)}
              />
            </div>
            <div className={styles['new-task-area']}>
              <Image src={addTaskSVG} alt='add task icon' />
              <input
                type='text'
                placeholder='Type to add a new task'
                onKeyUp={(e) => handleAddTask(e, e.target.value)}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
