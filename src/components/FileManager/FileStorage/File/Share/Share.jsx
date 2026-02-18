import './Share.css';
import { useParams } from "react-router";
import useRequest from "../../../../CustomHooks/useRequest"

function Share({ file, setFile }) {
  const { storage } = useParams();
  const { request }= useRequest();

  const shareFile = async() => {
    await request('GET', import.meta.env.VITE_SERVER_HOST + `/api/download/share/${file.id}`)
    const f = await request('GET', import.meta.env.VITE_SERVER_HOST + `/api/storage/${storage}/${file.id}`)
    setFile(f.file)
  }
  return (
    <div className='file-share'>
      <div className='file-share-manage'>
        <input type='button' className="btn-share" value={file.public_url === null ? "Разрешить публичный доступ" : "Запретить публичный доступ"} onClick={shareFile} />
        {file.public_url ?
          <div className='share-public-url'><span className='share-public-url-text'>{import.meta.env.VITE_SERVER_HOST + `/api/download/share/public/${file.public_url}`}</span>
            <span className='share-public-url-copy' title="Copy to Clipboard" onClick={() => {navigator.clipboard.writeText(import.meta.env.VITE_SERVER_HOST + `/api/download/share/public/${file.public_url}`)}}>&#128203;</span>
          </div>      
      : ''}
      </div>        
    </div>
  )
}

export default Share;