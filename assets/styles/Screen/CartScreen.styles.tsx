import { StyleSheet } from 'react-native';

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
    paddingBottom: 10,
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
});

export default styles;
