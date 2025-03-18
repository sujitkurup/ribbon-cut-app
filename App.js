import React, { useState } from 'react';
import { View, Text, TextInput, Image, PanResponder, Animated, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Picker } from '@react-native-picker/picker';

const RibbonCutApp = () => {
  const [logo, setLogo] = useState(null);
  const [cut, setCut] = useState(false);
  const [ribbonText, setRibbonText] = useState("Grand Opening");
  const [showRibbonText, setShowRibbonText] = useState(true);
  const [ribbonColor, setRibbonColor] = useState('red');
  const ribbonAnimation = new Animated.Value(1);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('./assets/scissors.mp3'));
    await sound.playAsync();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > 50 || Math.abs(gestureState.dy) > 50) {
        playSound();
        Animated.timing(ribbonAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => setCut(true));
      }
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      {!cut ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Swipe to Cut</Text>
          <TextInput
            style={{
              height: 40,
              width: 200,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 10,
              textAlign: 'center',
              borderRadius: 5,
            }}
            placeholder="Enter Ribbon Text"
            value={ribbonText}
            onChangeText={(text) => setRibbonText(text)}
          />
          <TouchableOpacity
            onPress={() => setShowRibbonText(!showRibbonText)}
            style={{ padding: 10, backgroundColor: 'gray', borderRadius: 5, marginBottom: 10 }}>
            <Text style={{ color: 'white' }}>{showRibbonText ? 'Disable Text' : 'Enable Text'}</Text>
          </TouchableOpacity>
          
          <Text style={{ fontSize: 16, marginBottom: 5 }}>Select Ribbon Color:</Text>
          <Picker
            selectedValue={ribbonColor}
            style={{ height: 50, width: 200, marginBottom: 20 }}
            onValueChange={(itemValue) => setRibbonColor(itemValue)}
          >
            <Picker.Item label="Red" value="red" />
            <Picker.Item label="Blue" value="blue" />
            <Picker.Item label="Green" value="green" />
            <Picker.Item label="Yellow" value="yellow" />
            <Picker.Item label="Purple" value="purple" />
          </Picker>
          
          <View {...panResponder.panHandlers} style={{ alignItems: 'center' }}>
            <Animated.View
              style={{
                width: 250,
                height: 40,
                backgroundColor: ribbonColor,
                opacity: ribbonAnimation,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {showRibbonText && <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{ribbonText}</Text>}
            </Animated.View>
          </View>
        </View>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Congratulations!</Text>
          {logo ? <Image source={{ uri: logo }} style={{ width: 200, height: 200 }} /> : <Text>Upload Your Logo</Text>}
          <TouchableOpacity onPress={pickImage} style={{ padding: 10, backgroundColor: 'blue', marginTop: 20, borderRadius: 10 }}>
            <Text style={{ color: 'white' }}>Upload Logo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RibbonCutApp;
