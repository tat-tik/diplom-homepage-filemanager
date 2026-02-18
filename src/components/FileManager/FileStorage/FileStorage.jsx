import './FileStorage.css';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
{/*import useDownloadFile from "../../CustomHooks/useDownloadFile"*/}
import fileSize from "../../CustomHooks/formatFileSize";
import FilesUpload from "./FilesUpload/FilesUpload";
import FieldInputEditor from "../FieldInputEditor/FieldInputEditor";
import moment from 'moment';
import 'moment/locale/ru';
import { mockStorage, mockEmptyStorage } from '../../../mocks/storageMock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faEarth } from '@fortawesome/free-solid-svg-icons';
library.add(faDownload, faEarth);

function FileStorage() {
  const { isAdmin, storage_id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { storage } = useParams();
  const [statusField, setStatusField] = useState({status_edit: false, field_edit: ''});
  const [files, setFiles] = useState(null);
  const [user, setUser] = useState(null);

  {/* const { downloadFile } = useDownloadFile();*/}
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (storage && storage_id && !isAdmin && storage_id !== Number(storage)) {
      navigate(`/panel/storage/${storage_id}`);
    }
  }, [storage, storage_id, isAdmin, navigate]);

  useEffect(() => {
    if (!storage) return;
    const savedFiles = localStorage.getItem(`storage_${storage}_files`);
  }, [storage]);
  
  useEffect(() => {
    if (files && user && storage) {
      localStorage.setItem(`storage_${storage}_files`, JSON.stringify(files));
    }
  }, [files, user, storage]);
  
  useEffect(() => {
    if (!storage) {
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
    if (!isMounted) 
      return;
    try {
      const storageData = Number(storage) === 11 
      ? mockStorage(storage) 
      : mockEmptyStorage(storage);
      setFiles(storageData.files);
      setUser(storageData.user);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
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
  }, [storage, isDataLoaded]); 

  const fileEdit = (file_id) => {
    navigate(`/panel/storage/${storage}/${file_id}`);
  };

  const fileDownload = async (file_id) => {
    alert(`Скачивание файла ${file_id} (мок-режим)`);
  };

  const fileDelete = async (file_id) => {
    setFiles(files.filter(f => f.id !== file_id));
    alert(`Файл ${file_id} удалён (мок-режим)`);
  };

  const changeField = (e) => {
    const fieldName = e.currentTarget.getAttribute('name');
    setStatusField({status_edit: true, field_edit: fieldName});
  };

  const updateFile = (updatedFile) => {
    setFiles(prevFiles => 
      prevFiles.map(f => f.id === updatedFile.id ? updatedFile : f)
    );
  };

  if (!storage) {
    return 
    <div className="storage"> Загрузка...</div>;
  }

  if (!files) {
    return 
    <div className="storage"> Загрузка хранилища...</div>;
  }
  
  return (
    <div className='storage'>
      <div className={`storage-title${storage_id === Number(storage) ? '' : ' other'}`}>
        {storage_id === Number(storage) 
          ? 'Моё хранилище' 
          : user 
            ? `Хранилище пользователя ${user.username} (ID: ${user.id})` 
            : 'Хранилище'}
      </div>
      
      {files.length > 0 ? (
        <table className="table table-files">
          <thead>
            <tr>
              <th>№</th>
              <th>Имя файла</th>
              <th>Размер</th>
              <th>Комментарий</th>
              <th>Дата загрузки</th>
              <th>Дата последнего скачивания</th>
              <th>Ссылка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, i) => (
              <tr key={file.id || i}>
                <td>{i+1}</td>
                
                <td 
                  className="td-pointer" 
                  name={`file_name_${file.id}`}
                  onClick={changeField}
                >
                  {statusField.status_edit && statusField.field_edit === `file_name_${file.id}` ? (
                    <FieldInputEditor 
                      statusField={statusField}
                      setStatusField={setStatusField}
                      object={file}
                      setObject={updateFile}
                    />
                  ) : (
                    decodeURIComponent(file.file_name)
                  )}
                </td>
                
                <td>{fileSize(Number(file.size))}</td>
                               
                <td 
                  className="td-pointer" 
                  name={`comment_${file.id}`}
                  onClick={changeField}
                >
                  {statusField.status_edit && statusField.field_edit === `comment_${file.id}` ? (
                    <FieldInputEditor 
                      statusField={statusField}
                      setStatusField={setStatusField}
                      object={file}
                      setObject={updateFile}
                    />
                  ) : (
                    file.comment || '-'
                  )}
                </td>
                
                <td>{moment(file.date_load).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>
                  {file.date_download === null 
                  ? '-' 
                  : moment(file.date_download).format("YYYY-MM-DD HH:mm:ss")
                  }
                  </td>

                <td>
                  {file.public_url === null 
                    ? '-' 
                    : <FontAwesomeIcon 
                        icon="earth" 
                        style={{cursor: 'pointer'}} 
                        onClick={() => window.open(file.public_url)} 
                      />
                  }
                </td>
                <td>
                  <span className="icon-edit" onClick={() => fileEdit(file.id)} title="Редактировать">{'\u{270f}'}</span>&nbsp;
                  <span className="icon-download" onClick={() => fileDownload(file.id)} title="Скачать">
                    <FontAwesomeIcon icon="download" />
                  </span>&nbsp;
                  <span className="icon-delete" onClick={() => fileDelete(file.id)} title="Удалить">&#10060;</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="storage-empty">В хранилище нет файлов</div>
      )}
      
      <FilesUpload files={files} setFiles={setFiles} />
    </div>
  );
}

export default FileStorage;