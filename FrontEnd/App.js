// "use client"

// import { useState, useEffect } from "react"
// import { NavigationContainer } from "@react-navigation/native"
// import { createStackNavigator } from "@react-navigation/stack"
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { StatusBar } from "expo-status-bar"
// import { Ionicons } from "@expo/vector-icons"

// // Import screens
// import LoginScreen from "./screens/LoginScreen"
// import RegisterScreen from "./screens/RegisterScreen"
// import HomeScreen from "./screens/HomeScreen"
// import SavedDealsScreen from "./screens/SavedDealsScreen"
// import ProfileScreen from "./screens/ProfileScreen"
// import BusinessDashboardScreen from "./screens/BusinessDashboardScreen"
// import CreateDealScreen from "./screens/CreateDealScreen"
// import DealDetailsScreen from "./screens/DealDetailsScreen"
// import CategoryDealsScreen from "./screens/CategoryDealsScreen"

// const Stack = createStackNavigator()
// const Tab = createBottomTabNavigator()

// function CustomerTabs({ route }) {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName

//           if (route.name === "Home") {
//             iconName = focused ? "home" : "home-outline"
//           } else if (route.name === "Saved") {
//             iconName = focused ? "bookmark" : "bookmark-outline"
//           } else if (route.name === "Profile") {
//             iconName = focused ? "person" : "person-outline"
//           }

//           return <Ionicons name={iconName} size={size} color={color} />
//         },
//         tabBarActiveTintColor: "#FF6B6B",
//         tabBarInactiveTintColor: "gray",
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Saved" component={SavedDealsScreen} initialParams={route.params} />
//       <Tab.Screen name="Profile" component={ProfileScreen} initialParams={route.params} />
//     </Tab.Navigator>
//   )
// }

// function BusinessTabs({ route }) {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName

//           if (route.name === "Dashboard") {
//             iconName = focused ? "grid" : "grid-outline"
//           } else if (route.name === "Create") {
//             iconName = focused ? "add-circle" : "add-circle-outline"
//           } else if (route.name === "Profile") {
//             iconName = focused ? "person" : "person-outline"
//           }

//           return <Ionicons name={iconName} size={size} color={color} />
//         },
//         tabBarActiveTintColor: "#FF6B6B",
//         tabBarInactiveTintColor: "gray",
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Dashboard" component={BusinessDashboardScreen} initialParams={route.params} />
//       <Tab.Screen name="Create" component={CreateDealScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} initialParams={route.params} />
//     </Tab.Navigator>
//   )
// }

// export default function App() {
//   const [isLoading, setIsLoading] = useState(true)
//   const [userToken, setUserToken] = useState(null)
//   const [userInfo, setUserInfo] = useState(null)

//   const checkLoginStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken")
//       const userInfoStr = await AsyncStorage.getItem("userInfo")

//       if (token && userInfoStr) {
//         setUserToken(token)
//         setUserInfo(JSON.parse(userInfoStr))
//       }

//       setIsLoading(false)
//     } catch (error) {
//       console.log("Error checking login status:", error)
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     checkLoginStatus()
//   }, [])

//   if (isLoading) {
//     return null // Or a loading screen
//   }

//   return (
//     <NavigationContainer>
//       <StatusBar style="auto" />
//       <Stack.Navigator
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: "#FF6B6B",
//           },
//           headerTintColor: "#fff",
//           headerTitleStyle: {
//             fontWeight: "bold",
//           },
//         }}
//       >
//         {userToken === null ? (
//           // Auth screens
//           <>
//             <Stack.Screen
//               name="Login"
//               component={LoginScreen}
//               options={{ title: "SavrGo - Login" }}
//               initialParams={{ setUserToken, setUserInfo }}
//             />
//             <Stack.Screen
//               name="Register"
//               component={RegisterScreen}
//               options={{ title: "SavrGo - Register" }}
//               initialParams={{ setUserToken, setUserInfo }}
//             />
//           </>
//         ) : (
//           // App screens
//           <>
//             {userInfo && userInfo.userType === "customer" ? (
//               <>
//                 <Stack.Screen
//                   name="CustomerTabs"
//                   component={CustomerTabs}
//                   options={{ headerShown: false }}
//                   initialParams={{ userInfo, setUserToken, setUserInfo }}
//                 />
//                 <Stack.Screen
//                   name="DealDetails"
//                   component={DealDetailsScreen}
//                   options={{ title: "Deal Details" }}
//                   initialParams={{ userInfo }}
//                 />
//                 <Stack.Screen
//                   name="CategoryDeals"
//                   component={CategoryDealsScreen}
//                   options={({ route }) => ({ title: route.params.categoryName })}
//                 />
//               </>
//             ) : (
//               <>
//                 <Stack.Screen
//                   name="BusinessTabs"
//                   component={BusinessTabs}
//                   options={{ headerShown: false }}
//                   initialParams={{ userInfo, setUserToken, setUserInfo }}
//                 />
//                 <Stack.Screen
//                   name="DealDetails"
//                   component={DealDetailsScreen}
//                   options={{ title: "Deal Details" }}
//                   initialParams={{ userInfo }}
//                 />
//               </>
//             )}
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   )
// }

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"

