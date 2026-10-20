import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../services/api';

const AuthContext = createContext();

export const SYSTEM_USERS = {
  ADMIN: {
    uid: 'USR-001',
    name: 'Amol Sawant (Boss)',
    email: 'admin@rawbot.io',
    password: 'admin123',
    role: 'ADMIN',
    title: 'System Administrator (Full Access)',
    token: 'TOKEN_ADMIN_AUTHENTICATED'
  },
  MANAGER: {
    uid: 'USR-002',
    name: 'Sarah Jenkins',
    email: 'manager@rawbot.io',
    password: 'manager123',
    role: 'MANAGER',
    title: 'Operations Manager (Reports & Monitoring)',
    token: 'TOKEN_MANAGER_AUTHENTICATED'
  },
  STAFF: {
    uid: 'USR-003',
    name: 'Vikram Patel',
    email: 'staff@rawbot.io',
    password: 'staff123',
    role: 'STAFF',
    title: 'Warehouse Staff (Robot Operator)',
    token: 'TOKEN_STAFF_AUTHENTICATED'
  }
};

export const DEMO_USERS = SYSTEM_USERS;

const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-001',
    user: 'admin@rawbot.io',
    name: 'Amol Sawant',
    role: 'ADMIN',
    action: 'LOGIN',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    result: 'SUCCESS'
  },
  {
    id: 'LOG-002',
    user: 'manager@rawbot.io',
    name: 'Sarah Jenkins',
    role: 'MANAGER',
    action: 'LOGIN',
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    result: 'SUCCESS'
  },
  {
    id: 'LOG-003',
    user: 'staff@rawbot.io',
    name: 'Vikram Patel',
    role: 'STAFF',
    action: 'LOGIN',
    timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    result: 'SUCCESS'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('raw_bot_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return DEMO_USERS.ADMIN;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('raw_bot_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_AUDIT_LOGS;
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('raw_bot_user', JSON.stringify(user));
      const token = user.role === 'ADMIN'
        ? 'DEMO_ADMIN_TOKEN'
        : user.role === 'MANAGER'
        ? 'DEMO_MANAGER_TOKEN'
        : 'DEMO_STAFF_TOKEN';
      localStorage.setItem('raw_bot_token', token);
    } else {
      localStorage.removeItem('raw_bot_user');
      localStorage.removeItem('raw_bot_token');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('raw_bot_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action, targetUser = user, result = 'SUCCESS') => {
    const newEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: targetUser?.email || 'guest@rawbot.io',
      name: targetUser?.name || 'Unknown User',
      role: targetUser?.role || 'STAFF',
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      result
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    try {
      const res = await userApi.login({ email: cleanEmail, password: cleanPass });
      if (res.data && res.data.success) {
        const loggedUser = res.data.user;
        setUser(loggedUser);
        localStorage.setItem('raw_bot_token', res.data.token);
        localStorage.setItem('raw_bot_user', JSON.stringify(loggedUser));
        addAuditLog('LOGIN', loggedUser, 'SUCCESS');
        return { success: true, user: loggedUser };
      }
    } catch (err) {
      console.warn('Backend API login error/fallback:', err.message);
    }

    // Direct credential validation for Admin/Boss, Manager, and Staff
    let matchedUser = null;

    if (cleanEmail === 'admin@rawbot.io' || cleanEmail === 'boss@rawbot.io') {
      if (cleanPass === 'admin123' || cleanPass === 'Admin@123' || cleanPass === 'password123') {
        matchedUser = SYSTEM_USERS.ADMIN;
      }
    } else if (cleanEmail === 'manager@rawbot.io') {
      if (cleanPass === 'manager123' || cleanPass === 'Manager@123' || cleanPass === 'password123') {
        matchedUser = SYSTEM_USERS.MANAGER;
      }
    } else if (cleanEmail === 'staff@rawbot.io' || cleanEmail === 'operator@rawbot.io') {
      if (cleanPass === 'staff123' || cleanPass === 'Staff@123' || cleanPass === 'password123') {
        matchedUser = SYSTEM_USERS.STAFF;
      }
    }

    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem('raw_bot_token', matchedUser.token);
      localStorage.setItem('raw_bot_user', JSON.stringify(matchedUser));
      addAuditLog('LOGIN', matchedUser, 'SUCCESS');
      setLoading(false);
      return { success: true, user: matchedUser };
    }

    addAuditLog('LOGIN_FAILED', { email: cleanEmail, name: 'Failed Attempt', role: 'UNKNOWN' }, 'FAILED');
    setLoading(false);
    return { success: false, message: 'Invalid email or password. Please verify credentials.' };
  };

  const loginAsDemo = (role = 'ADMIN') => {
    const demo = DEMO_USERS[role] || DEMO_USERS.ADMIN;
    setUser(demo);
    localStorage.setItem('raw_bot_user', JSON.stringify(demo));
    localStorage.setItem('raw_bot_token', demo.token);
    addAuditLog('LOGIN (QUICK_SWITCH)', demo, 'SUCCESS');
    return demo;
  };

  const logout = () => {
    if (user) {
      addAuditLog('LOGOUT', user, 'SUCCESS');
    }
    setUser(null);
    localStorage.removeItem('raw_bot_user');
    localStorage.removeItem('raw_bot_token');
  };

  const switchRole = (newRole) => {
    loginAsDemo(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'STAFF',
        isAdmin: user?.role === 'ADMIN',
        isManager: user?.role === 'MANAGER',
        isStaff: user?.role === 'STAFF',
        isAuthenticated: Boolean(user),
        auditLogs,
        addAuditLog,
        loading,
        login,
        loginAsDemo,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
