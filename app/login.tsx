import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FloatingLabelInput from '../components/FloatingLabel';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'ventasapp' });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (startOAuth: any, provider: string) => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const { createdSessionId, setActive } = await startOAuth({ redirectUrl: redirectUri });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      } else {
        setError(`No se pudo registrar o iniciar sesión con ${provider}.`);
      }
    } catch (err: any) {
      setError(`Error al iniciar sesión con ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.outer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.iconWrapper}>
  
            <Image source={require('../assets/images/icon.png')} style={styles.icon} />
    
        </View>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>Accede a tu cuenta</Text>
          </View>

          <View style={styles.socialContainer}>
            {(Platform.OS === 'android' || Platform.OS === 'ios') && (
              <TouchableOpacity 
                style={[styles.socialButton, loading && styles.socialButtonDisabled]} 
                onPress={() => handleOAuth(startGoogleOAuth, 'Google')}
                disabled={loading}
                activeOpacity={0.8}
              >
                <AntDesign name="google" size={20} color="#222" />
                <Text style={styles.socialButtonText}>Entrar con Google</Text>
              </TouchableOpacity>
            )}
            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={[styles.socialButton, styles.appleButton, loading && styles.socialButtonDisabled]} 
                onPress={() => handleOAuth(startAppleOAuth, 'Apple')}
                disabled={loading}
                activeOpacity={0.8}
              >
                <FontAwesome name="apple" size={20} color="#fff" />
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>Entrar con Apple</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>o con tu email</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.formContainer}>
            <FloatingLabelInput
              label="Correo electrónico"
              value={emailAddress}
              onChangeText={setEmailAddress}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
            />
            <FloatingLabelInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoComplete="password"
            />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
            <TouchableOpacity 
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} 
              onPress={onSignInPress} 
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</Text>
            </TouchableOpacity>
          </View>

 
        </View>
        <View style={styles.footer}>
          <Link href="/signup" asChild>
            <Pressable style={styles.link}>
              <Text style={styles.linkText}>¿No tienes una cuenta? <Text style={styles.linkAccent}>Regístrate</Text></Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,

  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },

  icon: {
    width: 90,
    height: 90,
    borderRadius: 24,

    resizeMode: 'contain',

  },
  card: {
    width: '100%',
    maxWidth: 400,

    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 12,
    marginBottom: 18,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#222',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  socialContainer: {
    marginBottom: 18,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  appleButton: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  socialButtonText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    marginLeft: 12,
  },
  appleButtonText: {
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#64748b',
    fontWeight: '500',
    fontSize: 13,
  },
  formContainer: {
    marginBottom: 0,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  primaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonDisabled: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  link: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  linkText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },
  linkAccent: {
    color: '#222',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
}); 