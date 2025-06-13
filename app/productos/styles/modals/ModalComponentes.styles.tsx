import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../styles/theme'; // Ajustá el path si está en otro lado

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('20%'),
    minHeight: hp('75%'),
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },

  title: {
    fontSize: RFValue(17),
    fontWeight: '700',
    color: colors.text,
  },

  body: {
    marginBottom: hp('1.5%'),
  },

  sectionTitle: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#334155', // opcional: podés crear `colors.subText` si lo usás mucho
    marginVertical: hp('1.2%'),
  },

  empty: {
    fontSize: RFValue(13),
    color: colors.placeholder,
    textAlign: 'center',
    paddingVertical: hp('1.5%'),
  },

  componenteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  componenteInfo: {
    flex: 1,
  },

  componenteNombre: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: colors.text,
  },

  componenteDetalles: {
    fontSize: RFValue(13),
    color: colors.secondary,
  },

  materialList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2.5%'),
    marginBottom: hp('1.5%'),
  },

  materialBox: {
    backgroundColor: colors.background,
    padding: hp('1.2%'),
    borderRadius: wp('3.5%'),
    width: wp('48%'),
  },

  materialSelected: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#e0f2fe', // Podés crear `colors.primarySoft` si querés manejarlo desde el theme
  },

  materialName: {
    fontSize: RFValue(13),
    fontWeight: '600',
    color: colors.strongText,
  },

  materialDetails: {
    fontSize: RFValue(12),
    color: colors.secondary,
  },

  input: {
    backgroundColor: '#f1f5f9', // Podés agregar `colors.inputBackground`
    borderRadius: wp('3.5%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    fontSize: RFValue(14),
    color: colors.strongText,
    marginBottom: hp('2%'),
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: hp('1.5%'),
    borderRadius: wp('8%'),
    alignItems: 'center',
    marginBottom: hp('5%'),
  },

  buttonDisabled: {
    backgroundColor: '#cbd5e1', // Podés crear `colors.disabled` si lo usás seguido
  },

  buttonText: {
    color: '#ffffff',
    fontSize: RFValue(14),
    fontWeight: '600',
  },

  componentList: {
    gap: hp('1.5%'),
    marginBottom: hp('2%'),
  },

  componentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: wp('3.5%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },

  componentInfo: {
    flex: 1,
  },

  componentName: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: colors.strongText,
    marginBottom: hp('0.5%'),
  },

  componentDetails: {
    fontSize: RFValue(13),
    color: colors.secondary,
  },
});
