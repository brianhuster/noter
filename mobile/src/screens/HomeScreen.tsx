import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert, Text } from 'react-native';
import { FAB, Card, Button, Searchbar, IconButton } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';
import { Note } from '../types';

export const HomeScreen = ({ navigation }: any) => {
	const { logout } = useAuth();
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		loadNotes();
	}, []);

	const loadNotes = async () => {
		try {
			setLoading(true);
			const fetchedNotes = await api.getNotes();
			setNotes(fetchedNotes);
		} catch (error) {
			console.error('Error loading notes:', error);
		} finally {
			setLoading(false);
		}
	};

	const filteredNotes = notes.filter(note =>
		note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		note.content.toLowerCase().includes(searchQuery.toLowerCase())
	);

  const renderNoteCard = ({ item: note }: { item: Note }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.titleText}>{note.title}</Text>
          <View style={styles.cardActions}>
            <IconButton
              icon="brain"
              size={20}
              onPress={() => navigation.navigate('Quiz', { noteId: note._id })}
            />
            <IconButton
              icon="history"
              size={20}
              onPress={() => navigation.navigate('QuizHistory', { noteId: note._id })}
            />
						<IconButton
							icon="pencil"
              size={20}
              onPress={() => navigation.navigate('EditNote', { noteId: note._id })}
            />
          </View>
        </View>
      </Card.Content>
     </Card>
  )
            
	const emptyNotesView = () => (
		<View style={styles.emptyContainer}>
			<Text style={styles.emptyText}>No notes yet</Text>
			<Text style={styles.emptySubText}>Tap the + button to create one</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Searchbar
					placeholder="Search notes..."
					onChangeText={setSearchQuery}
					value={searchQuery}
					style={styles.searchbar}
				/>
				<Button onPress={logout}>Log out</Button>
			</View>

			<FlatList
				data={filteredNotes}
				renderItem={renderNoteCard}
				keyExtractor={item => item._id}
				contentContainerStyle={[
					styles.notesList,
					!filteredNotes.length && styles.emptyList
				]}
				ListEmptyComponent={emptyNotesView}
				onRefresh={loadNotes}
				refreshing={loading}
			/>

			<FAB
				style={styles.fab}
				icon="plus"
				onPress={() => navigation.navigate('EditNote')}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	header: {
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		elevation: 4,
	},
	searchbar: {
		flex: 1,
		marginRight: 8,
	},
	notesList: {
		padding: 16,
	},
	emptyList: {
		flex: 1,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 100,
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
	card: {
		marginBottom: 16,
		elevation: 2,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	cardActions: {
		flexDirection: 'row',
	},
	content: {
		marginBottom: 8,
	},
	timestamp: {
		fontSize: 12,
		color: '#666',
		fontStyle: 'italic',
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: '#2196F3',
	},
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});
