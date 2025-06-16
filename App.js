import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mataKuliah] = useState("Pemrograman Mobile");
  const [absenHariIni, setAbsenHariIni] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNama('');
    setKelas('');
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetFields();
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Tolong masukan Email dan Password.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Tolong masukan Email yang valid.');
      return;
    }

    if (!registeredUser || email !== registeredUser.email || password !== registeredUser.password) {
      Alert.alert('Error', 'Email atau Password salah.');
      return;
    }

    setLoggedIn(true);
  };

  const handleRegister = () => {
    if (!email || !password || !confirmPassword || !nama || !kelas) {
      Alert.alert('Error', 'Tolong lengkapi semua data.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Email tidak valid.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password kurang dari 6 karakter.');
      return;
    }

    setRegisteredUser({ email, password, nama, kelas });
    Alert.alert('Sukses', `Akun untuk ${email} berhasil dibuat.`);
    setIsLogin(true);
    resetFields();
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setAbsenHariIni(false);
    resetFields();
  };

  // --- DASHBOARD ---
  if (loggedIn) {
    return (
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Dashboard Mahasiswa</Text>
        <Text style={styles.timeText}>
          {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
        </Text>

        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>Nama:</Text>
          <Text style={styles.profileValue}>{registeredUser.nama}</Text>

          <Text style={styles.profileLabel}>Kelas:</Text>
          <Text style={styles.profileValue}>{registeredUser.kelas}</Text>

          <Text style={styles.profileLabel}>Email:</Text>
          <Text style={styles.profileValue}>{registeredUser.email}</Text>

          <Text style={styles.profileLabel}>Mata Kuliah:</Text>
          <Text style={styles.profileValue}>{mataKuliah}</Text>

          <Text style={styles.profileLabel}>Status Absen Hari Ini:</Text>
          <Text style={styles.profileValue}>
            {absenHariIni ? '✅ Sudah Absen' : '❌ Belum Absen'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: absenHariIni ? '#9CA3AF' : '#10B981', marginBottom: 16 }]}
          onPress={() => setAbsenHariIni(true)}
          disabled={absenHariIni}
        >
          <Text style={styles.buttonText}>
            {absenHariIni ? 'Absen Tercatat' : 'Absen Sekarang'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- FORM LOGIN / REGISTER ---
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

        {!isLogin && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nama</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama Lengkap"
                value={nama}
                onChangeText={setNama}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kelas</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukan Kelas Anda"
                value={kelas}
                onChangeText={setKelas}
                placeholderTextColor="#999"
              />
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="contoh@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />
        </View>

        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Kembali Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#999"
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLogin ? styles.loginButton : styles.registerButton]}
          onPress={isLogin ? handleLogin : handleRegister}
        >
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleForm} style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isLogin ? "Belum punya akun? Sign In" : 'Sudah punya akun? Login'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    alignSelf: 'center',
    marginBottom: 36,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#000000',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  loginButton: {
    backgroundColor: '#10B981',
  },
  registerButton: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  toggleContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    color: '#000000',
    fontSize: 16,
  },
  dashboardContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
    alignSelf: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginBottom: 30,
  },
  profileLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 10,
  },
  profileValue: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default App;
