import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CompletarPerfilModalProps {
  signUp: any;
  setActive: any;
}

const CompletarPerfilModal: React.FC<CompletarPerfilModalProps> = ({ signUp, setActive }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onCompleteProfile = async () => {
    setLoading(true);
    setError('');
    try {
      await signUp.update({ username, password });
      if (signUp.status === 'complete' && signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
        setSuccess(true);
        setTimeout(() => {
          router.replace('/');
        }, 1200);
      } else {
        setError('No se pudo completar el registro.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Error al completar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.modalBox}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>Completa tu perfil</Text>
              <Text style={styles.subtitle}>Para continuar, ingresa un nombre de usuario y una contraseña</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Nombre de usuario"
                autoCapitalize="none"
                placeholderTextColor="#94a3b8"
                autoCorrect={false}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry
                autoComplete="password-new"
                placeholderTextColor="#94a3b8"
                returnKeyType="done"
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {success ? <Text style={styles.success}>¡Perfil actualizado!</Text> : null}
              <TouchableOpacity
                style={[styles.button, loading && styles.disabled]}
                onPress={onCompleteProfile}
                disabled={loading || !username || !password}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,41,59,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 32,
    width: '98%',
    maxWidth: 420,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scrollContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    backgroundColor: '#fff',
    color: '#0f172a',
    marginBottom: 18,
    width: 320,
    maxWidth: '100%',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    textAlign: 'center',
  },
  error: {
    color: '#b91c1c',
    fontSize: 15,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  success: {
    color: '#10b981',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 18,
    alignItems: 'center',
    width: 320,
    maxWidth: '100%',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.2,
  },
});

export default CompletarPerfilModal; 