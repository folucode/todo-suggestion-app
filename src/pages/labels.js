import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import mainStyles from '@/styles/Home.module.css';
import labelStyles from '@/styles/labels.module.css';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import editSVG from '../../public/svg/edit.svg';
import deleteSVG from '../../public/svg/delete.svg';
import addSVG from '../../public/svg/add.svg';
import { io } from 'socket.io-client';
import TaskForm from '@/components/TaskForm';

export default function Labels() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddTaskShow, setIsAddTaskShow] = useState(false);
  const [isAddLabelShow, setIsAddLabelShow] = useState(false);
  const [isAddLabelColorShow, setIsAddLabelColorShow] = useState(false);
  const [labels, setLabels] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [labelId, setLabelId] = useState('');

  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState('');
  const [labelColorName, setLabelColorName] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAddTask = () => setIsAddTaskShow(!isAddTaskShow);

  const addLabelClassName = `${labelStyles['add-label-container']} ${
    isAddLabelShow ? labelStyles['show-add-label-container'] : ''
  }`;

  const labelColors = [
    { color: '#8B4513', name: 'Saddle Brown' },
    { color: '#A0522D', name: 'Sienna' },
    { color: '#006400', name: 'Dark Green' },
    { color: '#8B4513', name: 'Brown' },
    { color: '#D2691E', name: 'Chocolate' },
    { color: '#8B0000', name: 'Dark Red' },
    { color: '#483D8B', name: 'Dark Slate Blue' },
    { color: '#556B2F', name: 'Dark Olive Green' },
    { color: '#8B008B', name: 'Dark Magenta' },
    { color: '#B22222', name: 'Fire Brick' },
    { color: '#4B0082', name: 'Indigo' },
    { color: '#ff7f50', name: 'Coral' },
    { color: '#800000', name: 'Maroon' },
    { color: '#9932CC', name: 'Dark Orchid' },
    { color: '#8B008B', name: 'Dark Violet' },
    { color: '#800080', name: 'Purple' },
    { color: '#1E90FF', name: 'Dodger Blue' },
    { color: '#2E8B57', name: 'Sea Green' },
    { color: '#2F4F4F', name: 'Dark Slate Gray' },
  ];

  const addLabelRef = useRef();
  const addLabelColorShowRef = useRef();

  useEffect(() => {
    if (localStorage.getItem('tasuke-user') == null) {
      Router.push('/auth/login');
    }

    setLabelColor(labelColors[0].color);
    setLabelColorName(labelColors[0].name);

    const socket = io(process.env.NEXT_PUBLIC_PROD_API_URL);

    socket.on('connect', function () {
      console.log('socket.io connected...');
      getLabels();
    });

    socket.on('createLabel', function (data) {
      if (data.status == 'success') {
        getLabels();
      } else {
        console.log(data);
      }
    });

    socket.on('deleteLabel', function (data) {
      if (data.status == 'success') {
        getLabels();
      } else {
        console.log(data);
      }
    });

    socket.on('editLabel', function (data) {
      if (data.status == 'success') {
        getLabels();
      } else {
        console.log(data);
      }
    });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isAddLabelShow) {
        const element = addLabelRef.current;

        if (element && !element.contains(e.target)) {
          setIsAddLabelShow(!isAddLabelShow);
        }
      }

      if (isAddLabelColorShow) {
        const element = addLabelColorShowRef.current;

        if (element && !element.contains(e.target)) {
          setIsAddLabelColorShow(!isAddLabelColorShow);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isAddLabelColorShow, isAddLabelShow]);

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

    const labels = await data.json();

    if (labels.length < 1) {
      setLabels([]);
    }

    setLabels(labels.data);
  };

  const handleAddLabel = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const body = {
      name: labelName,
      color: labelColor,
    };

    await fetch(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/labels`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    setIsAddLabelShow(!isAddLabelShow);
    setLabelName('');
    setLabelColor('');

    return;
  };

  const handleDeleteLabel = async (e, labelId) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/labels/${labelId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
      }
    );
  };

  const toggleEditLabel = async (e, labelName, labelColor, labelId) => {
    e.preventDefault();

    const label = labelColors.find((label) => label.color == labelColor);
    console.log(label);

    setLabelColor(label.color);
    setLabelColorName(label.name);
    setLabelName(labelName);

    setLabelId(labelId);
    setIsEdit(true);
    setIsAddLabelShow(true);
  };

  const handleEditLabel = async (e, labelId) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const body = {
      name: labelName,
      color: labelColor,
    };

    await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/labels/${labelId}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
        },
        body: JSON.stringify(body),
      }
    );

    setIsAddLabelShow(false);
  };

  return (
    <>
      <Head>
        <title>Tasuke</title>
        <meta name='description' content='Task management application' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='' />
      </Head>

      <div className={mainStyles.page}>
        <Navbar toggleSidebar={toggleSidebar} toggleAddTask={toggleAddTask} />

        <main className={mainStyles.main}>
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <div
            className={mainStyles['main-area']}
            style={{ marginLeft: isSidebarOpen ? '300px' : '0' }}
          >
            <h1 style={{ marginLeft: '30px' }}>Labels</h1>
            <div className={labelStyles['label-area']}>
              <div className={labelStyles.header}>
                <p>labels</p>
                <Image
                  src={addSVG}
                  onClick={() => setIsAddLabelShow(!isAddLabelShow)}
                  alt='add icon'
                />
              </div>

              {labels.length < 1 ? (
                <p style={{ width: '500px', textAlign: 'center' }}>No labels</p>
              ) : (
                labels.map((label, index) => (
                  <div className={labelStyles['individual-label']} key={index}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      height='24'
                      viewBox='0 -960 960 960'
                      width='24'
                      fill={label.color}
                    >
                      <path d='M542.308-131.692q-11.529 11.461-28.573 11.461-17.043 0-28.504-11.461l-352-352q-6.385-6.385-9.808-14.02T120-514v-286q0-16.077 11.961-28.039Q143.923-840 160-840h286q7.769 0 15.452 3.166 7.683 3.167 13.317 8.526l352 352.231Q839-463.846 839.385-446.5q.384 17.346-11.077 28.808l-286 286ZM513.425-160l286.344-286-353.425-354H160v286l353.425 354ZM259.91-660q16.629 0 28.359-11.64Q300-683.281 300-699.909q0-16.63-11.64-28.36Q276.72-740 260.09-740q-16.629 0-28.359 11.64Q220-716.719 220-700.091q0 16.63 11.64 28.36Q243.28-660 259.91-660ZM160-800Z' />
                    </svg>

                    <p>{label.name}</p>
                    <Image
                      src={editSVG}
                      alt='edit icon'
                      style={{ marginLeft: 'auto' }}
                      onClick={(e) =>
                        toggleEditLabel(
                          e,
                          label.name,
                          label.color,
                          label.labelId
                        )
                      }
                    />
                    <Image
                      src={deleteSVG}
                      alt='delete icon'
                      onClick={(e) => handleDeleteLabel(e, label.labelId)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        <div className={addLabelClassName} ref={addLabelRef}>
          <div className={labelStyles['add-label-header']}>
            <p>Add label</p>
          </div>
          <div className={labelStyles['add-label-input-area']}>
            <div className={labelStyles['add-label-input']}>
              <label htmlFor='name'>Label name:</label>
              <input
                type='text'
                className={labelStyles['input-name']}
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
              />
            </div>
            <div className={labelStyles['add-label-input']}>
              <label htmlFor='name'>Label color:</label>
              <div
                className={labelStyles['input-color']}
                onClick={() => setIsAddLabelColorShow(!isAddLabelColorShow)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='24'
                  viewBox='0 -960 960 960'
                  width='24'
                  fill={labelColor}
                >
                  <path d='M480.147-240q-100.224 0-170.186-69.814Q240-379.628 240-479.853q0-100.224 69.814-170.186Q379.628-720 479.853-720q100.224 0 170.186 69.814Q720-580.372 720-480.147q0 100.224-69.814 170.186Q580.372-240 480.147-240Z' />
                </svg>
                <p>{labelColorName}</p>
              </div>
            </div>
          </div>
          <div className={labelStyles['add-label-footer']}>
            <button onClick={() => setIsAddLabelShow(!isAddLabelShow)}>
              Cancel
            </button>
            <button
              onClick={
                isEdit ? (e) => handleEditLabel(e, labelId) : handleAddLabel
              }
            >
              {isEdit ? 'Edit' : 'Add'}
            </button>
          </div>
          <div
            className={`${labelStyles['label-color-list']} ${
              isAddLabelColorShow ? labelStyles['show-label-color-list'] : ''
            }`}
            ref={addLabelColorShowRef}
          >
            {labelColors.map((labelColor, index) => (
              <div
                className={labelStyles['individual-label-color']}
                onClick={() => {
                  setLabelColor(labelColor.color);
                  setLabelColorName(labelColor.name);
                  setIsAddLabelColorShow(false);
                }}
                key={index}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='24'
                  viewBox='0 -960 960 960'
                  width='24'
                  fill={labelColor.color}
                >
                  <path d='M480.147-240q-100.224 0-170.186-69.814Q240-379.628 240-479.853q0-100.224 69.814-170.186Q379.628-720 479.853-720q100.224 0 170.186 69.814Q720-580.372 720-480.147q0 100.224-69.814 170.186Q580.372-240 480.147-240Z' />
                </svg>
                <p>{labelColor.name}</p>
              </div>
            ))}
          </div>
        </div>

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
