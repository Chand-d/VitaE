import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

const ResultScreen = ({ route, navigation }) => {
  const { updatedResume } = route.params; // Get the updated resume from navigation params
  const [editableText, setEditableText] = useState(updatedResume);

  const savePdfToLibrary = async (uri) => {
    try {
      // Read existing library data or initialize it
      const libraryPath = `${FileSystem.documentDirectory}library.json`;
      const libraryContent = await FileSystem.readAsStringAsync(libraryPath).catch(() => '[]');
      const library = JSON.parse(libraryContent);

      // Add the new PDF's URI to the library
      library.push({ uri, name: `Resume_${Date.now()}.pdf` });
      await FileSystem.writeAsStringAsync(libraryPath, JSON.stringify(library));

      Alert.alert('Success', 'PDF saved and added to your library.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save PDF to library. Please try again.');
    }
  };

  const saveAsPDF = async () => {
    try {
      const htmlContent = `
        <html>
          <body>
            <h1 style="text-align: center; color: #333;">Updated Resume</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              ${editableText.replace(/\n/g, '<br />')}
            </p>
          </body>
        </html>
      `;

      // Generate PDF and show print/save dialog
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Save the PDF URI to the library
      await savePdfToLibrary(uri);

      // Optionally open the print/save dialog
      await Print.printAsync({ uri });
    } catch (error) {
      Alert.alert('Error', 'Failed to save or print PDF. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Your Resume</Text>
      <TextInput
        style={styles.textInput}
        multiline
        value={editableText}
        onChangeText={setEditableText}
      />
      <TouchableOpacity style={styles.button} onPress={saveAsPDF}>
        <Text style={styles.buttonText}>Save as PDF</Text>
      </TouchableOpacity>
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
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultScreen;
