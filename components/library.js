import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LibraryScreen = () => {
  const [library, setLibrary] = useState([]);

  // Load library data from library.json
  const loadLibrary = async () => {
    try {
      const libraryPath = `${FileSystem.documentDirectory}library.json`;
      const libraryContent = await FileSystem.readAsStringAsync(libraryPath).catch(() => '[]');
      const parsedLibrary = JSON.parse(libraryContent);
      setLibrary(parsedLibrary);
    } catch (error) {
      Alert.alert('Error', 'Failed to load library.');
    }
  };

  // Print the selected PDF file
  const printPdf = async (uri) => {
    try {
      await Print.printAsync({ uri });
    } catch (error) {
      Alert.alert('Error', 'Failed to print the PDF.');
    }
  };

  // Delete a file from the library
  const deleteFile = async (fileIndex) => {
    try {
      const updatedLibrary = library.filter((_, index) => index !== fileIndex);
      setLibrary(updatedLibrary);

      // Save the updated library to the file system
      const libraryPath = `${FileSystem.documentDirectory}library.json`;
      await FileSystem.writeAsStringAsync(libraryPath, JSON.stringify(updatedLibrary));

      Alert.alert('Success', 'File removed from the library.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the file.');
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Documents Library</Text>
      {library.length === 0 ? (
        <Text style={styles.noFilesText}>No saved PDFs found.</Text>
      ) : (
        <FlatList
          data={library}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.fileItem}>
              <TouchableOpacity
                style={styles.fileButton}
                onPress={() => printPdf(item.uri)}
              >
                <MaterialCommunityIcons name="file-pdf-box" size={30} color="#E74C3C" />
                <Text style={styles.fileName}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteFile(index)}
              >
                <MaterialCommunityIcons name="delete-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noFilesText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flexShrink: 1,
  },
  deleteButton: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default LibraryScreen;
