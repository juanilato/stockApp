// productos/views/styles/modals/ModalProducto.styles.ts
import { StyleSheet } from 'react-native';
import { spacing } from '../../../styles/theme';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden', // para que el header redondeado quede integrado
  },

  // 💡 Header diferenciado
  modalHeader: {
    backgroundColor: '#f0f4ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },

  // ❌ “X” más notoria
  closeIcon: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },

  modalBody: {
    padding: spacing.lg,
  },

  // ✏️ Inputs más simples y amigables
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: spacing.md,
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },

  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },

  modalButtonPrimary: {
    backgroundColor: '#2563eb',
  },

  modalButtonSecondary: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },

  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  modalButtonTextSecondary: {
    color: '#1e293b',
  },
});
