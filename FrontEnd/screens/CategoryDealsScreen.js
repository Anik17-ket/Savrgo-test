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
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { API_URL } from "../config"

const DealItem = ({ item, onPress }) => {
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
        </View>
      </View>
    </TouchableOpacity>
  )
}

const CategoryDealsScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { category, categoryName } = route.params

  const [deals, setDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCategoryDeals = async () => {
    try {
      const response = await fetch(`${API_URL}/api/deals?category=${category}`)

      if (!response.ok) {
        throw new Error("Failed to fetch deals")
      }

      const data = await response.json()
      setDeals(data)
    } catch (error) {
      console.error("Error fetching category deals:", error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCategoryDeals()
  }, [category])

  const onRefresh = () => {
    setRefreshing(true)
    fetchCategoryDeals()
  }

  const handleDealPress = (deal) => {
    navigation.navigate("DealDetails", { deal })
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
      {deals.length > 0 ? (
        <FlatList
          data={deals}
          renderItem={({ item }) => <DealItem item={item} onPress={() => handleDealPress(item)} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.dealsList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6B6B"]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No deals available in this category</Text>
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
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  validUntil: {
    fontSize: 12,
    color: "#999",
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
  },
})

export default CategoryDealsScreen

