# Us and Ours - Technical Implementation Guide

## 🛠️ Implementation Roadmap

This guide provides a step-by-step approach to building the mobile app.

---

## 📋 Phase 1: Project Setup & Authentication

### 1.1 Project Initialization

**React Native:**
```bash
npx react-native init UsAndOurs --template react-native-template-typescript
cd UsAndOurs
```

**Flutter:**
```bash
flutter create us_and_ours
cd us_and_ours
```

### 1.2 Dependencies Installation

**React Native Core Dependencies:**
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install axios
npm install @react-native-async-storage/async-storage
npm install react-native-keychain  # For secure token storage
npm install react-native-vector-icons
npm install react-native-fast-image  # For image caching
npm install react-native-image-picker
npm install react-native-image-resizer
npm install date-fns
```

**Flutter Core Dependencies:**
```yaml
dependencies:
  http: ^1.1.0
  provider: ^6.0.5
  flutter_secure_storage: ^9.0.0
  cached_network_image: ^3.3.0
  image_picker: ^1.0.4
  flutter_image_compress: ^2.0.4
  intl: ^0.18.1
```

### 1.3 Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── client.ts
│   ├── auth.ts
│   ├── posts.ts
│   ├── couple.ts
│   └── ...
├── components/             # Reusable components
│   ├── GlassCard.tsx
│   ├── Button.tsx
│   ├── PostCard.tsx
│   ├── MoodSelector.tsx
│   └── ...
├── screens/                # Screen components
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   ├── Dashboard/
│   ├── Write/
│   ├── Timeline/
│   └── ...
├── navigation/             # Navigation setup
│   ├── AppNavigator.tsx
│   └── AuthNavigator.tsx
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   ├── usePosts.ts
│   └── ...
├── utils/                  # Utility functions
│   ├── storage.ts
│   ├── imageCompression.ts
│   └── dateHelpers.ts
├── constants/              # Constants
│   ├── colors.ts
│   ├── typography.ts
│   └── config.ts
└── types/                  # TypeScript types
    ├── user.ts
    ├── post.ts
    └── ...
```

---

## 🔐 Phase 2: Authentication Implementation

### 2.1 Secure Token Storage

**React Native Implementation:**

```typescript
// src/utils/storage.ts
import Keychain from 'react-native-keychain';

export const SecureStorage = {
  async setToken(token: string): Promise<void> {
    await Keychain.setGenericPassword('auth_token', token, {
      service: 'us-and-ours',
    });
  },

  async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'us-and-ours',
      });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    await Keychain.resetGenericPassword({
      service: 'us-and-ours',
    });
  },
};
```

**Flutter Implementation:**

```dart
// lib/utils/secure_storage.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'auth_token';

  static Future<void> setToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  static Future<void> removeToken() async {
    await _storage.delete(key: _tokenKey);
  }
}
```

### 2.2 API Client Setup

**React Native:**

```typescript
// src/api/client.ts
import axios, { AxiosInstance } from 'axios';
import { SecureStorage } from '../utils/storage';

const BASE_URL = __DEV__ 
  ? 'http://localhost:5000'
  : 'https://your-api-domain.com';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await SecureStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          await SecureStorage.removeToken();
          // Navigate to login (implement via navigation ref)
        }
        return Promise.reject(error);
      }
    );
  }

  getInstance() {
    return this.client;
  }
}

export const apiClient = new ApiClient().getInstance();
```

### 2.3 Authentication API

**React Native:**

```typescript
// src/api/auth.ts
import { apiClient } from './client';
import { SecureStorage } from '../utils/storage';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  action: 'create' | 'join';
  secretCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  async signup(data: SignupData) {
    const response = await apiClient.post('/auth/register', data);
    if (response.data.token) {
      await SecureStorage.setToken(response.data.token);
    }
    return response.data;
  },

  async login(data: LoginData) {
    const response = await apiClient.post('/auth/login', data);
    if (response.data.token) {
      await SecureStorage.setToken(response.data.token);
    }
    return response.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
    await SecureStorage.removeToken();
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },
};
```

### 2.4 Authentication Hook

