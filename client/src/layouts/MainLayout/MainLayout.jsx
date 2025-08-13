import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  return (
        <main className={styles.mainContent}>
          <Outlet />
        </main>
  );
};

export default MainLayout;
