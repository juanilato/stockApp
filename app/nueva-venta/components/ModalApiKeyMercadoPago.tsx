import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ModalApiKeyMercadoPagoProps {
  visible: boolean;
  onClose: () => void;
  onSaved: (apiKey: string) => Promise<void>;
  currentApiKey?: string;
}

const ModalApiKeyMercadoPago: React.FC<ModalApiKeyMercadoPagoProps> = ({ visible, onClose, onSaved, currentApiKey = '' }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setApiKey(currentApiKey);
    }
  }, [visible, currentApiKey]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('La API Key es obligatoria');
      return;
    }
    setError('');
    setLoading(true);
    onSaved(apiKey.trim());
    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.modalBox}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Vincular MercadoPago</Text>
              <Text style={styles.subtitle}>Para generar pagos, ingresa tu Access Token de MercadoPago.</Text>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>¿Cómo obtener tu Access Token de MercadoPago?</Text>{'\n'}
                {'\n'}
                1. Ingresa a <Text style={styles.link} onPress={() => Linking.openURL('https://www.mercadopago.com.ar/developers/panel/credentials')}>https://www.mercadopago.com.ar/developers/panel/credentials</Text>{'\n'}
                2. Inicia sesión con tu cuenta de MercadoPago.{"\n"}
                3. Ve a la sección <Text style={{ fontWeight: 'bold' }}>'Credenciales de producción'</Text>.{"\n"}
                4. Copia el campo <Text style={{ fontWeight: 'bold' }}>'Access token'</Text> (NO la Public Key).{"\n"}
                5. Pega el Access Token aquí abajo y presiona Guardar.{"\n"}
                {'\n'}
                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Nunca compartas tu Access Token con nadie.</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Access Token de MercadoPago"
                value={apiKey}
                onChangeText={setApiKey}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {loading && <Text style={{ color: '#2563eb', marginBottom: 8 }}>Guardando...</Text>}
              {!loading && error === '' && apiKey && <Text style={{ color: '#22c55e', marginBottom: 8 }}>¡Access Token guardado correctamente!</Text>}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={loading}>
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, loading && styles.disabled]} onPress={async () => {
                  if (!apiKey.trim()) {
                    setError('El Access Token es obligatorio');
                    return;
                  }
                  setError('');
                  setLoading(true);
                  try {
                    await onSaved(apiKey.trim());
                  } catch (e) {
                    setError('No se pudo guardar el Access Token. Intenta de nuevo.');
                  }
                  setLoading(false);
                }} disabled={loading || !apiKey.trim()}>
                  <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
                </TouchableOpacity>
              </View>
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
    marginBottom: 14,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 18,
    textAlign: 'center',
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
    minWidth: 220,
    maxWidth: 340,
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    marginRight: 6,
  },
  cancelButtonText: {
    color: '#1e293b',
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

export default ModalApiKeyMercadoPago; 