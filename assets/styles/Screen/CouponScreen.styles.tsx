import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    position: 'absolute',
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    zIndex: 1,
    // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default styles;
