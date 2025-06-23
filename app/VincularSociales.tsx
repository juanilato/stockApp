import { useOAuth, useUser } from '@clerk/clerk-expo';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

export default function VincularSociales() {
  const { user } = useUser();

  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });

  const vincularCuenta = async (startOAuth: any, provider: string) => {
    try {
      const { createdSessionId } = await startOAuth({ redirectUrl: undefined });
      if (!createdSessionId) {
        alert(`Cuenta de ${provider} vinculada correctamente`);
      } else {
        // Esto ocurre si Clerk crea una nueva sesión (raro en este contexto)
        alert(`Se creó una nueva sesión con ${provider}.`);
      }
    } catch (err) {
      alert(`Error al vincular con ${provider}`);
      console.error(err);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Vincular redes sociales:</Text>

      <TouchableOpacity
        onPress={() => vincularCuenta(startGoogleOAuth, 'Google')}
        style={{ padding: 10, backgroundColor: '#eee', borderRadius: 6, marginBottom: 10 }}
      >
        <Text>Vincular con Google</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity
          onPress={() => vincularCuenta(startAppleOAuth, 'Apple')}
          style={{ padding: 10, backgroundColor: '#333', borderRadius: 6 }}
        >
          <Text style={{ color: '#fff' }}>Vincular con Apple</Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 