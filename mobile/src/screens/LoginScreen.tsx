import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

export const LoginScreen = ({ navigation }: any) => {
	const { login } = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleLogin = async () => {
		try {
			setLoading(true);
			setError('');
			const { token, user } = await api.login(username, password);
			await login(token, user);
		} catch (err: any) {
			setError(err.response?.data?.message || err.message || 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Noter</Text>
			<TextInput
				label="Username"
				value={username}
				onChangeText={setUsername}
				style={styles.input}
				autoCapitalize="none"
			/>
			<TextInput
				label="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				style={styles.input}
			/>
			{error ? <Text style={styles.error}>{error}</Text> : null}
			<Button
				mode="contained"
				onPress={handleLogin}
				loading={loading}
				style={styles.button}
			>
				Login
			</Button>
			<Button
				mode="text"
				onPress={() => navigation.navigate('Register')}
				style={styles.button}
			>
				Don't have an account? Register
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 40,
	},
	input: {
		marginBottom: 16,
	},
	button: {
		marginTop: 8,
	},
	error: {
		color: 'red',
		marginBottom: 8,
		textAlign: 'center',
	},
});
