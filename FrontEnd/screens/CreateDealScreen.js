// "use client"

// import { useState } from "react"
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native"
// import { useNavigation } from "@react-navigation/native"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import DateTimePicker from "@react-native-community/datetimepicker"
// import { API_URL } from "../config"
// import { Ionicons } from "@expo/vector-icons"

// const categories = [
//   { id: "fashion", name: "Fashion", icon: "shirt-outline" },
//   { id: "restaurant", name: "Restaurants", icon: "restaurant-outline" },
//   { id: "electronics", name: "Electronics", icon: "hardware-chip-outline" },
//   { id: "movies", name: "Movies", icon: "film-outline" },
//   { id: "travel", name: "Travel", icon: "airplane-outline" },
//   { id: "other", name: "Other", icon: "grid-outline" },
// ]

// const CreateDealScreen = () => {
//   const navigation = useNavigation()

//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [category, setCategory] = useState("")
//   const [discount, setDiscount] = useState("")
//   const [originalPrice, setOriginalPrice] = useState("")
//   const [discountedPrice, setDiscountedPrice] = useState("")
//   const [location, setLocation] = useState("")
//   const [promoCode, setPromoCode] = useState("")
//   const [validUntil, setValidUntil] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // Default 7 days from now
//   const [showDatePicker, setShowDatePicker] = useState(false)
//   const [image, setImage] = useState("https://via.placeholder.com/400x200?text=Upload+Deal+Image")
//   const [isLoading, setIsLoading] = useState(false)

//   const handleDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || validUntil
//     setShowDatePicker(Platform.OS === "ios")
//     setValidUntil(currentDate)
//   }

//   const handleSubmit = async () => {
//     if (!title || !description || !category || !discount || !originalPrice || !discountedPrice || !location) {
//       Alert.alert("Error", "Please fill in all required fields")
//       return
//     }

//     if (isNaN(Number.parseFloat(originalPrice)) || isNaN(Number.parseFloat(discountedPrice))) {
//       Alert.alert("Error", "Prices must be valid numbers")
//       return
//     }

//     if (Number.parseFloat(discountedPrice) >= Number.parseFloat(originalPrice)) {
//       Alert.alert("Error", "Discounted price must be less than original price")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const token = await AsyncStorage.getItem("userToken")

//       const response = await fetch(`${API_URL}/api/deals`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-auth-token": token,
//         },
//         body: JSON.stringify({
//           title,
//           description,
//           category,
//           discount,
//           originalPrice: Number.parseFloat(originalPrice),
//           discountedPrice: Number.parseFloat(discountedPrice),
//           location,
//           validUntil,
//           promoCode,
//           image,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.msg || "Failed to create deal")
//       }

//       Alert.alert("Success", "Your deal has been created successfully!", [
//         {
//           text: "OK",
//           onPress: () => navigation.navigate("Dashboard"),
//         },
//       ])
//     } catch (error) {
//       Alert.alert("Error", error.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Create New Deal</Text>
//         </View>

//         <View style={styles.formContainer}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Title *</Text>
//             <TextInput style={styles.input} placeholder="Enter deal title" value={title} onChangeText={setTitle} />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Category *</Text>
//             <View style={styles.categoryContainer}>
//               {categories.map((cat) => (
//                 <TouchableOpacity
//                   key={cat.id}
//                   style={[styles.categoryButton, category === cat.id && styles.categoryButtonActive]}
//                   onPress={() => setCategory(cat.id)}
//                 >
//                   <Ionicons name={cat.icon} size={20} color={category === cat.id ? "#fff" : "#666"} />
//                   <Text style={[styles.categoryButtonText, category === cat.id && styles.categoryButtonTextActive]}>
//                     {cat.name}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Description *</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="Describe your deal"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={4}
//               textAlignVertical="top"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Discount *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="E.g., 20% OFF, Buy 1 Get 1 Free"
//               value={discount}
//               onChangeText={setDiscount}
//             />
//           </View>

