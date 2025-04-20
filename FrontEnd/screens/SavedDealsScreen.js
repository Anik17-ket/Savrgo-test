"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"
import { Ionicons } from "@expo/vector-icons"

const DealItem = ({ item, onPress, onUnsave }) => {
  const discountPercentage = Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)

  return (
    <TouchableOpacity style={styles.dealItem} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.dealImage} />
      <View style={styles.dealContent}>
        <View style={styles.dealHeader}>
          <Text style={styles.dealTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          </View>
        </View>
        <Text style={styles.businessName}>{item.businessName}</Text>
        <Text style={styles.dealDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
          <Text style={styles.discountedPrice}>${item.discountedPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.dealFooter}>
          <Text style={styles.validUntil}>Valid until {new Date(item.validUntil).toLocaleDateString()}</Text>
          <TouchableOpacity onPress={onUnsave} style={styles.unsaveButton}>
            <Ionicons name="bookmark" size={20} color="#FF6B6B" />
            <Text style={styles.unsaveText}>Unsave</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const SavedDealsScreen = ({ route }) => {
  const navigation = useNavigation()
  const { userInfo } = route.params
  const [savedDeals, setSavedDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSavedDeals = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")

      const response = await fetch(`${API_URL}/api/deals/saved/me`, {
        headers: {
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch saved deals")
      }

      const data = await response.json()
      setSavedDeals(data)
    } catch (error) {
      console.error("Error fetching saved deals:", error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSavedDeals()

    // Refresh saved deals when the screen is focused
    const unsubscribe = navigation.addListener("focus", () => {
      fetchSavedDeals()
    })

    return unsubscribe
  }, [navigation])

  const onRefresh = () => {
    setRefreshing(true)
    fetchSavedDeals()
  }

  const handleDealPress = (deal) => {
    navigation.navigate("DealDetails", { deal, userInfo })
  }

  const handleUnsaveDeal = async (dealId) => {
    try {
      const token = await AsyncStorage.getItem("userToken")

      const response = await fetch(`${API_URL}/api/deals/${dealId}/save`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to unsave deal")
      }

      // Remove the deal from the state
      setSavedDeals(savedDeals.filter((deal) => deal._id !== dealId))
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Deals</Text>
        <Text style={styles.headerSubtitle}>Your favorite deals in one place</Text>
      </View>

      {savedDeals.length > 0 ? (
        <FlatList
          data={savedDeals}
          renderItem={({ item }) => (
            <DealItem item={item} onPress={() => handleDealPress(item)} onUnsave={() => handleUnsaveDeal(item._id)} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.dealsList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6B6B"]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>You haven't saved any deals yet</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.browseButtonText}>Browse Deals</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  dealsList: {
    padding: 15,
  },
  dealItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dealImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  dealContent: {
    padding: 15,
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  discountBadge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  businessName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  dealDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  dealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  validUntil: {
    fontSize: 12,
    color: "#999",
  },
  unsaveButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  unsaveText: {
    fontSize: 12,
    color: "#FF6B6B",
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default SavedDealsScreen

