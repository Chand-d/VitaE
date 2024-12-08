import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';

const MainScreen = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState([]);

  const API_ENDPOINT =
    'https://1aw4hjm1bc.execute-api.ca-central-1.amazonaws.com/dev/Image-Recognization';

  // Load the recent 5 documents from the library
  const loadRecentDocuments = async () => {
    try {
      const libraryPath = `${FileSystem.documentDirectory}library.json`;
      const libraryContent = await FileSystem.readAsStringAsync(libraryPath).catch(() => '[]');
      const library = JSON.parse(libraryContent);

      if (!Array.isArray(library)) {
        throw new Error('Invalid library data.');
      }

      const recentDocs = library.slice(-5).reverse(); // Get last 5 and reverse to show latest first
      setRecentDocuments(recentDocs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load recent documents.');
    }
  };

  useEffect(() => {
    // Reload recent documents whenever the main screen gains focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecentDocuments();
    });

    return unsubscribe;
  }, [navigation]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
      } else if (result.canceled) {
        Alert.alert('Canceled', 'No file selected.');
      } else {
        Alert.alert('Error', 'Unknown response from document picker.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert('Validation Error', 'Please select a file to upload.');
      return;
    }

    try {
      const fileUri = selectedFile.uri;
      const fileName = selectedFile.name;

      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        Alert.alert('Error', 'The selected file does not exist.');
        return;
      }

      setUploading(true);

      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const payload = {
        file_data_base64: fileContent,
        file_name: fileName,
        job_description: jobDescription,
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        const updatedResumeText = responseData.updated_resume;

        // Navigate to Result.js with the updated resume text
        navigation.navigate('Result', { updatedResume: updatedResumeText });
      } else {
        Alert.alert('Error', responseData.message || 'Failed to update resume.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openDocument = async (uri) => {
    try {
      await Print.printAsync({ uri });
    } catch (error) {
      Alert.alert('Error', 'Failed to open document.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* Subheading */}
        <Text style={styles.heading}>Create Customized Resume and Cover Letter</Text>

        <TextInput
          style={styles.input}
          placeholder="Paste Job Description or Changes here..."
          multiline
          value={jobDescription}
          onChangeText={setJobDescription}
        />

        <TouchableOpacity
          style={[styles.button, uploading && styles.disabledButton]}
          onPress={uploadFile}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {selectedFile && (
          <View style={styles.fileInfo}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color="#333"
            />
            <Text style={styles.fileName}>{selectedFile.name}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            {selectedFile ? 'Change File' : 'Select Resume'}
          </Text>
        </TouchableOpacity>

        {/* Recent Documents Section */}
        <View style={styles.recentContainer}>
          <Text style={styles.recentHeader}>Recent Documents</Text>
          {recentDocuments.length === 0 ? (
            <Text style={styles.noRecentText}>No recent documents found.</Text>
          ) : (
            recentDocuments.map((doc, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => openDocument(doc.uri)}
              >
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={24}
                  color="#E74C3C"
                  style={styles.recentIcon}
                />
                <Text style={styles.recentName}>{doc.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#333',
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
  },
  fileName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flexShrink: 1,
  },
  input: {
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    textAlignVertical: 'top',
    minHeight: 80,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
  },
  recentContainer: {
    marginTop: 20,
    width: '100%',
  },
  recentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noRecentText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    elevation: 2,
  },
  recentIcon: {
    marginRight: 10,
  },
  recentName: {
    fontSize: 16,
    color: '#333',
  },
});

export default MainScreen;
