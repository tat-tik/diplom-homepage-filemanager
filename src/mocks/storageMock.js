export const mockStorage = (id) => ({
  files: [
    {
      id: 1,
      file_name: 'document.pdf',
      size: 1048576, 
      comment: 'Новый документ',
      date_load: new Date().toISOString(),
      date_download: null,
      public_url: null
    },
    {
      id: 2,
      file_name: 'image.jpg',
      size: 5242880, 
      comment: 'Новая фотография',
      date_load: new Date().toISOString(),
      date_download: new Date().toISOString(),
      public_url: 'example.com/image.jpg'
    },
    {
      id: 3,
      file_name: 'archive.zip',
      size: 15728640,
      comment: null,
      date_load: new Date().toISOString(),
      date_download: null,
      public_url: null
    }
  ],
  user: {
    id: Number(id),
    username: `user_${id}`,
    email: `user${id}@example.com`
  }
});

export const mockEmptyStorage = (id) => ({
  files: [],
  user: {
    id: Number(id),
    username: `user_${id}`,
    email: `user${id}@example.com`
  }
});

export default {
  mockStorage,
  mockEmptyStorage
};