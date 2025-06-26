import { Dimensions, StyleSheet } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },

  body: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 15,
    gap: 10,
  },

  containerCheckBoxAll: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 8,
  },

  btnCheckBoxAll: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    color: 'red',
    gap: 10,
  },

  selectAll: {
    fontSize: 16,
    fontWeight: 'normal',
    flexDirection: 'row',
    alignItems: 'center',
  },

  footer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidth - 30,
  },

  notiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth - 30,
  },

  notification: {
    fontSize: 16,
    fontWeight: '400',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'red',
  },

  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 32,
  },

  btnCheckout: {
    width: '100%',
    height: 50,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },

  textCheckout: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default styles;
