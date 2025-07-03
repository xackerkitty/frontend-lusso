import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projeler
export const getProjects = () => api.get('/projects');
export const getProjectsByCategory = (category: string) => api.get(`/projects/category/${category}`);
export const createProject = (data: any) => api.post('/projects', data);
export const updateProject = (id: string, data: any) => api.patch(`/projects/${id}`, data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Haberler
export const getNews = () => api.get('/news');
export const getNewsByCategory = (category: string) => api.get(`/news/category/${category}`);
export const createNews = (data: any) => api.post('/news', data);
export const updateNews = (id: string, data: any) => api.patch(`/news/${id}`, data);
export const deleteNews = (id: string) => api.delete(`/news/${id}`);

// Etkinlikler
export const getEvents = () => api.get('/events');
export const getEventsByCategory = (category: string) => api.get(`/events/category/${category}`);
export const createEvent = (data: any) => api.post('/events', data);
export const updateEvent = (id: string, data: any) => api.patch(`/events/${id}`, data);
export const deleteEvent = (id: string) => api.delete(`/events/${id}`);

// Galeri
export const getGalleryItems = () => api.get('/gallery');
export const getGalleryItemsByCategory = (category: string) => api.get(`/gallery/category/${category}`);
export const createGalleryItem = (data: any) => api.post('/gallery', data);
export const updateGalleryItem = (id: string, data: any) => api.patch(`/gallery/${id}`, data);
export const deleteGalleryItem = (id: string) => api.delete(`/gallery/${id}`);

// Strapi Luxury Hero
export const getLuxuryHero = () => axios.get('/api/luxury-heroes?populate=*');

// Strapi Cars
export const getCars = () => axios.get('/api/cars?populate=*');
// Strapi About Us
export const getAboutUs = () => axios.get('/api/aboutuses?populate=*');
// Strapi Showroom
export const getShowroom = () => axios.get('/api/showrooms?populate=*');
// Strapi Contact
export const getContact = () => axios.get('/api/contacts?populate=*');

export default api; 