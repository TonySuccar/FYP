import { TouchableOpacity, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

type ButtonProps = {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  onPress: () => void;
  image?: ImageSourcePropType;
};

export default function CustomButton({
  text,
  backgroundColor = '#0D0D0D',
  textColor = 'white',
  onPress,
  image,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7} // Adds a nice click effect
    >
      {image && <Image source={image} style={styles.buttonImage} />}
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 250,
    height: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    flexDirection: 'row', // Arrange image and text in a row
  },
  buttonText: {
    fontSize: 15,
    position:'absolute',
    fontWeight:"500",
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 200,
    resizeMode: 'contain',
  },
});
