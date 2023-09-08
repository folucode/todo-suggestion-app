import { HeadComponent } from '@/components/Head';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import mainStyles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';

export default function TaskHistory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddTaskShow, setIsAddTaskShow] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAddTask = () => setIsAddTaskShow(!isAddTaskShow);

  useEffect(() => {
    getTaskHistory();
  }, []);

  const getTaskHistory = async () => {
    const user = JSON.parse(localStorage.getItem('tasuke-user'));

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/tasks/history`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    const result = await data.json();

    setHistoryData(result.data);
  };

  return (
    <>
      <div>
        <HeadComponent />

        <div className={mainStyles.page}>
          <Navbar toggleSidebar={toggleSidebar} toggleAddTask={toggleAddTask} />

          <main className={mainStyles.main}>
            <Sidebar isSidebarOpen={isSidebarOpen} />
            <div
              className={mainStyles['main-area']}
              style={{ marginLeft: isSidebarOpen ? '300px' : '0' }}
            >
              <h1 style={{ marginLeft: '30px', color: 'black' }}>
                Task History
              </h1>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
