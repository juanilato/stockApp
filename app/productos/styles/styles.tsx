import { StyleSheet } from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  lista: {
    flex: 1,
  },
  listaContent: {
    padding: 16,
    paddingBottom: 80,
  },
  productoItem: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  productoInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  productoDetails: {
    flexDirection: 'row',
    gap: 4,
  },
  productoPrecio: {
    fontSize: 14,
    color: '#10b981',
  },
  productoPrecioCosto: {
    fontSize: 14,
    color: '#f59e0b',
  },
  productoStock: {
    fontSize: 14,
    color: '#3b82f6',
  },
  productoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  editButton: {
    backgroundColor: colors.info,
  },
  componentesButton: {
    backgroundColor: colors.success,
  },
  qrButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[800],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
}); 