import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../../styles/theme';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // fondo más sutil y elegante
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  menuContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },

  menuTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  menuButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },

  cancelButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
  },

  cancelText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[600],
  },

  // MODAL de VARIANTES
  variantModal: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.gray[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  variantItem: {
    width: '100%',
    backgroundColor: colors.gray[100],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  variantText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
});
