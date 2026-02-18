import { mockUser, mockAdmin } from './userMock';

export const generateUsersList = (count = 10) => {
  const users = [];
  
  users.push({
    ...mockAdmin(1),
    username: 'admin',
    first_name: 'Главный',
    last_name: 'Администратор',
    email: 'admin@system.local',
    date_joined: '2024-01-01T10:00:00Z'
  });
  
  const userData = [
    {
      id: 2,
      username: 'ivan.petrov',
      first_name: 'Иван',
      last_name: 'Петров',
      email: 'ivan.petrov@example.com',
      is_active: true,
      storage: {
        count_files: 15,
        total_files_size: 45 * 1024 * 1024 
      }
    },
    {
      id: 3,
      username: 'elena.sidorova',
      first_name: 'Елена',
      last_name: 'Сидорова',
      email: 'elena.sidorova@example.com',
      is_active: true,
      is_staff: true,
      storage: {
        count_files: 28,
        total_files_size: 128 * 1024 * 1024 
      }
    },
    {
      id: 4,
      username: 'alexey.kozlov',
      first_name: 'Алексей',
      last_name: 'Козлов',
      email: 'alexey.kozlov@example.com',
      is_active: false,
      storage: {
        count_files: 3,
        total_files_size: 5 * 1024 * 1024 
      }
    },
    {
      id: 5,
      username: 'maria.volkova',
      first_name: 'Мария',
      last_name: 'Волкова',
      email: 'maria.volkova@example.com',
      is_active: true,
      is_superuser: true,
      storage: {
        count_files: 42,
        total_files_size: 256 * 1024 * 1024 
      }
    },
    {
      id: 6,
      username: 'dmitry.novikov',
      first_name: 'Дмитрий',
      last_name: 'Новиков',
      email: 'dmitry.novikov@example.com',
      is_active: true,
      storage: {
        count_files: 7,
        total_files_size: 15 * 1024 * 1024 
      }
    },
    {
      id: 7,
      username: 'olga.morozova',
      first_name: 'Ольга',
      last_name: 'Морозова',
      email: 'olga.morozova@example.com',
      is_active: true,
      storage: {
        count_files: 19,
        total_files_size: 89 * 1024 * 1024 
      }
    },
    {
      id: 8,
      username: 'sergey.volkov',
      first_name: 'Сергей',
      last_name: 'Волков',
      email: 'sergey.volkov@example.com',
      is_active: false,
      storage: {
        count_files: 0,
        total_files_size: 0
      }
    },
    {
      id: 9,
      username: 'anna.smirnova',
      first_name: 'Анна',
      last_name: 'Смирнова',
      email: 'anna.smirnova@example.com',
      is_active: true,
      is_staff: true,
      storage: {
        count_files: 31,
        total_files_size: 192 * 1024 * 1024 
      }
    },
    {
      id: 10,
      username: 'pavel.ivanov',
      first_name: 'Павел',
      last_name: 'Иванов',
      email: 'pavel.ivanov@example.com',
      is_active: true,
      storage: {
        count_files: 12,
        total_files_size: 34 * 1024 * 1024 
      }
    }
  ];
  
  userData.forEach(data => {
    const baseUser = mockUser(data.id);
    users.push({
      ...baseUser,
      ...data,
      storage: {
        id: data.id,
        last_update: new Date().toISOString(),
        ...data.storage
      }
    });
  });
  
  return users;
};

export const getAdminStats = (users) => {
  return {
    total_users: users.length,
    total_admins: users.filter(u => u.is_superuser).length,
    total_staff: users.filter(u => u.is_staff).length,
    total_active: users.filter(u => u.is_active).length,
    total_inactive: users.filter(u => !u.is_active).length,
    total_files: users.reduce((sum, user) => sum + (user.storage?.count_files || 0), 0),
    total_storage: users.reduce((sum, user) => sum + (user.storage?.total_files_size || 0), 0),
    average_files_per_user: Math.round(
      users.reduce((sum, user) => sum + (user.storage?.count_files || 0), 0) / users.length
    )
  };
};

export const searchUsers = (users, query) => {
  if (!query) return users;
  
  const searchTerm = query.toLowerCase();
  return users.filter(user => 
    user.username.toLowerCase().includes(searchTerm) ||
    user.first_name?.toLowerCase().includes(searchTerm) ||
    user.last_name?.toLowerCase().includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm)
  );
};

export const updateAdminStatus = (users, userId, isAdmin) => {
  return users.map(user => {
    if (user.id === userId) {
      return {
        ...user,
        is_superuser: isAdmin,
        is_staff: isAdmin ? true : user.is_staff
      };
    }
    return user;
  });
};