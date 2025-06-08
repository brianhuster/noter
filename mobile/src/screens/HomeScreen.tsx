import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { FAB, Card, Title, Paragraph, Button, Searchbar, IconButton } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';
import { Note } from '../types';
import { formatDistanceToNow } from 'date-fns';

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

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteNote(noteId);
              loadNotes(); // Refresh the list
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ],
    );
  };

  const renderNoteCard = ({ item: note }: { item: Note }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{note.title}</Title>
          <View style={styles.cardActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => navigation.navigate('EditNote', { noteId: note._id })}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteNote(note._id)}
            />
          </View>
        </View>
        <Paragraph numberOfLines={3} style={styles.content}>
          {note.content}
        </Paragraph>
        <Text style={styles.timestamp}>
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </Text>
      </Card.Content>
    </Card>
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
        <Button onPress={logout}>Logout</Button>
      </View>
      
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.notesList}
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
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
  },
  notesList: {
    padding: 16,
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
  },
});
