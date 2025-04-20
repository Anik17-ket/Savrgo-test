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
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"
import { Ionicons } from "@expo/vector-icons"

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
        <Text style={styles.dealDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>Rs{item.originalPrice.toFixed(2)}</Text>
          <Text style={styles.discountedPrice}>Rs{item.discountedPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.dealFooter}>
          <Text style={styles.validUntil}>Valid until {new Date(item.validUntil).toLocaleDateString()}</Text>
          <View style={styles.savedCounter}>
            <Ionicons name="bookmark" size={16} color="#666" />
            <Text style={styles.savedText}>{item.savedBy.length}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const BusinessDashboardScreen = ({ route }) => {
  const navigation = useNavigation()
  const { userInfo, setUserToken, setUserInfo } = route.params

  const [deals, setDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    totalSaves: 0,
  })

  const fetchBusinessDeals = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken")

      const response = await fetch(`${API_URL}/api/business/deals`, {
        headers: {
          "x-auth-token": token,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch deals")
      }

      const data = await response.json()
      setDeals(data)

      // Calculate stats
      const now = new Date()
      const activeDeals = data.filter((deal) => new Date(deal.validUntil) > now)
      const totalSaves = data.reduce((total, deal) => total + deal.savedBy.length, 0)

      setStats({
        totalDeals: data.length,
        activeDeals: activeDeals.length,
        totalSaves: totalSaves,
      })
    } catch (error) {
      console.error("Error fetching business deals:", error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBusinessDeals()

    // Refresh deals when the screen is focused
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBusinessDeals()
    })

    return unsubscribe
  }, [navigation])

  const onRefresh = () => {
    setRefreshing(true)
    fetchBusinessDeals()
  }

  const handleDealPress = (deal) => {
    navigation.navigate("DealDetails", { deal, userInfo })
  }

  const handleCreateDeal = () => {
    navigation.navigate("Create")
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
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userName}>{userInfo.fullName}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalDeals}</Text>
          <Text style={styles.statLabel}>Total Deals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.activeDeals}</Text>
          <Text style={styles.statLabel}>Active Deals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalSaves}</Text>
          <Text style={styles.statLabel}>Total Saves</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Deals</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleCreateDeal}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Create Deal</Text>
          </TouchableOpacity>
        </View>

        {deals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>You haven't created any deals yet</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleCreateDeal}>
              <Text style={styles.emptyButtonText}>Create Your First Deal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={deals}
            renderItem={({ item }) => <DealItem item={item} onPress={() => handleDealPress(item)} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.dealsList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6B6B"]} />}
          />
        )}
      </View>
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
  welcomeText: {
    color: "#fff",
    fontSize: 16,
  },
  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  dealsList: {
    paddingBottom: 20,
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
  savedCounter: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedText: {
    fontSize: 12,
    color: "#666",
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
  emptyButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default BusinessDashboardScreen

