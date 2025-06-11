import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../../styles/theme';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  modalContent: {
    width: '100%',
    maxWidth: 400,
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
    marginBottom: spacing.lg,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },

  qrContainer: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  qrText: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginTop: spacing.md,
  },

  qrVarianteText: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    marginTop: 2,
  },

  qrPrice: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: spacing.sm,
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    shadowRadius: 4,
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
