import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    // Connect directly to backend port (avoiding fragile Vite WebSocket proxy)
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL ||
      `${window.location.protocol}//${window.location.hostname}:5000`;

    const socketInstance = io(backendUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      // console.log('[Socket] Connected:', socketInstance.id);
      if (user?._id) {
        socketInstance.emit('register_user', user._id);
      }
    });

    socketInstance.on('online_users_count', (count) => {
      setOnlineUsersCount(count);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsersCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