**React Native:**

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { SecureStorage } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStorage.getToken();
      if (token) {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await SecureStorage.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setUser(data.user);
  };

  const signup = async (signupData: any) => {
    const data = await authApi.signup(signupData);
    setUser(data.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return { user, loading, login, signup, logout };
};
```

### 2.5 Login Screen

**React Native:**

```typescript
// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Navigation handled by auth state change
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff0f3',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4a0416',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  button: {
    backgroundColor: '#F43F5E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  link: {
    color: '#F43F5E',
    textAlign: 'center',
    marginTop: 16,
  },
});
```

---

## 📝 Phase 3: Posts Implementation

### 3.1 Posts API

```typescript
// src/api/posts.ts
import { apiClient } from './client';

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  mood: string;
  images: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export const postsApi = {
  async getPosts(): Promise<Post[]> {
    const response = await apiClient.get('/posts');
    return response.data.posts;
  },

  async createPost(data: {
    content: string;
    mood: string;
    images: string[];
  }) {
    const response = await apiClient.post('/posts', data);
    return response.data.post;
  },

  async updatePost(id: string, data: Partial<Post>) {
    const response = await apiClient.put(`/posts/${id}`, data);
    return response.data.post;
  },

  async deletePost(id: string) {
    await apiClient.delete(`/posts/${id}`);
  },
};
```

### 3.2 Posts Hook with Polling

```typescript
// src/hooks/usePosts.ts
import { useState, useEffect, useCallback } from 'react';
import { postsApi, Post } from '../api/posts';

export const usePosts = (pollingInterval = 3000) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await postsApi.getPosts();
      setPosts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();

    // Set up polling
    const interval = setInterval(fetchPosts, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchPosts, pollingInterval]);

  const refetch = () => {
    setLoading(true);
    fetchPosts();
  };

  return { posts, loading, error, refetch };
};
```

### 3.3 Image Upload Implementation

```typescript
// src/utils/imageUpload.ts
import { apiClient } from '../api/client';

export const uploadImageToCloudinary = async (
  imageUri: string
): Promise<string> => {
  // Get signature from backend
  const signResponse = await apiClient.get('/auth/cloudinary-sign');
  const { signature, timestamp, cloudName, apiKey } = signResponse.data;

  // Prepare form data
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', apiKey);

  // Upload to Cloudinary
  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await uploadResponse.json();
  return data.secure_url;
};
```

### 3.4 Image Compression

```typescript
// src/utils/imageCompression.ts
import ImageResizer from 'react-native-image-resizer';

export const compressImage = async (uri: string): Promise<string> => {
  try {
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      800,  // Max width
      800,  // Max height
      'JPEG',
      70,   // Quality
      0,    // Rotation
      null, // Output path
      false, // Keep metadata
      { mode: 'contain', onlyScaleDown: true }
    );
    return resizedImage.uri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri;
  }
};
```

### 3.5 Write Screen with Image Upload

```typescript
// src/screens/Write/WriteScreen.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { postsApi } from '../../api/posts';
import { uploadImageToCloudinary } from '../../utils/imageUpload';
import { compressImage } from '../../utils/imageCompression';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'romantic', emoji: '💕', label: 'Loved' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'excited', emoji: '🎉', label: 'Excited' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'angry', emoji: '😠', label: 'Angry' },
  { id: 'chill', emoji: '😎', label: 'Chill' },
];

export const WriteScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('happy');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]) {
      const compressedUri = await compressImage(result.assets[0].uri!);
      setImageUri(compressedUri);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      alert('Please write something!');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';
      
      if (imageUri) {
        imageUrl = await uploadImageToCloudinary(imageUri);
      }

      await postsApi.createPost({
        content,
        mood,
        images: imageUrl ? [imageUrl] : [],
      });

      navigation.goBack();
    } catch (error) {
      console.error('Post creation failed:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Memory</Text>

      {/* Mood Selector */}
      <ScrollView horizontal style={styles.moodContainer}>
        {MOODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.moodButton,
              mood === m.id && styles.moodButtonActive,
            ]}
            onPress={() => setMood(m.id)}
          >
            <Text style={styles.moodEmoji}>{m.emoji}</Text>
            <Text style={styles.moodLabel}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content Input */}
      <TextInput
        style={styles.textInput}
        placeholder="How are you feeling?"
        multiline
        value={content}
        onChangeText={setContent}
        textAlignVertical="top"
      />

      {/* Image Preview */}
      {imageUri && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity
            style={styles.removeImage}
            onPress={() => setImageUri(null)}
          >
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions */}
      <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
        <Text style={styles.imageButtonText}>📷 Add Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.postButton}
        onPress={handlePost}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.postButtonText}>Post Memory</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff0f3',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4a0416',
    marginBottom: 20,
  },
  moodContainer: {
    marginBottom: 20,
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonActive: {
    borderColor: '#F43F5E',
    backgroundColor: '#FFE4E6',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: '#4a0416',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    height: 200,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
    marginBottom: 20,
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  removeImage: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 20,
  },
  imageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#4a0416',
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#F43F5E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
```

---

## 🎨 Phase 4: UI Components

### 4.1 Glass Card Component

```typescript
// src/components/GlassCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassCard: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 5,
  },
  content: {
    position: 'relative',
  },
});
```

### 4.2 Post Card Component

```typescript
// src/components/PostCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { GlassCard } from './GlassCard';
import { Post } from '../api/posts';

