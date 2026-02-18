export const mockUser = (id) => ({
  id: Number(id),
  username: `user_${id}`,
  first_name: 'Татьяна',
  last_name: 'Иванова',
  email: `user${id}@example.com`,
  is_superuser: false,
  is_staff: false,
  is_active: true,
  last_login: null,
  date_joined: new Date().toISOString(),
  storage: {
    id: Number(id),  
    count_files: 15,
    total_files_size: 5242880,
    last_update: new Date().toISOString()
  },

  groups: ['users'],
  user_permissions: ['view_files', 'upload_files']
});


export const mockAdmin = (id) => ({
  id: Number(id),
  username: `admin_${id}`,
  first_name: 'Админ',
  last_name: 'Админ',
  email: `admin${id}@example.com`,
  is_superuser: true,
  is_staff: true,
  is_active: true,
  last_login: new Date().toISOString(),
  date_joined: new Date().toISOString(),
  storage: {
    id: Number(id),
    count_files: 127,
    total_files_size: 15728640, 
    last_update: new Date().toISOString()
  },
  groups: ['admins', 'users'],
  user_permissions: ['all']
});

export default {
  mockUser,
  mockAdmin
};