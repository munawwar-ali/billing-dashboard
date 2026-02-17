// Save user data to localStorage
export const saveAuth = (token, user, tenant) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('tenant', JSON.stringify(tenant));
};

// Get user data from localStorage
export const getAuth = () => {
  if (typeof window === 'undefined') return { token: null, user: null, tenant: null };
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const tenant = localStorage.getItem('tenant');
  
  return {
    token,
    user: user ? JSON.parse(user) : null,
    tenant: tenant ? JSON.parse(tenant) : null,
  };
};

// Clear auth data (logout)
export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tenant');
};

// Check if user is logged in
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};