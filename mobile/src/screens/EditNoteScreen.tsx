import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native';
import { TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import * as api from '../api';
import { Note } from '../types';

export const EditNoteScreen = ({ route, navigation }: any) => {
  const noteId = route.params?.noteId;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
      Alert.alert('Error', 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    try {
      setSaving(true);
      if (noteId) {
        await api.updateNote(noteId, title, content);
        Alert.alert('Success', 'Note updated successfully');
      } else {
        const newNote = await api.createNote(title, content);
        Alert.alert('Success', 'Note created successfully');
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await api.deleteNote(noteId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
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
        <IconButton
          icon={previewMode ? 'pencil' : 'eye'}
          onPress={() => setPreviewMode(!previewMode)}
          size={24}
        />
        <View style={styles.headerCenter}>
          {saving && <ActivityIndicator size="small" />}
        </View>
        <View style={styles.headerRight}>
          <IconButton
            icon="content-save"
            onPress={handleSave}
            size={24}
            color="#2196F3"
          />
          {noteId && (
            <IconButton
              icon="delete"
              onPress={handleDelete}
              size={24}
              color="red"
            />
          )}
        </View>
      </View>

      <TextInput
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        style={styles.titleInput}
        mode="flat"
      />

      {previewMode ? (
        <ScrollView style={styles.preview}>
          <View style={styles.previewContent}>
            <Text style={styles.previewTitle}>{title || 'Untitled'}</Text>
            <Markdown>{content || '*No content yet*'}</Markdown>
          </View>
        </ScrollView>
      ) : (
        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          style={styles.contentInput}
          placeholder="Start writing your note here... (Markdown supported)"
          mode="flat"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  titleInput: {
    backgroundColor: 'transparent',
    fontSize: 24,
    padding: 16,
  },
  contentInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    padding: 16,
    textAlignVertical: 'top',
  },
  preview: {
    flex: 1,
  },
  previewContent: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
