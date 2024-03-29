import { useEffect, useRef, useState } from 'react';
import styles from '../styles/new-task.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import labelSVG from '../../public/svg/label.svg';
import repeatSVG from '../../public/svg/repeat.svg';
import { ListLabels } from './ListLabels';
import { RecurringFrequency } from './RecurringFrequency';

export default function TaskForm(props) {
  const { initialValues, isAddTaskShow, toggleAddTask, isEdit } = props;

  const [isPrioritiesOpen, setIsPrioritiesOpen] = useState(false);
  const [isListLabelsOpen, setIsListLabelsOpen] = useState(false);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);

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

  const [labels, setLabels] = useState([]);
  const [labelId, setLabelId] = useState(initialValues.labelId || '');
  const [labelName, setLabelName] = useState(initialValues.labelName || null);

  const textareaRef = useRef();
  const newTaskRef = useRef();
  const newPriorityRef = useRef();
  const priorityTextRef = useRef();
  const prioritySVGRef = useRef();
  const listLabelsRef = useRef();
  const recurringRef = useRef();
  const recurringSVGRef = useRef();
  const newRecurringRef = useRef();

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    setDescription(textarea.value);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

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

    await fetch(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    toggleAddTask();
  };

  const handleEditTask = async (e) => {
    e.preventDefault();

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
      if (value == 'name') {
        if (initialValues['taskName'] != data[value]) {
          updates[value] = data[value];
        }
      } else if (initialValues.hasOwnProperty(value)) {
        if (value == 'reminderTime' || value == 'dueDate') {
          if (String(initialValues[value]) !== String(data[value])) {
            updates[value] = data[value];
          }
        } else {
          if (initialValues[value] !== data[value]) {
            updates[value] = data[value];
          }
        }
      }
    });

    await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/tasks/${initialValues.taskId}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        body: JSON.stringify(updates),
      }
    );

    toggleAddTask();
  };

  const getLabels = async () => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/labels`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );

    const result = await data.json();

    if (result.data.length < 1) {
      setLabels([]);
    }

    setLabels(result.data);
  };

  useEffect(() => {
    getLabels();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isAddTaskShow) {
        const newTask = newTaskRef.current;

        if (newTask && !newTask.contains(e.target)) {
          toggleAddTask();
        }
      }

      if (isListLabelsOpen) {
        const element = listLabelsRef.current;

        if (element && !element.contains(e.target)) {
          setIsListLabelsOpen(!isListLabelsOpen);
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

      if (isRecurringOpen) {
        const element = newRecurringRef.current;

        const notRecurringText = e.target == recurringRef.current;
        const notRecurringSVG = e.target == recurringSVGRef.current;

        if (
          element &&
          !element.contains(e.target) &&
          !notRecurringText &&
          !notRecurringSVG
        ) {
          setIsRecurringOpen(!isRecurringOpen);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [
    isAddTaskShow,
    toggleAddTask,
    isPrioritiesOpen,
    isListLabelsOpen,
    isRecurringOpen,
  ]);

  return (
    <div
      className={`${styles['new-task']} ${
        isAddTaskShow ? styles['show-new-task-view'] : ''
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

        <div
          className={styles['individual-prop']}
          onClick={() => setIsListLabelsOpen(!isListLabelsOpen)}
        >
          <Image src={labelSVG} alt='label icon' />
          <p>{labelName ? labelName : 'Label'}</p>
        </div>
        <div
          className={styles['individual-prop']}
          onClick={() => setIsRecurringOpen(!isRecurringOpen)}
          ref={newRecurringRef}
        >
          <Image src={repeatSVG} alt='repeat icon' ref={recurringSVGRef} />
          <p ref={recurringRef}>
            {recurringFrequency ? recurringFrequency : 'Frequency'}
          </p>
        </div>
      </div>
      <div
        className={`${styles['priorities']} ${
          isPrioritiesOpen ? styles['show-priorities'] : ''
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
      <div
        className={`${styles['labels-list']} ${
          isListLabelsOpen ? styles['labels-list-open'] : ''
        }`}
        ref={listLabelsRef}
      >
        {labels.length < 1 ? (
          <p>No labels</p>
        ) : (
          labels.map((label, index) => (
            <ListLabels
              name={label.name}
              color={label.color}
              key={index}
              Id={label.labelId}
              setLabelId={setLabelId}
              setLabelName={setLabelName}
            />
          ))
        )}
      </div>

      <div
        className={`${styles['recurring-frequency-list']} ${
          isRecurringOpen ? styles['recurring-frequency-list-open'] : ''
        }`}
        ref={newRecurringRef}
      >
        <RecurringFrequency setRecurringFrequency={setRecurringFrequency} />
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
