import React, { useState } from 'react';
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
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib'; // Import PDF-lib

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [updatedResume, setUpdatedResume] = useState('');

  const API_ENDPOINT =
    'https://1aw4hjm1bc.execute-api.ca-central-1.amazonaws.com/dev/Image-Recognization'; // Replace with your actual API endpoint

  // Handle File Selection
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

      console.log('DocumentPicker Result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        console.log('Selected File:', file);
      } else if (result.canceled) {
        Alert.alert('Canceled', 'No file selected.');
      } else {
        Alert.alert('Error', 'Unknown response from document picker.');
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  // Handle File Upload
  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert('Validation Error', 'Please select a file to upload.');
      return;
    }

    console.log('Selected File:', selectedFile);

    try {
      const fileUri = selectedFile.uri;
      const fileName = selectedFile.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log('File Info:', fileInfo);

      if (!fileInfo.exists) {
        Alert.alert('Error', 'The selected file does not exist.');
        return;
      }

      setUploading(true);
      console.log('Uploading file...');

      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const payload = {
        file_data_base64: fileContent,
        file_name: fileName,
        job_description: jobDescription,
        additional_text: additionalText,
      };

      console.log('Payload:', payload);

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('Server Response:', responseData);

      if (response.ok) {
        const updatedResumeText = responseData.updated_resume;
        setUpdatedResume(updatedResumeText);
        Alert.alert('Success', 'Your resume has been updated.');

        // Convert updated resume to PDF
        await generatePDF(updatedResumeText); // Generate the PDF
      } else {
        Alert.alert('Error', responseData.message || 'Failed to update resume.');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      console.log('File upload completed.');
    }
  };

  // Generate PDF from the updated resume text
  const generatePDF = async (text) => {
    try {
      const path = `${FileSystem.documentDirectory}updated_resume.pdf`;

      const pdfDoc = await PDFDocument.create();
      const page = await pdfDoc.addPage(PDFPage.create().setMediaBox(200, 200));

      // Add text to the page
      page.drawText(text, { x: 10, y: 150, fontSize: 12 });

      // Save the PDF
      await pdfDoc.writeToFile(path);

      console.log('PDF created at path:', path);

      // Optionally, share the PDF or provide a download link
      Alert.alert('PDF Created', `Your updated resume PDF has been saved at ${path}`);
    } catch (err) {
      console.error('Error creating PDF:', err);
      Alert.alert('Error', 'Failed to create PDF.');
    }
  };

  // Clear Output
  const clearOutput = () => {
    setUpdatedResume('');
    setSelectedFile(null);
    setJobDescription('');
    setAdditionalText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>VitaE</Text>
          <Text style={styles.headerSubtitle}>Level up your resume</Text>
        </View>

        {/* Job Description Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Job Description (Optional)"
          multiline
          value={jobDescription}
          onChangeText={setJobDescription}
        />

        {/* Additional Information Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter Additional Information (Optional)"
          multiline
          value={additionalText}
          onChangeText={setAdditionalText}
        />

        {/* Upload Button */}
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

        {/* Display Selected File */}
        {selectedFile && (
          <View style={styles.fileInfo}>
            <MaterialCommunityIcons
              name="file-word-box"
              size={24}
              color="#3498DB"
            />
            <Text style={styles.fileName}>{selectedFile.name}</Text>
          </View>
        )}

        {/* File Picker Button */}
        <TouchableOpacity style={styles.button} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            {selectedFile ? 'Change File' : 'Select Resume'}
          </Text>
        </TouchableOpacity>

        {/* Clear Output Button */}
        {updatedResume !== '' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearOutput}
          >
            <Text style={styles.clearButtonText}>Clear Output</Text>
          </TouchableOpacity>
        )}

        {/* Display Updated Resume */}
        {updatedResume !== '' && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Updated Resume:</Text>
            <Text style={styles.resultText}>{updatedResume}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  button: {
    backgroundColor: '#3498DB',
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
    backgroundColor: '#95A5A6',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
  resultContainer: {
    marginTop: 20,
    borderColor: '#2ECC71',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#E8F8F5',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#16A085',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FileUploader;
