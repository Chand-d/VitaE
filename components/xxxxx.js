import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For small icons

const MainScreen = ({ navigation }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [recentDocs] = useState([
    { title: 'Software Engineer - TechCorp', type: 'Resume', date: '2023-06-15' },
    { title: 'Product Manager - InnovateCo', type: 'Cover Letter', date: '2023-06-10' },
    { title: 'Data Analyst - DataDrive', type: 'Resume', date: '2023-06-05' },
  ]);

  const handleCreateResume = () => {
    console.log('Creating Customized Resume and Cover Letter...');
    // Add logic to handle resume creation with jobDescription
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Ionicons name="document-text" size={30} color="black" style={styles.icon} />
        <Text style={styles.title}>VitaE</Text>

        {/* Navigation Buttons beside VitaE */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Library')}>
            <Ionicons name="library" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Resume Section */}
      <View style={styles.createResumeContainer}>
        <Text style={styles.createResumeTitle}>Create Customized Resume and Cover Letter</Text>
        <Text style={styles.pasteDescription}>Paste the job description here...</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChangeText={setJobDescription}
          multiline
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateResume}>
          <Text style={styles.createButtonText}>Create Customized Resume and Cover Letter</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Documents Section */}
      <View style={styles.recentDocsContainer}>
        <Text style={styles.recentDocsTitle}>Recent Documents</Text>
        {recentDocs.map((doc, index) => (
          <View key={index} style={styles.document}>
            <Text style={styles.docTitle}>{doc.title}</Text>
            <Text style={styles.docDetails}>{`${doc.type} - ${doc.date}`}</Text>
          </View>
        ))}
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Library')}
        >
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,  // Adjusted to avoid overlap with camera
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10, // Space for navigation buttons
  },
  navigationButtons: {
    flexDirection: 'row',
    marginLeft: 'auto', // Align the buttons to the right of the title
  },
  navButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // Add spacing between buttons
  },
  createResumeContainer: {
    marginBottom: 20,
  },
  createResumeTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  pasteDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
  },
  recentDocsContainer: {
    marginTop: 30,
  },
  recentDocsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  document: {
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  docDetails: {
    fontSize: 14,
    color: '#555',
  },
  viewAllButton: {
    backgroundColor: 'black',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  viewAllText: {
    color: 'white',
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  sharedByText: {
    fontSize: 14,
    color: '#555',
  },
});

export default MainScreen;