interface Props {
  post: Post;
  currentUserId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const MOOD_EMOJI = {
  happy: '😊',
  romantic: '💕',
  sad: '😢',
  excited: '🎉',
  tired: '😴',
  angry: '😠',
  chill: '😎',
};

export const PostCard: React.FC<Props> = ({
  post,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const isAuthor = post.author._id === currentUserId;

  return (
    <GlassCard style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          {post.author.avatar ? (
            <Image
              source={{ uri: post.author.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {post.author.name[0].toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.authorName}>{post.author.name}</Text>
        </View>
        <Text style={styles.mood}>{MOOD_EMOJI[post.mood]}</Text>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.date}>
          {format(new Date(post.date), 'MMM dd, yyyy')}
        </Text>
        {isAuthor && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Text style={[styles.actionText, styles.deleteText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F43F5E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a0416',
  },
  mood: {
    fontSize: 32,
  },
  content: {
    fontSize: 16,
    color: '#4a0416',
    lineHeight: 24,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#F43F5E',
    fontWeight: '600',
  },
  deleteText: {
    color: '#EF4444',
  },
});
```

---

## 📱 Phase 5: Navigation

### 5.1 Navigation Setup

```typescript
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';

// Screens
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { SignupScreen } from '../screens/Auth/SignupScreen';
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { WriteScreen } from '../screens/Write/WriteScreen';
import { TimelineScreen } from '../screens/Timeline/TimelineScreen';
import { CalendarScreen } from '../screens/Calendar/CalendarScreen';
import { GalleryScreen } from '../screens/Gallery/GalleryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: '#F43F5E',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
      <Tab.Screen name="Write" component={WriteScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Show splash screen
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
```

---

## 🧪 Phase 6: Testing

### 6.1 Unit Tests

```typescript
// __tests__/api/posts.test.ts
import { postsApi } from '../../src/api/posts';
import { apiClient } from '../../src/api/client';

jest.mock('../../src/api/client');

describe('Posts API', () => {
  it('should fetch posts successfully', async () => {
    const mockPosts = [
      { _id: '1', content: 'Test post', mood: 'happy' },
    ];
    
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { posts: mockPosts },
    });

    const posts = await postsApi.getPosts();
    expect(posts).toEqual(mockPosts);
  });

  it('should create post successfully', async () => {
    const newPost = {
      content: 'New post',
      mood: 'happy',
      images: [],
    };

    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { post: { _id: '1', ...newPost } },
    });

    const post = await postsApi.createPost(newPost);
    expect(post.content).toBe('New post');
  });
});
```

---

## 🚀 Phase 7: Deployment

### 7.1 Build for Production

**React Native (Android):**
```bash
cd android
./gradlew assembleRelease
```

**React Native (iOS):**
```bash
cd ios
pod install
xcodebuild -workspace UsAndOurs.xcworkspace -scheme UsAndOurs -configuration Release
```

**Flutter:**
```bash
flutter build apk --release
flutter build ios --release
```

### 7.2 Environment Configuration

```typescript
// src/constants/config.ts
export const Config = {
  API_BASE_URL: __DEV__
    ? 'http://localhost:5000'
    : 'https://api.usandours.com',
  CLOUDINARY_CLOUD_NAME: 'your-cloud-name',
  GOOGLE_CLIENT_ID: 'your-google-client-id',
};
```

---

## ✅ Implementation Checklist

### Phase 1: Setup
- [ ] Initialize project
- [ ] Install dependencies
- [ ] Set up project structure
- [ ] Configure TypeScript

### Phase 2: Authentication
- [ ] Implement secure token storage
- [ ] Set up API client with interceptors
- [ ] Create authentication API methods
- [ ] Build login screen
- [ ] Build signup screen (create/join)
- [ ] Implement auth hook

### Phase 3: Posts
- [ ] Create posts API methods
- [ ] Implement posts hook with polling
- [ ] Build write screen
- [ ] Implement image picker
- [ ] Implement image compression
- [ ] Implement Cloudinary upload
- [ ] Build post card component
- [ ] Build dashboard with posts feed

### Phase 4: Additional Features
- [ ] Implement couple API
- [ ] Build countdown component
- [ ] Implement timeline API and screen
- [ ] Implement calendar API and screen
- [ ] Build gallery screen
- [ ] Implement movies/playlist

### Phase 5: Polish
- [ ] Add animations
- [ ] Implement pull-to-refresh
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add empty states
- [ ] Optimize performance

### Phase 6: Testing & Deployment
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test on real devices
- [ ] Configure production builds
- [ ] Submit to app stores

---

**Last Updated:** February 2024  
**Guide Version:** 1.0
