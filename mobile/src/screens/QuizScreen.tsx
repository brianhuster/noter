import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Animated } from 'react-native';
import { Text, Button, Card, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import * as api from '../api';
import { Quiz } from '../types';

export const QuizScreen = ({ route, navigation }: any) => {
	const { noteId } = route.params;
	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [loading] = useState(false);
	const [generating, setGenerating] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [score, setScore] = useState(0);
	const [quizComplete, setQuizComplete] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(true);
	const fadeAnim = useState(new Animated.Value(1))[0];

	useEffect(() => {
		if (!showConfirmDialog) {
			generateQuiz();
		}
	}, [showConfirmDialog]);

	const generateQuiz = async () => {
		try {
			setGenerating(true);
			const newQuiz = await api.generateQuiz(noteId);
			setQuiz(newQuiz);
			setCurrentQuestion(0);
			setScore(0);
			setQuizComplete(false);
			setSelectedAnswer(null);
		} catch (error: any) {
			console.error('Quiz generation error:', error);
			const errorMessage = error.response?.data?.message || error.message || 'Failed to generate quiz';
			// Use Dialog instead of Alert for web compatibility
			setGenerating(false);
			setShowConfirmDialog(false);
			navigation.goBack();
			// Small delay to ensure the navigation is complete before showing the error
			setTimeout(() => {
				Alert.alert('Error', errorMessage);
			}, 100);
		} finally {
			setGenerating(false);
		}
	};

	const handleAnswer = (answerIndex: number) => {
		if (selectedAnswer !== null || !quiz) return;

		setSelectedAnswer(answerIndex);
		const currentQ = quiz.questions[currentQuestion];

		if (answerIndex === currentQ.correctAnswer) {
			setScore(prev => prev + 1);
		}

		Animated.sequence([
			Animated.timing(fadeAnim, {
				toValue: 0.3,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start();

		setTimeout(() => {
			if (currentQuestion < quiz.questions.length - 1) {
				setCurrentQuestion(prev => prev + 1);
				setSelectedAnswer(null);
			} else {
				setQuizComplete(true);
			}
		}, 1000);
	};

	if (showConfirmDialog) {
		return (
			<Portal>
				<Dialog visible={true} onDismiss={() => navigation.goBack()}>
					<Dialog.Title>Start Quiz</Dialog.Title>
					<Dialog.Content>
						<Text variant="bodyMedium">
							Ready to test your knowledge? The quiz will have multiple choice questions based on your note content.
						</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => navigation.goBack()}>Cancel</Button>
						<Button onPress={() => setShowConfirmDialog(false)}>Start Quiz</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		);
	}

	if (generating) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" />
				<Text style={styles.loadingText}>Generating quiz questions...</Text>
			</View>
		);
	}

	if (loading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (!quiz) {
		return (
			<View style={styles.centered}>
				<Text>Failed to load quiz</Text>
			</View>
		);
	}

	if (quizComplete) {
		return (
			<View style={styles.container}>
				<Card style={styles.card}>
					<Card.Content>
						<Text variant="headlineMedium" style={styles.centered}>
							Quiz Complete!
						</Text>
						<Text variant="titleLarge" style={[styles.centered, styles.score]}>
							Score: {score}/{quiz.questions.length}
						</Text>
						<Text variant="bodyMedium" style={[styles.centered, styles.feedback]}>
							{score === quiz.questions.length
								? 'Perfect score! Excellent work! 🎉'
								: score >= quiz.questions.length * 0.7
									? 'Great job! Keep practicing! 👏'
									: 'Keep studying and try again! 💪'}
						</Text>
						<Button
							mode="contained"
							onPress={generateQuiz}
							style={styles.button}
						>
							Try Again
						</Button>
						<Button
							mode="outlined"
							onPress={() => navigation.goBack()}
							style={styles.button}
						>
							Back to Notes
						</Button>
					</Card.Content>
				</Card>
			</View>
		);
	}

	const currentQ = quiz.questions[currentQuestion];

	return (
		<View style={styles.container}>
			<View style={styles.progress}>
				<Text>Question {currentQuestion + 1} of {quiz.questions.length}</Text>
				<Text>Score: {score}</Text>
			</View>

			<Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
				<Card style={styles.card}>
					<Card.Content>
						<Text variant="titleLarge" style={styles.question}>
							{currentQ.question}
						</Text>

						{currentQ.options.map((option, index) => (
							<Button
								key={index}
								mode={selectedAnswer === null ? "outlined" : "contained"}
								style={[
									styles.optionButton,
									selectedAnswer === index && (
										index === currentQ.correctAnswer
											? styles.correctAnswer
											: styles.wrongAnswer
									),
									selectedAnswer !== null &&
									index === currentQ.correctAnswer &&
									styles.correctAnswer
								]}
								onPress={() => handleAnswer(index)}
								disabled={selectedAnswer !== null}
							>
								{option}
							</Button>
						))}
					</Card.Content>
				</Card>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
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
	progress: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	question: {
		marginBottom: 24,
	},
	optionButton: {
		marginBottom: 12,
	},
	correctAnswer: {
		backgroundColor: '#4CAF50',
	},
	wrongAnswer: {
		backgroundColor: '#f44336',
	},
	score: {
		marginVertical: 24,
	},
	button: {
		marginVertical: 8,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: '#666',
	},
	feedback: {
		marginBottom: 24,
		textAlign: 'center',
	},
});
