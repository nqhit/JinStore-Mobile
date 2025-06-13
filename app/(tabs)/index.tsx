import styles from '@/assets/styles/HomeScreen.styles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { logoutSuccess } from '@/redux/authSlice';
import { createAxios } from '@/utils/createInstance';
import { AntDesign } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function HomeScreen() {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  console.log(user);
  const id = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  const axiosJWT_V2 = createAxios(user, dispatch, logoutSuccess);
  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <ThemedView style={styles.contentContainer} lightColor="white" darkColor="black">
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image
                  style={styles.tinyLogo}
                  source={{
                    uri: `https://res.cloudinary.com/dqxb7pkdv/image/upload/v1749722596/GreenStore/users/nv4wx0lvxauyyadkr6k5.png`,
                  }}
                />
                <View style={styles.headerInfo}>
                  <ThemedText style={styles.TextName}>{user.fullname}</ThemedText>
                  <Text style={styles.SubText}>Let&#39;s go shopping</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity>
                  <AntDesign name="search1" size={20} color="#EA4335" />
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>
        </View>
      </SafeAreaView>
    </>
  );
}
