import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";

const OnboardingScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://example.com/slide1.png", // Replace with actual images
      title: "Welcome to SavrGo",
      description: "Discover great deals and offers near you.",
    },
    {
      image: "https://example.com/slide2.png", // Replace with actual images
      title: "Exclusive Discounts",
      description: "Enjoy special offers and discounts only available on SavrGo.",
    },
    {
      image: "https://example.com/slide3.png", // Replace with actual images
      title: "Easy Booking & Redeem",
      description: "Book your favorite deals and redeem them with ease.",
    },
  ];

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      goToLogin();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal pagingEnabled style={styles.scrollContainer}>
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: slide.image }} style={styles.image} />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <TouchableOpacity style={styles.button} onPress={handleNextSlide}>
        <Text style={styles.buttonText}>
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={goToLogin}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  scrollContainer: {
    width: "100%",
  },
  slide: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    marginTop: 10,
    paddingVertical: 10,
  },
  skipText: {
    color: "#4A90E2",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
