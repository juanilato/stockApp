import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../../styles/theme';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
  },
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: colors.gray[50],
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  borderRadius: borderRadius.lg,
  marginBottom: spacing.lg,
  borderBottomWidth: 1,
  borderColor: colors.gray[200],
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
},

title: {
  fontSize: 20,
  fontWeight: '700',
  color: colors.gray[900],
  letterSpacing: 0.2,
},

  body: {
    gap: 20,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[800],
  },
  itemInfo: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 4,
  },
  empty: {
    color: colors.gray[500],
    fontSize: typography.sizes.base,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  materialList: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    maxHeight: 240,
    overflow: 'hidden',
  },
  materialBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  materialSelected: {
    backgroundColor: colors.primary[50],
  },
  materialName: {
    fontSize: typography.sizes.base,
    fontWeight: '500',
    color: colors.gray[800],
  },
  materialDetails: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: colors.gray[900],
    marginTop: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.gray[400],
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  componenteItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.gray[200],
  backgroundColor: '#ffffff',
  borderRadius: borderRadius.sm,
  marginBottom: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},

componenteInfo: {
  flex: 1,
},

componenteNombre: {
  fontSize: typography.sizes.base,
  fontWeight: '600',
  color: colors.gray[800],
},

componenteDetalles: {
  fontSize: typography.sizes.sm,
  color: colors.gray[600],
  marginTop: 2,
},

});
