import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import * as api from '../api';
import { Quiz } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const QuizHistoryScreen = ({ route, navigation }: any) => {
	const { noteId } = route.params;
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadQuizHistory();
	}, []);

	const loadQuizHistory = async () => {
		try {
			setLoading(true);
			const history = await api.getNoteQuizzes(noteId);
			setQuizzes(history);
		} catch (error) {
			Alert.alert('Error', 'Failed to load quiz history');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	const renderQuizCard = ({ item: quiz }: { item: Quiz }) => {
		const score = quiz.questions.length > 0
			? `${(quiz.questions.filter((q, i) => q.correctAnswer === i).length / quiz.questions.length * 100).toFixed(0)}%`
			: 'N/A';

		return (
			<Card style={styles.card}>
				<Card.Content>
					<View style={styles.cardHeader}>
						<Text variant="titleMedium">Quiz Result</Text>
						<Text variant="titleLarge">{score}</Text>
					</View>
					<Text variant="bodyMedium">
						Questions: {quiz.questions.length}
					</Text>
					<Text variant="bodySmall" style={styles.timestamp}>
						{formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
					</Text>
				</Card.Content>
			</Card>
		);
	};

	return (
		<View style={styles.container}>
			{quizzes.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No quiz history yet</Text>
					<Text style={styles.emptySubText}>Take a quiz to see your results here</Text>
				</View>
			) : (
				<FlatList
					data={quizzes}
					renderItem={renderQuizCard}
					keyExtractor={item => item._id}
					contentContainerStyle={styles.list}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		marginBottom: 16,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	timestamp: {
		color: '#666',
		marginTop: 8,
	},
	list: {
		padding: 16,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		fontSize: 20,
		color: '#666',
		marginBottom: 8,
	},
	emptySubText: {
		fontSize: 16,
		color: '#999',
	},
});
