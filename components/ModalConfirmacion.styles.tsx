import { StyleSheet } from 'react-native';
import { colors } from '../styles/theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  texto: {
    fontSize: 16,
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: 20,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  boton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: colors.gray[200],
  },
  botonTextoCancelar: {
    color: colors.gray[700],
    fontWeight: '600',
  },
  botonConfirmar: {
    backgroundColor: colors.danger,
  },
  botonTextoConfirmar: {
    color: colors.white,
    fontWeight: '600',
  },
});