//           <View style={styles.priceInputRow}>
//             <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
//               <Text style={styles.label}>Original Price *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="0.00"
//                 value={originalPrice}
//                 onChangeText={setOriginalPrice}
//                 keyboardType="decimal-pad"
//               />
//             </View>
//             <View style={[styles.inputContainer, { flex: 1 }]}>
//               <Text style={styles.label}>Discounted Price *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="0.00"
//                 value={discountedPrice}
//                 onChangeText={setDiscountedPrice}
//                 keyboardType="decimal-pad"
//               />
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Location *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter store location"
//               value={location}
//               onChangeText={setLocation}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Promo Code (Optional)</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter promo code if applicable"
//               value={promoCode}
//               onChangeText={setPromoCode}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Valid Until *</Text>
//             <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
//               <Text style={styles.dateText}>{validUntil.toLocaleDateString()}</Text>
//               <Ionicons name="calendar-outline" size={20} color="#666" />
//             </TouchableOpacity>
//             {showDatePicker && (
//               <DateTimePicker
//                 value={validUntil}
//                 mode="date"
//                 display="default"
//                 onChange={handleDateChange}
//                 minimumDate={new Date()}
//               />
//             )}
//           </View>

//           <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
//             {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Deal</Text>}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9f9f9",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   header: {
//     backgroundColor: "#FF6B6B",
//     padding: 20,
//     paddingTop: 40,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   formContainer: {
//     padding: 15,
//   },
//   inputContainer: {
//     marginBottom: 15,
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
//     backgroundColor: "#fff",
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   categoryContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 5,
//   },
//   categoryButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   categoryButtonActive: {
//     backgroundColor: "#FF6B6B",
//   },
//   categoryButtonText: {
//     fontSize: 14,
//     color: "#666",
//     marginLeft: 5,
//   },
//   categoryButtonTextActive: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   priceInputRow: {
//     flexDirection: "row",
//   },
//   datePickerButton: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     padding: 12,
//     backgroundColor: "#fff",
//   },
//   dateText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   button: {
//     backgroundColor: "#FF6B6B",
//     borderRadius: 5,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// })

// export default CreateDealScreen

"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker from "@react-native-community/datetimepicker"
import { API_URL } from "../config"
import { Ionicons } from "@expo/vector-icons"

const categories = [
  { id: "fashion", name: "Fashion", icon: "shirt-outline" },
  { id: "restaurant", name: "Restaurants", icon: "restaurant-outline" },
  { id: "electronics", name: "Electronics", icon: "hardware-chip-outline" },
  { id: "movies", name: "Movies", icon: "film-outline" },
  { id: "travel", name: "Travel", icon: "airplane-outline" },
  { id: "other", name: "Other", icon: "grid-outline" },
]

const CreateDealScreen = () => {
  const navigation = useNavigation()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [discount, setDiscount] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountedPrice, setDiscountedPrice] = useState("")
  const [location, setLocation] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || validUntil
    setShowDatePicker(Platform.OS === "ios")
    setValidUntil(currentDate)
  }

  const handleSubmit = async () => {
    if (!title || !description || !category || !discount || !originalPrice || !discountedPrice || !location) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    if (isNaN(Number.parseFloat(originalPrice)) || isNaN(Number.parseFloat(discountedPrice))) {
      Alert.alert("Error", "Prices must be valid numbers")
      return
    }

    if (Number.parseFloat(discountedPrice) >= Number.parseFloat(originalPrice)) {
      Alert.alert("Error", "Discounted price must be less than original price")
      return
    }

    setIsLoading(true)

    try {
      const token = await AsyncStorage.getItem("userToken")

      const response = await fetch(`${API_URL}/api/deals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          discount,
          originalPrice: Number.parseFloat(originalPrice),
          discountedPrice: Number.parseFloat(discountedPrice),
          location,
          validUntil,
          promoCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.msg || "Failed to create deal")
      }

      Alert.alert("Success", "Your deal has been created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Dashboard"),
        },
      ])
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Deal</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput style={styles.input} placeholder="Enter deal title" value={title} onChangeText={setTitle} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryButton, category === cat.id && styles.categoryButtonActive]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Ionicons name={cat.icon} size={20} color={category === cat.id ? "#fff" : "#666"} />
                  <Text style={[styles.categoryButtonText, category === cat.id && styles.categoryButtonTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your deal"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Discount *</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., 20% OFF, Buy 1 Get 1 Free"
              value={discount}
              onChangeText={setDiscount}
            />
          </View>

          <View style={styles.priceInputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Original Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={originalPrice}
                onChangeText={setOriginalPrice}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Discounted Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={discountedPrice}
                onChangeText={setDiscountedPrice}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter store location"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Promo Code (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter promo code if applicable"
              value={promoCode}
              onChangeText={setPromoCode}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valid Until *</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{validUntil.toLocaleDateString()}</Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={validUntil}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Deal</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#FF6B6B",
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    padding: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#FF6B6B",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  categoryButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  priceInputRow: {
    flexDirection: "row",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FF6B6B",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default CreateDealScreen
