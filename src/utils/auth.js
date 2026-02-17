// Save user data to localStorage
export const saveAuth = (token, user, tenant) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('tenant', JSON.stringify(tenant));
};

// Get user data from localStorage
export const getAuth = () => {
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
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tenant');
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};