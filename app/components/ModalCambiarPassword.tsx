import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (current: string, nueva: string, repetir: string) => void;
  feedback?: string;
}

const ModalCambiarPassword: React.FC<Props> = ({ visible, onClose, onSave, feedback }) => {
  const [current, setCurrent] = useState('');
  const [nueva, setNueva] = useState('');
  const [repetir, setRepetir] = useState('');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.modalBox}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#1e293b" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Cambiar contraseña</Text>
              <Text style={styles.label}>Contraseña actual</Text>
              <TextInput
                style={styles.input}
                value={current}
                onChangeText={setCurrent}
                placeholder="Contraseña actual"
                secureTextEntry
              />
              <Text style={styles.label}>Nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={nueva}
                onChangeText={setNueva}
                placeholder="Nueva contraseña"
                secureTextEntry
              />
              <Text style={styles.label}>Repetir nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={repetir}
                onChangeText={setRepetir}
                placeholder="Repetir nueva contraseña"
                secureTextEntry
              />
              <TouchableOpacity style={styles.saveButton} onPress={() => onSave(current, nueva, repetir)}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 18,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    alignSelf: 'flex-start',
    marginBottom: 2,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
    minWidth: 220,
    maxWidth: 340,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
    width: '100%',
    maxWidth: 340,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  feedback: {
    color: '#10b981',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default ModalCambiarPassword; 