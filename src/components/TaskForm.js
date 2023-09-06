import { useEffect, useRef, useState } from 'react';
import styles from '../styles/new-task.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function TaskForm(props) {
  const { initialValues, isAddTaskShow, toggleAddTask, isEdit } = props;

  const [isPrioritiesOpen, setIsPrioritiesOpen] = useState(false);

  const [taskName, setTaskName] = useState(initialValues.taskName || '');
  const [description, setDescription] = useState(
    initialValues.description || ''
  );
  const [priority, setPriority] = useState(initialValues.priority || null);
  const [dueDate, setDueDate] = useState(initialValues.dueDate || null);
  const [reminderTime, setReminderTime] = useState(
    initialValues.reminderTime || null
  );
  const [recurringFrequency, setRecurringFrequency] = useState(
    initialValues.recurringFrequency || null
  );

  const textareaRef = useRef();
  const newTaskRef = useRef();
  const newPriorityRef = useRef();
  const priorityTextRef = useRef();
  const prioritySVGRef = useRef();

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    setDescription(textarea.value);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    let reminderOn = false;
    let isRecurring = false;

    if (reminderTime != null) {
      reminderOn = true;
    }

    if (recurringFrequency != null) {
      isRecurring = true;
    }

    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const data = {
      name: taskName,
      description,
      priority,
      dueDate,
      labelId: '',
      reminderOn,
      reminderTime,
      isRecurring,
      recurringFrequency,
    };

    await fetch(`${process.env.LOCAL_PROD_URL}/tasks`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    toggleAddTask();
  };

  const handleEditTask = async (e) => {
    e.preventDefault();

    let reminderOn = false;
    let isRecurring = false;

    if (reminderTime != null) {
      reminderOn = true;
    }

    if (recurringFrequency != null) {
      isRecurring = true;
    }

    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const data = {
      name: taskName,
      description,
      priority,
      dueDate,
      labelId: '',
      reminderOn,
      reminderTime,
      isRecurring,
      recurringFrequency,
    };

    await fetch(`${process.env.LOCAL_PROD_URL}/api/tasks/${initialValues.taskId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    toggleAddTask();
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isAddTaskShow) {
        const newTask = newTaskRef.current;

        if (newTask && !newTask.contains(e.target)) {
          toggleAddTask();
        }
      }

      if (isPrioritiesOpen) {
        const newPriority = newPriorityRef.current;

        const notPriorityText = e.target == priorityTextRef.current;
        const notPrioritySVG = e.target == prioritySVGRef.current;

        if (
          newPriority &&
          !newPriority.contains(e.target) &&
          !notPriorityText &&
          !notPrioritySVG
        ) {
          setIsPrioritiesOpen(!isPrioritiesOpen);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isAddTaskShow, toggleAddTask, isPrioritiesOpen]);

  return (
    <div
      className={`${
        isAddTaskShow ? styles['new-task'] : styles['hide-new-task-view']
      }`}
      ref={newTaskRef}
    >
      <input
        onChange={(e) => setTaskName(e.target.value)}
        type='text'
        placeholder='Task name'
        value={taskName}
      />
      <textarea
        ref={textareaRef}
        value={description}
        onChange={handleTextareaChange}
        style={{ resize: 'none' }}
        placeholder='Task description'
      />
      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        placeholderText='Due Date'
        showTimeSelect
        dateFormat='MMMM d, yyyy h:mm aa'
        className={styles['date-picker']}
        value={dueDate}
      />
      <DatePicker
        selected={reminderTime}
        onChange={(date) => setReminderTime(date)}
        placeholderText='Reminder'
        showTimeSelect
        dateFormat='MMMM d, yyyy h:mm aa'
        className={styles['date-picker']}
        value={reminderTime}
      />
      <div className={styles['new-task-props']}>
        <div
          className={styles['individual-prop']}
          onClick={() => setIsPrioritiesOpen(!isPrioritiesOpen)}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            viewBox='0 -960 960 960'
            width='24'
            ref={prioritySVGRef}
          >
            <path d='M240-140v-620h287.693l16 80H760v320H552.307l-16-80H280v300h-40Zm260-420Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z' />
          </svg>
          <p ref={priorityTextRef}>
            {priority != null ? priority : 'Priority'}
          </p>
        </div>

        <div className={styles['individual-prop']}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            viewBox='0 -960 960 960'
            width='24'
          >
            <path d='M542.308-131.692q-11.529 11.461-28.573 11.461-17.043 0-28.504-11.461l-352-352q-6.385-6.385-9.808-14.02T120-514v-286q0-16.077 11.961-28.039Q143.923-840 160-840h286q7.769 0 15.452 3.166 7.683 3.167 13.317 8.526l352 352.231Q839-463.846 839.385-446.5q.384 17.346-11.077 28.808l-286 286ZM513.425-160l286.344-286-353.425-354H160v286l353.425 354ZM259.91-660q16.629 0 28.359-11.64Q300-683.281 300-699.909q0-16.63-11.64-28.36Q276.72-740 260.09-740q-16.629 0-28.359 11.64Q220-716.719 220-700.091q0 16.63 11.64 28.36Q243.28-660 259.91-660ZM160-800Z' />
          </svg>
          <p>Label</p>
        </div>
      </div>
      <div
        className={`${
          isPrioritiesOpen ? styles['priorities'] : styles['hide-priorities']
        }`}
        ref={newPriorityRef}
      >
        <a className={styles.priority}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            viewBox='0 -960 960 960'
            width='24'
            fill='red'
          >
            <path d='M240-140v-620h287.693l16 80H760v320H552.307l-16-80H280v300h-40Zm260-420Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z' />
          </svg>
          <p onClick={(e) => setPriority(e.target.textContent)}>High</p>
        </a>
        <a className={styles.priority}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            viewBox='0 -960 960 960'
            width='24'
            fill='yellow'
          >
            <path d='M240-140v-620h287.693l16 80H760v320H552.307l-16-80H280v300h-40Zm260-420Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z' />
          </svg>
          <p onClick={(e) => setPriority(e.target.textContent)}>Medium</p>
        </a>
        <a className={styles.priority}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24'
            viewBox='0 -960 960 960'
            width='24'
            fill='blue'
          >
            <path d='M240-140v-620h287.693l16 80H760v320H552.307l-16-80H280v300h-40Zm260-420Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z' />
          </svg>
          <p onClick={(e) => setPriority(e.target.textContent)}>Low</p>
        </a>
      </div>
      <div className={styles['new-task-footer']}>
        <button onClick={props.toggleAddTask}>Cancel</button>
        <button
          disabled={taskName == '' ? true : false}
          onClick={isEdit ? handleEditTask : handleAddTask}
        >
          {isEdit ? 'Edit Task' : 'Add Task'}
        </button>
      </div>
    </div>
  );
}
