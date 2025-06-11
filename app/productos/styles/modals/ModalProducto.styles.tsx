import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../../styles/theme';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // fondo más oscuro y profesional
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  modalContent: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },

  modalHeader: {
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },

  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    letterSpacing: 0.5,
  },

  modalBody: {
    gap: spacing.lg,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.base,
    backgroundColor: colors.gray[50],
    color: colors.gray[900],
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    gap: spacing.md,
  },

  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },

  modalButtonSecondary: {
    backgroundColor: colors.gray[100],
  },

  modalButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
    color: colors.white,
  },

  modalButtonTextSecondary: {
    color: colors.gray[700],
    fontWeight: '600',
  },
});
