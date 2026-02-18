export const mockFile = (storageId, fileId) => ({
  id: Number(fileId),
  file_name: `file_${fileId}.txt`,
  size: 1024 * 1024 * Math.floor(Math.random() * 10), 
  comment: 'Тестовый файл',
  date_load: new Date().toISOString(),
  date_download: null,
  public_url: null,
  storage_id: Number(storageId)
});

export const mockFileDetails = (storageId, fileId) => ({
  file: mockFile(storageId, fileId),
  storage: {
    id: Number(storageId),
    user_id: 11
  }
});