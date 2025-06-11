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
    gap: spacing.md,
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

  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginTop: spacing.sm,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: typography.sizes.base,
    fontWeight: '700',
  },

  sectionTitle: {
    marginTop: spacing.lg,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.gray[800],
  },

  varianteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  varianteInfo: {
    flex: 1,
  },

  varianteNombre: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },

  varianteStock: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },

  varianteActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginLeft: spacing.md,
  },

  varianteButton: {
    padding: 4,
  },

  emptyText: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: typography.sizes.base,
    color: colors.gray[500],
  },
});
