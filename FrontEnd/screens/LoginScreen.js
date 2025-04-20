// "use client"

// import { useState } from "react"
// import {
//   StyleSheet, Text,View,TextInput, TouchableOpacity,Image,ScrollView,Alert,ActivityIndicator,} from "react-native"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { API_URL } from "../config"

// const LoginScreen = ({ navigation, route }) => {
//   const { setUserToken, setUserInfo } = route.params
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please fill in all fields")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const response = await fetch(`${API_URL}/api/users/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.msg || "Login failed")
//       }

//       // Save token and user info
//       await AsyncStorage.setItem("userToken", data.token)
//       await AsyncStorage.setItem("userInfo", JSON.stringify(data.user))

//       // Update app state
//       setUserToken(data.token)
//       setUserInfo(data.user)
//     } catch (error) {
//       Alert.alert("Login Failed", error.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
//         <Text style={styles.title}>SavrGo</Text>
//         <Text style={styles.subtitle}>Discover amazing deals and offers</Text>
//       </View>

//       <View style={styles.formContainer}>
//         <Text style={styles.formTitle}>Login</Text>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Email</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Password</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your password"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
//           {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
//         </TouchableOpacity>

//         <View style={styles.registerContainer}>
//           <Text style={styles.registerText}>Don't have an account? </Text>
//           <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//             <Text style={styles.registerLink}>Register</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#f9f9f9",
//     padding: 20,
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginTop: 30,
//     marginBottom: 30,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#FF6B6B",
//     marginTop: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginTop: 5,
//   },
//   formContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   formTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   inputContainer: {
//     marginBottom: 15,
//     fontFamily:"arial"
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: "#f9f9f9",
//   },
//   button: {
//     backgroundColor: "#FF6B6B",
//     borderRadius: 5,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   registerContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   registerText: {
//     color: "#666",
//     fontSize: 16,
//   },
//   registerLink: {
//     color: "#FF6B6B",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// })

// export default LoginScreen

"use client"

import { useState } from "react"
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, Image,
  ScrollView, Alert, ActivityIndicator
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"

const LoginScreen = ({ navigation, route }) => {
  const { setUserToken, setUserInfo } = route.params
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || "Login failed")
      }

      await AsyncStorage.setItem("userToken", data.token)
      await AsyncStorage.setItem("userInfo", JSON.stringify(data.user))

      setUserToken(data.token)
      setUserInfo(data.user)
    } catch (error) {
      Alert.alert("Login Failed", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>SavrGo</Text>
        <Text style={styles.subtitle}>Amazing deals, just for you</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Welcome Back 👋</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f8",
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff5a5f",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  button: {
    backgroundColor: "#ff5a5f",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#666",
    fontSize: 15,
  },
  registerLink: {
    color: "#ff5a5f",
    fontWeight: "bold",
    fontSize: 15,
  },
})

export default LoginScreen
