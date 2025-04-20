"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Share,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"
import { Ionicons } from "@expo/vector-icons"

const DealDetailsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { deal, userInfo } = route.params

  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [savesCount, setSavesCount] = useState(deal.savedBy ? deal.savedBy.length : 0)

  const discountPercentage = Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)

  useEffect(() => {
    // Check if the deal is saved by the current user
    const checkIfSaved = async () => {
      if (userInfo && userInfo.userType === "customer" && deal.savedBy) {
        const token = await AsyncStorage.getItem("userToken")
        if (!token) return

        try {
          const response = await fetch(`${API_URL}/api/deals/${deal._id}`, {
            headers: {
              "x-auth-token": token,
            },
          })

          if (response.ok) {
            const updatedDeal = await response.json()
            setIsSaved(updatedDeal.savedBy.includes(userInfo.id))
            setSavesCount(updatedDeal.savedBy.length)
          }
        } catch (error) {
          console.error("Error checking saved status:", error)
        }
      }
    }

    checkIfSaved()
  }, [deal._id, userInfo])

  const handleSave = async () => {
    if (userInfo.userType !== "customer") {
      return
    }

    setIsLoading(true)

    try {
      const token = await AsyncStorage.getItem("userToken")

      const response = await fetch(`${API_URL}/api/deals/${deal._id}/save`, {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to update saved status")
      }

      setIsSaved(!isSaved)
      setSavesCount(isSaved ? savesCount - 1 : savesCount + 1)
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing deal: ${deal.title} - ${deal.discount} at ${deal.businessName}! Valid until ${new Date(deal.validUntil).toLocaleDateString()}`,
      })
    } catch (error) {
      Alert.alert("Error", "Failed to share deal")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: deal.image }} style={styles.dealImage} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{deal.title}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          </View>
        </View>

        <Text style={styles.businessName}>By {deal.businessName}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</Text>
          <Text style={styles.discountedPrice}>${deal.discountedPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{deal.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#FF6B6B" />
            <Text style={styles.locationText}>{deal.location}</Text>
          </View>
        </View>

        {deal.promoCode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Promo Code</Text>
            <View style={styles.promoCodeContainer}>
              <Text style={styles.promoCode}>{deal.promoCode}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  // Copy to clipboard functionality would go here
                  Alert.alert("Copied", "Promo code copied to clipboard")
                }}
              >
                <Ionicons name="copy-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valid Until</Text>
          <View style={styles.validUntilContainer}>
            <Ionicons name="calendar-outline" size={20} color="#FF6B6B" />
            <Text style={styles.validUntilText}>{new Date(deal.validUntil).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {userInfo && userInfo.userType === "customer" && (
            <TouchableOpacity
              style={[styles.actionButton, isSaved && styles.savedButton]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>{isSaved ? "Saved" : "Save Deal"}</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="bookmark" size={16} color="#666" />
            <Text style={styles.statText}>{savesCount} saves</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.statText}>Posted on {new Date(deal.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  dealImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  discountBadge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  discountText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  businessName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  promoCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
  },
  copyButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  validUntilContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  validUntilText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  savedButton: {
    backgroundColor: "#4CAF50",
  },
  shareButton: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
})

export default DealDetailsScreen