// Import screens
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import OnBoardingScreen from "./screens/OnBoardingScreen" // Your Onboarding Screen
import HomeScreen from "./screens/HomeScreen"
import SavedDealsScreen from "./screens/SavedDealsScreen"
import ProfileScreen from "./screens/ProfileScreen"
import BusinessDashboardScreen from "./screens/BusinessDashboardScreen"
import CreateDealScreen from "./screens/CreateDealScreen"
import DealDetailsScreen from "./screens/DealDetailsScreen"
import CategoryDealsScreen from "./screens/CategoryDealsScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function CustomerTabs({ route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Saved") {
            iconName = focused ? "bookmark" : "bookmark-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Saved" component={SavedDealsScreen} initialParams={route.params} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={route.params} />
    </Tab.Navigator>
  )
}

function BusinessTabs({ route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Dashboard") {
            iconName = focused ? "grid" : "grid-outline"
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={BusinessDashboardScreen} initialParams={route.params} />
      <Tab.Screen name="Create" component={CreateDealScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={route.params} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [userToken, setUserToken] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [isFirstLaunch, setIsFirstLaunch] = useState(null)

  // Check if user has seen onboarding screen before
  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched")
      if (hasLaunched === null) {
        setIsFirstLaunch(true)
        await AsyncStorage.setItem("hasLaunched", "true") // Set the flag that onboarding has been shown
      } else {
        setIsFirstLaunch(false)
      }
    } catch (error) {
      console.log("Error checking first launch status:", error)
    }
  }

  // Check login status
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      const userInfoStr = await AsyncStorage.getItem("userInfo")

      if (token && userInfoStr) {
        setUserToken(token)
        setUserInfo(JSON.parse(userInfoStr))
      }

      setIsLoading(false)
    } catch (error) {
      console.log("Error checking login status:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkFirstLaunch()
    checkLoginStatus()
  }, [])

  if (isLoading) {
    return null // Or a loading screen
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FF6B6B",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {isFirstLaunch ? (
          // Show Onboarding Screen first if it's the user's first launch
          <Stack.Screen
            name="OnBoarding"
            component={OnBoardingScreen} // Add your onboarding screen here
            options={{ headerShown: false }}
          />
        ) : userToken === null ? (
          // Auth screens
          <>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ title: "SavrGo - Login" }}
              initialParams={{ setUserToken, setUserInfo }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "SavrGo - Register" }}
              initialParams={{ setUserToken, setUserInfo }}
            />
          </>
        ) : (
          // App screens
          <>
            {userInfo && userInfo.userType === "customer" ? (
              <>
                <Stack.Screen
                  name="CustomerTabs"
                  component={CustomerTabs}
                  options={{ headerShown: false }}
                  initialParams={{ userInfo, setUserToken, setUserInfo }}
                />
                <Stack.Screen
                  name="DealDetails"
                  component={DealDetailsScreen}
                  options={{ title: "Deal Details" }}
                  initialParams={{ userInfo }}
                />
                <Stack.Screen
                  name="CategoryDeals"
                  component={CategoryDealsScreen}
                  options={({ route }) => ({ title: route.params.categoryName })}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="BusinessTabs"
                  component={BusinessTabs}
                  options={{ headerShown: false }}
                  initialParams={{ userInfo, setUserToken, setUserInfo }}
                />
                <Stack.Screen
                  name="DealDetails"
                  component={DealDetailsScreen}
                  options={{ title: "Deal Details" }}
                  initialParams={{ userInfo }}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
