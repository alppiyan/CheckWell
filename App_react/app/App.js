import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Animated,
  View,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
  Linking
} from "react-native";
import LottieView from "lottie-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import ProductDetail from "./ProductDetail";

const { width, height } = Dimensions.get("window");
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MainScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/logo_check.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.mainContainer}>
        <Animated.View style={[styles.centered, { opacity: fadeAnim }]}> 
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Scan")}> 
              <LottieView
                source={require("../assets/animations/heartbeat.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
            </TouchableOpacity>
            <Text style={styles.welcomeText}>Sağlığını Tara!</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const ScanScreen = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave1, { toValue: 1, duration: 4000, useNativeDriver: false }),
        Animated.timing(wave1, { toValue: 0, duration: 4000, useNativeDriver: false }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wave2, { toValue: 0, duration: 4000, useNativeDriver: false }),
        Animated.timing(wave2, { toValue: 1, duration: 4000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handleSend = async () => {
    if (inputValue.trim() === "") {
      setErrorMessage("Lütfen bir barkod girin.");
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.20:5000/api/product/', {
        barcode: inputValue
      });

      const { product, health } = response.data;
      navigation.navigate("ProductDetail", { product, health });

    } catch (error) {
      console.error(error);
      setErrorMessage("Ürün bulunamadı veya sunucu hatası.");
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const interpolateColor = (waveValue, color1, color2) => {
    return waveValue.interpolate({
      inputRange: [0, 1],
      outputRange: [color1, color2],
    });
  };

  

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                        <Animated.View style={[styles.container, { backgroundColor: interpolateColor(wave1, "#fbc2eb", "#a6c1ee") }]}>
                              <Text style={styles.logoText}>CheckWell</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Barkodunuzu girin"
              placeholderTextColor="#aaa"
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                setErrorMessage("");
              }}
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </View>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSend}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>Gönder</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default App;



const styles = StyleSheet.create({
  lottieContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  scanLottie: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  scanLabel: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logoText: { fontSize: 48, fontWeight: "bold", color: "#fff", marginBottom: 30, textAlign: "center" },
  inputContainer: { width: "100%", marginBottom: 20 },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 18,
    fontSize: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "#ff4d4d",
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  mainContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  welcomeText: { fontSize: 32, fontWeight: "bold", color: "#333", marginBottom: 20, textAlign: "center" },
  lottie: {
    width: 150,
    height: 150,
  },
  mainButton: {
    backgroundColor: "#03dac6",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
});
