import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const tabIndicatorPosition = new Animated.Value(0);

  const enhancementPrompts = [
    {
      id: 1,
      title: "Highlight Achievements",
      icon: "trophy",
      description: "Add specific metrics and achievements from your previous roles",
      examples: [
        "Increased sales by X%",
        "Led a team of X people",
        "Reduced costs by X amount"
      ]
    },
    {
      id: 2,
      title: "Technical Skills",
      icon: "code-working",
      description: "List relevant technical skills and proficiency levels",
      examples: [
        "Programming languages",
        "Software tools",
        "Industry-specific technologies"
      ]
    },
    {
      id: 3,
      title: "Professional Summary",
      icon: "document-text",
      description: "Write a compelling professional summary",
      examples: [
        "Years of experience",
        "Key specializations",
        "Career highlights"
      ]
    }
  ];

  const switchTab = (tab) => {
    setActiveTab(tab);
    Animated.timing(tabIndicatorPosition, {
      toValue: tab === 'upload' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/rtf',
          'text/plain'
        ],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setFile(result);
        setError('');
      }
    } catch (err) {
      setError('Error picking document');
    }
  };

  const handleSubmit = async () => {
    if (!file && !pastedText) {
      setError('Please either upload a file or paste your resume content');
      return;
    }
  };

  const renderPromptCard = (prompt) => (
    <TouchableOpacity
      key={prompt.id}
      style={[
        styles.promptCard,
        expandedPrompt === prompt.id && styles.promptCardExpanded
      ]}
      onPress={() => setExpandedPrompt(
        expandedPrompt === prompt.id ? null : prompt.id
      )}
    >
      <View style={styles.promptHeader}>
        <Ionicons name={prompt.icon} size={moderateScale(24)} color="#3B82F6" />
        <Text style={styles.promptTitle}>{prompt.title}</Text>
        <Ionicons 
          name={expandedPrompt === prompt.id ? "chevron-up" : "chevron-down"} 
          size={moderateScale(24)} 
          color="#6B7280"
        />
      </View>
      
      {expandedPrompt === prompt.id && (
        <View style={styles.promptContent}>
          <Text style={styles.promptDescription}>{prompt.description}</Text>
          <View style={styles.examplesList}>
            {prompt.examples.map((example, index) => (
              <View key={index} style={styles.exampleItem}>
                <Ionicons name="checkmark-circle" size={moderateScale(16)} color="#10B981" />
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Your Resume</Text>
            <Text style={styles.headerSubtitle}>
              Upload a file or paste your resume content
            </Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={styles.tab} 
              onPress={() => switchTab('upload')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'upload' && styles.activeTabText
              ]}>Upload File</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.tab} 
              onPress={() => switchTab('paste')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'paste' && styles.activeTabText
              ]}>Paste Text</Text>
            </TouchableOpacity>
            
            <Animated.View 
              style={[
                styles.tabIndicator,
                {
                  transform: [{
                    translateX: tabIndicatorPosition.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, width * 0.5]
                    })
                  }]
                }
              ]} 
            />
          </View>

          {activeTab === 'upload' ? (
            <TouchableOpacity 
              style={[styles.uploadBox, file && styles.uploadBoxSuccess]} 
              onPress={pickDocument}
            >
              <MaterialIcons 
                name={file ? "check-circle" : "cloud-upload"} 
                size={moderateScale(48)} 
                color={file ? "#10B981" : "#6B7280"}
              />
              
              {!file ? (
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Upload Your Resume</Text>
                  <Text style={styles.subtitle}>
                    Tap to browse (PDF, DOC, DOCX, RTF, TXT)
                  </Text>
                </View>
              ) : (
                <View style={styles.fileInfo}>
                  <MaterialIcons name="description" size={moderateScale(24)} color="#10B981" />
                  <Text style={styles.fileName}>{file.name}</Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Paste your resume content here..."
                value={pastedText}
                onChangeText={setPastedText}
                textAlignVertical="top"
              />
            </View>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={moderateScale(20)} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.promptsSection}>
            <Text style={styles.promptsTitle}>Resume Enhancement Tips</Text>
            {enhancementPrompts.map(renderPromptCard)}
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!file && !pastedText) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!file && !pastedText}
          >
            <Text style={styles.submitButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={moderateScale(24)} color="white" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: '20@ms',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: '24@ms',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '4@ms',
  },
  headerSubtitle: {
    fontSize: '16@ms',
    color: '#64748B',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: '20@ms',
    marginTop: '20@ms',
    marginBottom: '16@ms',
    borderRadius: '12@ms',
    backgroundColor: '#F1F5F9',
    padding: '4@ms',
  },
  tab: {
    flex: 1,
    paddingVertical: '12@ms',
    alignItems: 'center',
  },
  tabText: {
    fontSize: '16@ms',
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: '8@ms',
  },
  uploadBox: {
    margin: '20@ms',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    borderRadius: '12@ms',
    padding: '20@ms',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadBoxSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: '12@ms',
  },
  title: {
    fontSize: '18@ms',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4@ms',
  },
  subtitle: {
    fontSize: '14@ms',
    color: '#6B7280',
    textAlign: 'center',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '12@ms',
  },
  fileName: {
    fontSize: '16@ms',
    color: '#10B981',
    fontWeight: '500',
  },
  textInputContainer: {
    margin: '20@ms',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: '12@ms',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    height: '200@ms',
    padding: '16@ms',
    fontSize: '16@ms',
    color: '#374151',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: '12@ms',
    borderRadius: '8@ms',
    marginHorizontal: '20@ms',
  },
  errorText: {
    color: '#EF4444',
    fontSize: '14@ms',
  },
  promptsSection: {
    padding: '20@ms',
  },
  promptsTitle: {
    fontSize: '20@ms',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '16@ms',
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12@ms',
    padding: '16@ms',
    marginBottom: '12@ms',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promptCardExpanded: {
    backgroundColor: '#F8FAFC',
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptTitle: {
    fontSize: '16@ms',
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginLeft: '12@ms',
  },
  promptContent: {
    marginTop: '12@ms',
    paddingTop: '12@ms',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  promptDescription: {
    fontSize: '14@ms',
    color: '#64748B',
    marginBottom: '12@ms',
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8@ms',
  },
  exampleText: {
    fontSize: '14@ms',
    color: '#475569',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    margin: '20@ms',
    padding: '16@ms',
    borderRadius: '12@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: '16@ms',
    fontWeight: '600',
  },
});

export default ResumeUpload;
