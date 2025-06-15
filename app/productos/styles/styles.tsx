import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors, spacing } from '../../styles/theme'; // Asegurate que el path sea correcto

export const styles = StyleSheet.create({
  productoInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

productoItemCompact: {
  backgroundColor: '#f0f9ff',             // fondo celeste pastel
  borderColor: '#c7d2fe',                 // borde azul claro
  borderWidth: 1,
  borderRadius: wp('3.4%'),
  paddingVertical: hp('1.2%'),
  paddingHorizontal: wp('3.4%'),
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 4,
  elevation: 1,
},


productoNombreCompact: {
  fontSize: wp('4%'), // Subido un poco (~16px)
  fontWeight: '700',
  color: colors.text, // '#1e293b'
  marginBottom: hp('0.5%'),
},
  productoTagsCompact: {
    flexDirection: 'row',
    gap: wp('2.4%'),
    flexWrap: 'wrap',
  },

tagCompact: {
  backgroundColor: colors.background, // '#f8fafc'
  borderRadius: wp('2.5%'),
  paddingVertical: hp('0.6%'),
  paddingHorizontal: wp('3%'),
  minWidth: wp('22%'),
  alignItems: 'center',
},
tagLabelCompact: {
  fontSize: wp('2.6%'),
  color: colors.placeholder, // '#94a3b8'
  fontWeight: '500',
  marginBottom: 2,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
},
tagValueCompact: {
  fontSize: wp('3.4%'),
  fontWeight: '600',
},
  swipeActionsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
    overflow: 'hidden',
    marginLeft: wp('-2.5%'),
  },

  swipeButton: {
    width: wp('13.5%'),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  swipeButtonEdit: {
    backgroundColor: colors.swipeEdit,
  },

  swipeButtonDelete: {
    backgroundColor: colors.swipeDelete,
    borderTopRightRadius: wp('4%'),
    borderBottomRightRadius: wp('4%'),
  },

  ball: {
  width: wp('7%'),
  height: wp('7%'),
  borderRadius: wp('3.5%'),
  backgroundColor: '#2563eb',
  marginHorizontal: wp('1.5%'),
},

  productoWrapper: {
    marginHorizontal: wp('4%'),
    marginBottom: hp('1.4%'),
    backgroundColor: colors.background,
    marginTop: hp('0.5%'),
    borderRadius: wp('4%'),
    overflow: 'hidden',
  },

  headerProductos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: hp('4.4%'),
    paddingBottom: hp('2.2%'),
    backgroundColor: colors.primary,
  },

  headerSectionLabel: {
    fontSize: wp('2.9%'),
    color: colors.placeholder,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: hp('0.2%'),
  },

  headerTitleProductos: {
    fontSize: wp('5.8%'),
    fontWeight: '700',
    color: colors.strongText,
  },

 addButtonPunch: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#2563eb', // azul profesional, podés cambiarlo si usás otro color base

  alignItems: 'center',
  justifyContent: 'center',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 6,
},

  
});
