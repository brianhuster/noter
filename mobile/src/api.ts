import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 30000
});

api.interceptors.request.use(async (config) => {
	const token = await AsyncStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const login = async (username: string, password: string) => {
	const response = await api.post('/users/login', { username, password });
	return response.data;
};

export const register = async (username: string, password: string) => {
	const response = await api.post('/users/register', { username, password });
	return response.data;
};

export const getNotes = async () => {
	const response = await api.get('/notes');
	return response.data;
};

export const createNote = async (title: string, content: string) => {
	const response = await api.post('/notes', { title, content });
	return response.data;
};

export const updateNote = async (id: string, title: string, content: string) => {
	const response = await api.put(`/notes/${id}`, { title, content });
	return response.data;
};

export const deleteNote = async (id: string) => {
	try {
		const response = await api.delete(`/notes/${id}`);
		return response.data;
	} catch (error) {
		console.error('API Error - deleteNote:', error);
		throw error;
	}
};

export const generateQuiz = async (noteId: string) => {
	const response = await api.post(`/notes/${noteId}/quiz`);
	return response.data;
};

export const getNoteQuizzes = async (noteId: string) => {
	const response = await api.get(`/notes/${noteId}/quizzes`);
	return response.data;
};

export const getQuiz = async (quizId: string) => {
	const response = await api.get(`/quizzes/${quizId}`);
	return response.data;
};

export default api;
