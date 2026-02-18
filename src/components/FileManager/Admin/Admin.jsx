import './Admin.css';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import fileSize from "../../CustomHooks/formatFileSize"
import moment from 'moment';
import 'moment/locale/ru';
import { generateUsersList, getAdminStats } from '../../../mocks/adminMockHelper';

function Admin() {
  const { user: currentUser, csrftoken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null); 

  {/*useEffect(() => {
    if (!currentUser?.is_superuser) {
      navigate('/panel');
    }
  }, [currentUser, navigate]);*/}

  const fetchMockAdminData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const usersList = generateUsersList(12); 
        setUsers(usersList);
        setStats(getAdminStats(usersList));
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  useEffect(() => {
    fetchMockAdminData();
  }, []);

  const userDelete = async (id) => {
    if (id === 1) {
      alert('Нельзя удалить главного администратора!');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      setStats(getAdminStats(updatedUsers));
      setIsLoading(false);
      alert(`Пользователь успешно удален`);
    }, 500);
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    if (userId === 1) {
      alert('Нельзя изменить статус главного администратора!');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            is_superuser: !currentStatus,
            is_staff: !currentStatus ? true : user.is_staff
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setStats(getAdminStats(updatedUsers));
      setIsLoading(false);
      alert(`Статус администратора для пользователя ${currentStatus ? 'удален' : 'назначен'}`);
    }, 500);
  };

  const userEdit = (id) => {
    navigate(`/panel/user/${id}`);
  };

  const createUser = () => {
    navigate('/panel/user/create');
  };

  const refreshData = () => {
    fetchMockAdminData();
  };

  const [filter, setFilter] = useState('all');

  const getFilteredUsers = () => {
    if (!users) return [];
    
    switch(filter) {
      case 'admins':
        return users.filter(u => u.is_superuser);
      case 'users':
        return users.filter(u => !u.is_superuser);
      case 'active':
        return users.filter(u => u.is_active);
      case 'inactive':
        return users.filter(u => !u.is_active);
      default:
        return users;
    }
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="admin">
      {isLoading && <div className="loading">Загрузка данных...</div>}
      <div className="admin-header">
        <h1>Административная панель</h1>
        <div className="admin-actions">
          <button onClick={createUser} className="btn btn-primary">
            <span className="btn-icon">➕</span> Создать пользователя
          </button>
          <button onClick={refreshData} className="btn btn-secondary">
            <span className="btn-icon">🔄</span> Обновить данные
          </button>
        </div>
      </div>

      {stats && (
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stats.total_users}</div>
              <div className="stat-label">Всего пользователей</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stats.total_admins}</div>
              <div className="stat-label">Администраторов</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stats.total_files}</div>
              <div className="stat-label">Всего файлов</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{fileSize(stats.total_storage)}</div>
              <div className="stat-label">Общий размер</div>
            </div>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <div className="filters-title">Фильтры:</div>
        <div className="filters-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все ({users?.length || 0})
          </button>
          <button 
            className={`filter-btn ${filter === 'admins' ? 'active' : ''}`}
            onClick={() => setFilter('admins')}
          >
            Администраторы ({users?.filter(u => u.is_superuser).length || 0})
          </button>
          <button 
            className={`filter-btn ${filter === 'users' ? 'active' : ''}`}
            onClick={() => setFilter('users')}
          >
            Пользователи ({users?.filter(u => !u.is_superuser).length || 0})
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Активные ({users?.filter(u => u.is_active).length || 0})
          </button>
          <button 
            className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            Неактивные ({users?.filter(u => !u.is_active).length || 0})
          </button>
        </div>
      </div>

      {users ? (
        filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-users">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Статус</th>
                  <th>Администратор</th>
                  <th>Хранилище</th>
                  <th>Дата регистрации</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={!user.is_active ? 'inactive-user' : ''}>
                    <td className="id-cell">#{user.id}</td>
                    
                    <td className="user-cell">
                      <div className="user-info">
                        <div className="user-name">
                          <strong>{user.first_name || user.last_name ? 
                            `${user.first_name || ''} ${user.last_name || ''}`.trim() : 
                            '—'}</strong>
                        </div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                    </td>
                    
                    <td className="contact-cell">
                      <div className="contact-info">
                        {user.email && <div className="user-email"> {user.email}</div>}
                      </div>
                    </td>
                    
                    <td className="status-cell">
                      <div className="status-badge" data-active={user.is_active}>
                        {user.is_active ? 'Активен' : 'Неактивен'}
                      </div>
                    </td>
                    
                    <td className="admin-cell">
                      {user.id === 1 ? (
                        <span className="admin-badge permanent" title="Главный администратор">
                          Главный админ
                        </span>
                      ) : (
                        <label className="admin-toggle">
                          <input 
                            type="checkbox" 
                            checked={user.is_superuser}
                            onChange={() => toggleAdminStatus(user.id, user.is_superuser)}
                            disabled={isLoading}
                          />
                          <span className="toggle-slider"></span>
                          <span className="toggle-label">
                            {user.is_superuser ? 'Админ' : 'Пользователь'}
                          </span>
                        </label>
                      )}
                    </td>
                    
                    <td className="storage-cell">
                      <div className="storage-info">
                        <div className="storage-stats">
                          <span className="storage-count">📄 {user.storage?.count_files || 0} файлов</span>
                          <span className="storage-size">💾 {fileSize(Number(user.storage?.total_files_size || 0))}</span>
                        </div>
                        {user.storage?.id && (
                          <button 
                            className="storage-link"
                            onClick={() => navigate(`/panel/storage/${user.storage.id}`)}
                            title="Управление файлами"
                          >
                            Управление
                          </button>
                        )}
                      </div>
                    </td>
                    
                    <td className="date-cell">
                      <div className="date-info">
                        <div>{moment(user.date_joined).format("DD.MM.YYYY")}</div>
                        <div className="date-time">{moment(user.date_joined).format("HH:mm")}</div>
                      </div>
                    </td>
                    
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-btn edit"
                          onClick={() => userEdit(user.id)}
                          title="Редактировать пользователя"
                        >
                          ✏️
                        </button>
                        
                        {user.id !== 1 && (
                          <button 
                            className="action-btn delete"
                            onClick={() => {
                              if (window.confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
                                userDelete(user.id);
                              }
                            }}
                            title="Удалить пользователя"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>Нет пользователей</h3>
            <p>По выбранному фильтру пользователи не найдены</p>
            <button onClick={() => setFilter('all')} className="btn btn-primary">
              Сбросить фильтр
            </button>
          </div>
        )
      ) : (
        !isLoading && <div className="no-data">Нет данных для отображения</div>
      )}
    </div>
  );
}

export default Admin;