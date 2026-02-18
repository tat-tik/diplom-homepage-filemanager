import './File.css';
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import { useSelector } from "react-redux";
import FieldInputEditor from "../../FieldInputEditor/FieldInputEditor";
import fileSize from "../../../CustomHooks/formatFileSize";
import Share from "./Share/Share";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import 'moment/locale/ru';
import { mockFileDetails } from '../../../../mocks/fileMock';

function File() {
  const [file, setFile] = useState(null);
  const { storage, file_id } = useParams();
  const [statusField, setStatusField] = useState({status_edit: false, field_edit: ''});
  {/*const { storage_id, isAdmin } = useSelector((state) => state.user);*/}

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!storage || !file_id) {
      return;
    }

    let isActive = true;

    const loadData = () => {
      try {
        const fileData = mockFileDetails(storage, file_id);
        if (fileData?.file && isActive) {
          setFile(fileData.file);
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [storage, file_id]);

  const changeField = (e) => {
    setStatusField({status_edit: true, field_edit: e.target.getAttribute('name')});
  };

  const saveFile = () => {
    alert('Изменения сохранены (мок-режим)');
    setStatusField({status_edit: false, field_edit: ''});
  };

  if (!file) {
    return <div className="file">Загрузка файла...</div>;
  }

  return (
    <div className='file'>
      <div style={{marginTop: '100px'}}>
        <div className="file-information">
          <table className="table table-file">
            <tbody>
              <tr>
                <th>Имя файла</th>
                <td className='td-pointer' name="file_name" onClick={changeField}>
                  {statusField.field_edit === "file_name" && statusField.status_edit ? (
                    <FieldInputEditor 
                      statusField={statusField} 
                      setStatusField={setStatusField} 
                      object={file} 
                      setObject={setFile} 
                    />
                  ) : (
                    decodeURIComponent(file.file_name)
                  )}
                </td>
              </tr>
              <tr>
                <th>Размер</th>
                <td>{fileSize(Number(file.size))}</td>
              </tr>        
              <tr>
                <th>Комментарий</th>
                <td className='td-pointer' name="comment" onClick={changeField}>
                  {statusField.field_edit === "comment" && statusField.status_edit ? (
                    <FieldInputEditor 
                      statusField={statusField} 
                      setStatusField={setStatusField} 
                      object={file} 
                      setObject={setFile} 
                    />
                  ) : (
                    file.comment || '-'
                  )}
                </td>
              </tr>
              <tr>
                <th>Дата загрузки</th>
                <td>{moment(file.date_load).format("YYYY-MM-DD HH:mm:ss")}</td>
              </tr>   
              <tr>
                <th>Последнее скачивание</th>
                <td>
                  {file.date_download 
                    ? moment(file.date_download).format("YYYY-MM-DD HH:mm:ss") 
                    : 'никогда'}
                </td>
              </tr>   
              <tr>
                <th>Публичный доступ</th>
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
              </tr>   
            </tbody>
          </table>
          <input 
            type='button' 
            className="file-btn-save" 
            value="Сохранить" 
            onClick={saveFile} 
          />
        </div> 
        <Share file={file} setFile={setFile} />
      </div>
    </div>
  );
}

export default File;