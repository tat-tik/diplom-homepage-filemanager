function useUploadFiles() {
  const uploadFiles = async (files, comments, storage_id, csrftoken, updateProgress) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', import.meta.env.VITE_SERVER_HOST + `/api/storage/${storage_id}/`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
    const promise = new Promise((resolve, reject) => {

      xhr.onload = () => {
        if (xhr.status === 200) {
          
          resolve(xhr.response)
        } else {
          
          reject(xhr.response)
        }
      };

      xhr.upload.addEventListener('progress', updateProgress, true);

      const data = new FormData();
      Array.from(files).map((file) => data.append('files[]', file))
      data.append('comments', JSON.stringify(comments))
      xhr.send(data);
    })
    promise.abort = () => xhr.abort()
    return promise
  }
  return { uploadFiles }
}

export default useUploadFiles;