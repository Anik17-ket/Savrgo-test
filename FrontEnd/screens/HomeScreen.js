"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
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

const CategoryItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={styles.categoryIcon}>
      <Ionicons name={item.icon} size={24} color="#FF6B6B" />
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>
)

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
          <Text style={styles.originalPrice}>Rs {item.originalPrice.toFixed(2)}</Text>
          <Text style={styles.discountedPrice}>Rs {item.discountedPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.dealFooter}>
          <Text style={styles.validUntil}>Valid until {new Date(item.validUntil).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const HomeScreen = () => {
  const navigation = useNavigation()
  const [deals, setDeals] = useState([])
  const [featuredDeals, setFeaturedDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDeals = async () => {
    try {
      const response = await fetch(`${API_URL}/api/deals`)

      if (!response.ok) {
        throw new Error("Failed to fetch deals")
      }

      const data = await response.json()

      // Set all deals
      setDeals(data)

      // Set featured deals (random selection of 5 deals)
      const shuffled = [...data].sort(() => 0.5 - Math.random())
      setFeaturedDeals(shuffled.slice(0, 5))
    } catch (error) {
      console.error("Error fetching deals:", error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchDeals()
  }

  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryDeals", {
      category: category.id,
      categoryName: category.name,
    })
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
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6B6B"]} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SavrGo</Text>
        <Text style={styles.headerSubtitle}>Discover amazing deals near you</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => <CategoryItem item={item} onPress={() => handleCategoryPress(item)} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.featuredContainer}>
        <Text style={styles.sectionTitle}>Featured Deals</Text>
        {featuredDeals.length > 0 ? (
          <FlatList
            data={featuredDeals}
            renderItem={({ item }) => <DealItem item={item} onPress={() => handleDealPress(item)} />}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        ) : (
          <Text style={styles.noDealsText}>No featured deals available</Text>
        )}
      </View>

      <View style={styles.allDealsContainer}>
        <Text style={styles.sectionTitle}>All Deals</Text>
        {deals.length > 0 ? (
          deals.map((deal) => <DealItem key={deal._id} item={deal} onPress={() => handleDealPress(deal)} />)
        ) : (
          <Text style={styles.noDealsText}>No deals available</Text>
        )}
      </View>
    </ScrollView>
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
  categoriesContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  categoriesList: {
    paddingRight: 15,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryName: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  featuredContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  featuredList: {
    paddingRight: 15,
  },
  allDealsContainer: {
    padding: 15,
    paddingBottom: 30,
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
  // dealImage: {
  //   width: "100%",
  //   height: 150,
  //   resizeMode: "cover",
  // },
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
  noDealsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
})

export default HomeScreen

