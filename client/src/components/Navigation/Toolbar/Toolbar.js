import React from 'react';
import { Navbar } from 'react-bootstrap';
import NavigationItems from '../NavigationItems/NavigationItems';
import Sidebar from '../Sidebar/Sidebar';

const Toolbar = () => {
  return (
    <Navbar variant="dark" bg="dark" fixed="top" style={{ padding: '0 16px' }}>
      <Sidebar />
      <Navbar.Brand className="ml-3" href="/posts">
        <img
          alt="logo"
          src="https://res.cloudinary.com/grapecluster/image/upload/v1621597330/justAskItLogo.png"
          style={{ width: '5.25rem' }}
        />
      </Navbar.Brand>
      <NavigationItems />
    </Navbar>
  );
};

export default Toolbar;
