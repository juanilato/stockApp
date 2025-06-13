import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../styles/theme'; // Ajustá según tu estructura

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('2%'),
    minHeight: hp('75%'),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  title: {
    fontSize: RFValue(17),
    fontWeight: '700',
    color: colors.text,
  },

  body: {
    flexGrow: 1,
  },

  input: {
    backgroundColor: colors.inputBg,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    fontSize: RFValue(14),
    color: colors.strongText,
    marginBottom: hp('1.5%'),
  },

  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp('1.8%'),
    borderRadius: wp('10%'),
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },

  saveButtonText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: '#334155', // Podrías definir `colors.subText` si querés centralizar este color
    marginBottom: hp('1.2%'),
  },

  emptyText: {
    fontSize: RFValue(13),
    color: colors.placeholder,
    textAlign: 'center',
    marginBottom: hp('2%'),
  },

  variantList: {
    gap: hp('1.5%'),
  },

  variantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: wp('3.5%'),
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('4%'),
  },

  variantInfo: {
    flex: 1,
  },

  variantName: {
    fontSize: RFValue(14),
    fontWeight: '600',
    color: colors.strongText,
    marginBottom: hp('0.5%'),
  },

  variantStock: {
    fontSize: RFValue(13),
    color: colors.secondary,
  },

  variantActions: {
    flexDirection: 'row',
    gap: wp('3%'),
  },
});
