import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  const [searchInput, setSearchInput] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const timeoutRef = useRef(null);

  const weatherMap = {
    0: { label: "Cerah", emoji: "☀️" },
    1: { label: "Sebagian Cerah", emoji: "🌤️" },
    2: { label: "Berawan", emoji: "⛅" },
    3: { label: "Mendung", emoji: "☁️" },
    45: { label: "Kabut", emoji: "🌫️" },
    48: { label: "Kabut Tebal", emoji: "🌫️" },
    51: { label: "Gerimis", emoji: "🌦️" },
    61: { label: "Hujan", emoji: "🌧️" },
    63: { label: "Hujan Sedang", emoji: "🌧️" },
    71: { label: "Salju", emoji: "❄️" },
    95: { label: "Badai", emoji: "⛈️" },
  };

  const getDirection = (deg) => {
    const dirs = ["U", "TL", "T", "TG", "S", "BD", "B", "BL"];
    return dirs[Math.round(deg / 45) % 8];
  };

 const getBackground = () => {
  if (!weather) {
    return ["#0F172A", "#1E3A8A", "#3B82F6"];
  }

  const isDay = weather.is_day === 1;

  // MALAM
  if (!isDay) {
    return [
      "#020617",
      "#0F172A",
      "#1E293B",
    ];
  }

  // CERAH
  if (
    weather.weathercode === 0 ||
    weather.weathercode === 1
  ) {
    return [
      "#38BDF8",
      "#2563EB",
      "#1D4ED8",
    ];
  }

  // BERAWAN
  if (
    weather.weathercode === 2 ||
    weather.weathercode === 3
  ) {
    return [
      "#7DD3FC",
      "#60A5FA",
      "#2563EB",
    ];
  }

  // HUJAN
  if (
    weather.weathercode === 51 ||
    weather.weathercode === 61 ||
    weather.weathercode === 63
  ) {
    return [
      "#334155",
      "#1E40AF",
      "#0F172A",
    ];
  }

  // BADAI
  if (weather.weathercode === 95) {
    return [
      "#111827",
      "#1F2937",
      "#374151",
    ];
  }

  return [
    "#38BDF8",
    "#2563EB",
    "#1D4ED8",
  ];
};

  const fetchWeather = async (city, signal) => {
    try {
      setLoading(true);
      setError("");

      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=id`,
        { signal }
      );

      const geoData = await geo.json();

      if (!geoData.results?.length) {
        throw new Error("Kota tidak ditemukan");
      }

      const place = geoData.results[0];

      const forecast = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
        { signal }
      );

      const data = await forecast.json();

      setWeather({
        city: place.name,
        country: place.country,
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        winddirection: data.current_weather.winddirection,
        weathercode: data.current_weather.weathercode,
        is_day: data.current_weather.is_day,
        maxTemp: data.daily.temperature_2m_max[0],
        minTemp: data.daily.temperature_2m_min[0],
      });

      setHistory((prev) => {
        const filtered = prev.filter(
          (item) => item.toLowerCase() !== city.toLowerCase()
        );

        return [city, ...filtered].slice(0, 5);
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        setWeather(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      setWeather(null);
      setError("");
      return;
    }

    const controller = new AbortController();

    timeoutRef.current = setTimeout(() => {
      fetchWeather(searchInput, controller.signal);
    }, 500);

    return () => {
      clearTimeout(timeoutRef.current);
      controller.abort();
    };
  }, [searchInput]);

  const refreshWeather = () => {
    if (!searchInput.trim()) return;

    setRefreshing(true);

    const controller = new AbortController();

    fetchWeather(searchInput, controller.signal);
  };

  const currentWeather =
    weather &&
    (weatherMap[weather.weathercode] || {
      label: "Tidak Diketahui",
      emoji: "❓",
    });

  return (
    <LinearGradient
      colors={getBackground()}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshWeather}
          />
        }
      >
        <Text style={styles.header}>
          WeatherFinder
        </Text>

        <Text style={styles.subtitle}>
          Find weather anywhere
        </Text>

        <TextInput
          style={styles.input}
          placeholder="🔍 Cari kota..."
          placeholderTextColor="#888"
          value={searchInput}
          onChangeText={setSearchInput}
        />

        {history.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.history}
          >
            {history.map((city, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chip}
                onPress={() =>
                  setSearchInput(city)
                }
              >
                <Text style={styles.chipText}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {!searchInput && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              🌍 Cari kota untuk melihat
              cuaca real-time
            </Text>
          </View>
        )}

        {loading && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ marginTop: 40 }}
          />
        )}

        {!!error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        {weather && !loading && (
          <View style={styles.card}>
            <Text style={styles.emoji}>
              {currentWeather.emoji}
            </Text>

            <Text style={styles.city}>
              {weather.city}
            </Text>

            <Text style={styles.country}>
              {weather.country}
            </Text>

            <Text style={styles.temp}>
              {weather.temperature}°
            </Text>

            <Text style={styles.condition}>
  {currentWeather.label}
</Text>

<Text style={styles.dayStatus}>
  {weather.is_day
    ? "☀️ Day Time"
    : "🌙 Night Time"}
</Text>

            <View style={styles.stats}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {weather.windspeed}
                </Text>
                <Text style={styles.statLabel}>
                  km/h
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {getDirection(
                    weather.winddirection
                  )}
                </Text>
                <Text style={styles.statLabel}>
                  Angin
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {weather.is_day
                    ? "☀️"
                    : "🌙"}
                </Text>
                <Text style={styles.statLabel}>
                  Waktu
                </Text>
              </View>
            </View>

            <Text style={styles.minmax}>
              🌡️ Min {weather.minTemp}°C
              • Max {weather.maxTemp}°C
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={refreshWeather}
            >
              <Text style={styles.buttonText}>
                Refresh Cuaca
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingTop: 70,
  },

  header: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    color: "#CBD5E1",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#fff",
    height: 58,
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
  },

  history: {
    marginTop: 15,
    marginBottom: 10,
  },

  chip: {
    backgroundColor:
      "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  chipText: {
    color: "#fff",
  },

  emptyBox: {
    marginTop: 60,
  },

  emptyText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },

  error: {
    marginTop: 25,
    textAlign: "center",
    color: "#FCA5A5",
    fontWeight: "bold",
  },

  card: {
  marginTop: 25,

  backgroundColor:
    "rgba(255,255,255,0.10)",

  borderRadius: 35,

  padding: 28,

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.18)",

  shadowColor: "#000",

  shadowOffset: {
    width: 0,
    height: 15,
  },

  shadowOpacity: 0.25,

  shadowRadius: 25,

  elevation: 15,
},

  emoji: {
    fontSize: 70,
    textAlign: "center",
  },

  city: {
    textAlign: "center",
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  country: {
    textAlign: "center",
    color: "#CBD5E1",
  },

  temp: {
  textAlign: "center",

  color: "#fff",

  fontSize: 72,

  fontWeight: "900",

  marginVertical: 5,
},

condition: {
  textAlign: "center",
  color: "#E2E8F0",
  fontSize: 18,
  marginBottom: 10,
},

dayStatus: {
  textAlign: "center",
  color: "#E2E8F0",
  fontSize: 15,
  marginBottom: 20,
  fontWeight: "600",
},

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    width: "31%",
    backgroundColor:
      "rgba(255,255,255,0.08)",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
  },

  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  statLabel: {
    color: "#CBD5E1",
    marginTop: 5,
  },

  minmax: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});