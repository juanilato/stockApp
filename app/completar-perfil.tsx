import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FloatingLabelInput from '../components/FloatingLabel';

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
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Completa tu perfil</Text>
              <Text style={styles.subtitle}>Para continuar, ingresa un nombre de usuario y una contraseña</Text>
              <FloatingLabelInput label="Nombre de usuario" value={username} onChangeText={setUsername} autoCapitalize="none" />
              <FloatingLabelInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password-new" />
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
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '94%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
  },
  scrollContent: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 18,
    textAlign: 'center',
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  success: {
    color: '#10b981',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
    alignItems: 'center',
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CompletarPerfilModal; 