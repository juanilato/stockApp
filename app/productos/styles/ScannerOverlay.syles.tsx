// styles/ScannerOverlay.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 180,
    borderColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  laser: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#ffffff',
    opacity: 0.7,
  },
  edges: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#ffffff',
  },
  edgeTopLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  edgeTopRight: {
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  edgeBottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  edgeBottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
});
