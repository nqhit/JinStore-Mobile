import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
  },

  header: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },

  body: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
    height: 1000,
  },
});

export default styles;
