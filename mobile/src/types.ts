export interface User {
	_id: string;
	username: string;
}

export interface Note {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthState {
	token: string | null;
	user: User | null;
}

export interface QuizQuestion {
	question: string;
	options: string[];
	correctAnswer: number;
}

export interface Quiz {
	_id: string;
	noteId: string;
	userId: string;
	questions: QuizQuestion[];
	createdAt: string;
	updatedAt: string;
}
