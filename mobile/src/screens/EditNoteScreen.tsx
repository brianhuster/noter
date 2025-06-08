import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import * as api from '../api';
import { Note } from '../types';

export const EditNoteScreen = ({ route, navigation }: any) => {
  const noteId = route.params?.noteId;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (noteId) {
      loadNote();
    }
  }, [noteId]);

  const loadNote = async () => {
    try {
      setLoading(true);
      const response = await api.getNotes();
      const note = response.find((n: Note) => n._id === noteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (noteId) {
        await api.updateNote(noteId, title, content);
      } else {
        await api.createNote(title, content);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!noteId) return;
    
    try {
      setLoading(true);
      await api.deleteNote(noteId);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button onPress={() => setPreviewMode(!previewMode)}>
          {previewMode ? 'Edit' : 'Preview'}
        </Button>
        {noteId && (
          <Button onPress={handleDelete} color="red">
            Delete
          </Button>
        )}
        <Button mode="contained" onPress={handleSave}>
          Save
        </Button>
      </View>

      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
      />

      {previewMode ? (
        <ScrollView style={styles.preview}>
          <Markdown>{content}</Markdown>
        </ScrollView>
      ) : (
        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          style={styles.contentInput}
          placeholder="Write your note here (Markdown supported)"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleInput: {
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
