import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";


// Arka plan rengini Nutriscore veya sağlık etiketine göre alır
const getBackgroundColor = (healthLabel, nutriscore) => {
  if (nutriscore) {
    switch (nutriscore.toUpperCase()) {
      case "A": return "#4caf50";  // Sağlıklı
      case "B": return "#8bc34a";  // İyi
      case "C": return "#ffeb3b";  // Orta
      case "D": return "#ff9800";  // Dikkatli
      case "E": return "#f44336";  // Riskli
      default: return "#9e9e9e";  // Bilinmeyen
    }
  }

  // Sağlık etiketine göre renkler
  switch (healthLabel) {
    case "Sağlıklı": return "#4caf50";
    case "Dikkatli Kullanım": return "#ff9800";
    case "Riskli": return "#f44336";
    default: return "#9e9e9e";
  }
};

const ProductDetail = ({ route, navigation }) => {
  const { product, health } = route.params || {};

  if (!product || !health) {
    return (
      <View style={[styles.wrapper, { backgroundColor: "#9e9e9e" }]}>
        <Text style={styles.errorText}>Geçersiz veri</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const backgroundColor = getBackgroundColor(health.health_label, product.nutriscore_grade);
  const isFoodProduct = Boolean(health.nutriscore_grade);  // Yiyecek olup olmadığını kontrol et
  const isCosmeticProduct = !isFoodProduct; // Kozmetik ürününü kontrol et

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Geri</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{product.name || "Ürün Bilgisi Yok"}</Text>

        {/* Kozmetik ürünlerinde sağlık etiketini ve sağlık puanını göster */}
        {isCosmeticProduct && (
          <>
            {health.health_label && (
              <View style={styles.badges}>
                <View style={styles.healthBadge}>
                  <Text style={styles.healthText}>{health.health_label}</Text>
                </View>
              </View>
            )}

            {health.health_score && (
              <Text style={styles.score}>Sağlık Skoru: {health.health_score}</Text>
            )}
          </>
        )}

        {/* Yiyecek ürünü gösterimi */}
        {isFoodProduct ? (
          <View style={styles.badges}>
            {health.nutriscore_grade && (
              <View style={styles.nutriscoreBadge}>
                <Text style={styles.nutriscoreText}>{health.nutriscore_grade.toUpperCase()}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.score}>Kozmetik ürün için sağlık verileri mevcut değil.</Text>
        )}

        {/* İçeriklerin farklı gösterimi */}
        {isFoodProduct ? (
          product.ingredients && product.ingredients.length > 0 ? (
            <View style={styles.ingredientsContainer}>
              <Text style={styles.sectionTitle}>İçindekiler:</Text>
              {product.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.ingredientItem}>
                  • {ingredient}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.score}>İçerik bilgisi bulunamadı.</Text>
          )
        ) : (
          <>
            <Text style={styles.score}>Sağlık Skoru: {health.health_score}</Text>

            {health.flagged_ingredients && health.flagged_ingredients.length > 0 && (
              <View style={styles.ingredientsContainer}>
                <Text style={styles.sectionTitle}>Riskli İçerikler:</Text>
                {health.flagged_ingredients.map((item, index) => (
                  <Text key={index} style={styles.ingredientItem}>
                    • {item.ingredient} ({item.risk_level.toUpperCase()})
                  </Text>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { alignItems: "center", padding: 20 },
  header: { width: "100%", alignItems: "flex-start", marginBottom: 20 },
  backButton: { fontSize: 18, color: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
  badges: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  nutriscoreBadge: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#00000044", justifyContent: "center", alignItems: "center", marginRight: 10 },
  nutriscoreText: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  healthBadge: { backgroundColor: "#00000044", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  healthText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  score: { fontSize: 20, color: "#fff", marginBottom: 20 },
  ingredientsContainer: { width: "100%", backgroundColor: "rgba(255,255,255,0.2)", padding: 15, borderRadius: 12, marginTop: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  ingredientItem: { fontSize: 18, color: "#fff", marginBottom: 5 },
  button: { marginTop: 30, backgroundColor: "#6200ee", paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  errorText: { fontSize: 18, color: "red", marginBottom: 20 },
});
