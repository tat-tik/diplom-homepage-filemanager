import './User.css';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams } from 'react-router';
import { useNavigate } from "react-router";
import FieldInput from "../FieldInputEditor/FieldInputEditor"
import fileSize from "../../CustomHooks/formatFileSize"
import moment from 'moment';
import 'moment/locale/ru';
import { mockUser, mockAdmin } from '../../../mocks/userMock';

function User() {
  const { isAdmin, user_id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [statusField, setStatusField] = useState({status_edit: false, field_edit: ''});
  const [statusBooleanField, setStatusBooleanField] = useState({is_superuser: '', is_staff: '', is_active: ''});
  const { id_user } = useParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (id_user && user_id && !isAdmin && user_id !== Number(id_user)) {
      navigate(`/panel/user/${user_id}`);
    }
  }, [id_user, user_id, isAdmin, navigate]); 

  useEffect(() => {
   if (!id_user) {
    return;
    }
  
    if (isDataLoaded) {
      return;
    }
  
    if (isLoading) {
      return;
    }
  
    setIsLoading(true);
    let isMounted = true;
    const timer = setTimeout(() => {
      if (!isMounted) {
        return;
      }
    
      try {
        const userData = isAdmin ? mockAdmin(id_user) : mockUser(id_user);
           
        if (userData && isMounted) {
          setUser(userData);
          setIsDataLoaded(true);
        }
      } catch (error) {
      console.error('❌ Ошибка при создании мок-данных:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }, 300);
  
    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [id_user, isAdmin]); 
 
  useEffect(() => {
    if (user) {
      setStatusBooleanField({
        is_superuser: user.is_superuser ? '✓' : '-',
        is_staff: user.is_staff ? '✓' : '-',
        is_active: user.is_active ? '✓' : '-',
      });
    }
  }, [user]);

  const changeBool = (e) => {
    if (user?.id !== 1 && isAdmin) {
      const name = e.target.getAttribute('name');
      setUser({...user, [name]: !user[name]});
    }
  };

  const changeField = (e) => {
    const field_edit = e.target.getAttribute('name');
    if (field_edit !== 'email' || isAdmin) {
      setStatusField({...statusField, status_edit: true, field_edit});
    }
  };

  const saveUser = async () => {
    alert('Данные сохранены (мок-режим)');
  };

  if (!id_user) {
    return <div className="user">Загрузка...</div>;
  }

  if (!user || isLoading) {
    return <div className="user">Загрузка пользователя...</div>;
  }

  return (
    <div className="user">
      <table className="table table-user">
        <tbody>
          <tr><th>id</th><td>{user.id}</td></tr>
          <tr><th>Логин</th><td>{user.username}</td></tr>
          <tr>
            <th>Имя</th>
            <td className='td-pointer' name="first_name" onClick={changeField}>
              {statusField.field_edit === "first_name" && statusField.status_edit 
                ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} />
                : user.first_name}
            </td>
          </tr>
          <tr>
            <th>Фамилия</th>
            <td className='td-pointer' name="last_name" onClick={changeField}>
              {statusField.field_edit === "last_name" && statusField.status_edit 
                ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} />
                : user.last_name}
            </td>
          </tr>
          <tr>
            <th>E-mail</th>
            <td className={isAdmin ? 'td-pointer' : ''} name="email" onClick={changeField}>
              {statusField.field_edit === "email" && statusField.status_edit 
                ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} />
                : user.email}
            </td>
          </tr>
          <tr>
            <th>Пароль</th>
            <td className='td-pointer' name="password" onClick={changeField}>
              {statusField.field_edit === "password" && statusField.status_edit 
                ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} />
                : 'Изменить'}
            </td>
          </tr>
          <tr>
            <th>Администратор</th>
            <td className={isAdmin && id_user !== '1' ? 'td-pointer' : ''} name="is_superuser" onClick={changeBool}>
              {statusBooleanField.is_superuser}
            </td>
          </tr>
          <tr>
            <th>Активный</th>
            <td className={isAdmin && id_user !== '1' ? 'td-pointer' : ''} name="is_active" onClick={changeBool}>
              {statusBooleanField.is_active}
            </td>
          </tr>
          <tr>
            <th>Последний вход</th>
            <td>
              {user.last_login 
                ? moment(user.last_login).format("YYYY-MM-DD HH:mm:ss") 
                : 'никогда'}
            </td>
          </tr>
          <tr>
            <th>Добавлен</th>
            <td>{moment(user.date_joined).format("YYYY-MM-DD HH:mm:ss")}</td>
          </tr>
          <tr>
            <th>Количество файлов</th>
            <td>{user.storage?.count_files || 0}</td>
          </tr>
          <tr>
            <th>Общий размер файлов</th>
            <td>{fileSize(Number(user.storage?.total_files_size || 0))}</td>
          </tr>
          <tr>
            <th>Дата обновления хранилища</th>
            <td>
              {user.storage?.last_update 
                ? moment(user.storage.last_update).format("YYYY-MM-DD HH:mm:ss") 
                : 'нет данных'}
            </td>
          </tr>
          <tr>
            <th>Ссылка на хранилище</th>
           <td>
  {user.storage?.id 
    ? <span className="span-pointer" onClick={() => {
        navigate(`/panel/storage/${user.storage.id}`);
      }}>
        Перейти в хранилище
      </span>
    : 'нет хранилища'}
</td>
          </tr>
        </tbody>
      </table>
      <div className="user-save">
        <input type='button' className="user-btn-save" value="Сохранить" onClick={saveUser} />
      </div>
    </div>
  );
}

export default User;