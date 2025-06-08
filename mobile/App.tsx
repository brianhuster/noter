import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { EditNoteScreen } from './src/screens/EditNoteScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { QuizHistoryScreen } from './src/screens/QuizHistoryScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
	const { loading, token } = useAuth();

	if (loading) {
		return null; // Or a loading screen
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{token ? (
					// Auth screens
					<>
						<Stack.Screen name="Home" component={HomeScreen} />
						<Stack.Screen
							name="EditNote"
							component={EditNoteScreen}
							options={({ route }: any) => ({
								title: route.params?.noteId ? 'Edit Note' : 'New Note',
							})}
						/>
						<Stack.Screen
							name="Quiz"
							component={QuizScreen}
							options={{ title: 'Quiz' }}
						/>
						<Stack.Screen
							name="QuizHistory"
							component={QuizHistoryScreen}
							options={{ title: 'Quiz History' }}
						/>
					</>
				) : (
					// Auth screens
					<>
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="Register"
							component={RegisterScreen}
							options={{ headerShown: false }}
						/>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default function App() {
	return (
		<PaperProvider>
			<AuthProvider>
				<Navigation />
			</AuthProvider>
		</PaperProvider>
	);
}
