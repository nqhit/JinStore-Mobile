import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  profile: {
    paddingTop: 20,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: COLORS.black_032,
  },
});

export default styles;
