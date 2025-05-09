import { View, Text, StyleSheet,Image } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';

export default function WelcomeScreen() {
  const router = useRouter();
  // Update the image path to your actual Google icon file.
  const googleIcon = require('../../assets/images/google.png');

  return (
    <View style={styles.container}>
       <Image source={require('../../assets/images/images.png')} style={styles.illustration} resizeMode="contain" />
      <Text style={styles.title}>Welcome!</Text>

      <CustomButton
        text="Log In"
        textColor="white"
        onPress={() => router.push('/(auth)/login')}
      />

      <CustomButton
        text="Sign Up"
        backgroundColor="#B8B8BB"
        textColor="black"
        onPress={() => router.push('/(auth)/signup')}
      />

      {/* Separator with "or" */}
      {/* <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separatorLine} />
      </View> */}

      {/* Continue with Google Button using the updated CustomButton */}
      {/* <CustomButton
        text="Continue with Google"
        backgroundColor="#B8B8BB"
        textColor="black"
        onPress={() => console.log('Google sign-in')}
        image={googleIcon}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#FFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D3D3D3',
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#808080',
  },
  illustration: {
    width: 220,
    height: 180,
    marginBottom: 20,
    alignSelf: 'center',
  },
});
