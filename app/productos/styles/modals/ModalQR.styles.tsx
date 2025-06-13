import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme'; // ajustá el path según tu estructura

export const styles = StyleSheet.create({
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    minHeight: 220,
  },

  body: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    minHeight: 250,
  },

  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    minHeight: '60%',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    justifyContent: 'flex-end',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },

  qrText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.strongText,
    marginTop: 12,
  },

  qrVarianteText: {
    fontSize: 13,
    color: colors.secondary,
  },

  qrPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
    marginTop: 4,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },

  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondaryButtonBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },

  buttonSecondaryText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
});
