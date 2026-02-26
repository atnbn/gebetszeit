<script setup lang="ts">
import { ref } from 'vue';
import SafeCity from './safeCity.vue';

const emit = defineEmits(['update:coordinates']);
let tooltip = true;
const query = ref('');
const results = ref<any[]>([]);
let timeout: ReturnType<typeof setTimeout>;

const searchCity = async (city: string) => {
  if (!city) {
    results.value = [];
    return;
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${city}&addressdetails=1&limit=5`
  );

  const data = await response.json();
  results.value = data;
};

const handleInput = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searchCity(query.value);
  }, 400); // debounce 400ms
};

const selectCity = (place: any) => {
  query.value = place.display_name;
  results.value = [];

  emit('update:coordinates', {
    lat: Number(place.lat),
    lon: Number(place.lon),
    city:
      place.address?.city ||
      place.address?.town ||
      place.address?.village ||
      place.display_name.split(',')[0],
    fullName: place.display_name,
  });
  tooltip = true;
};
</script>

<template>
  <div class="city-search">
    <input v-model="query" type="text" placeholder="Enter city..." @input="handleInput" />

    <ul v-if="results.length" class="dropdown">
      <li v-for="place in results" :key="place.place_id" @click="selectCity(place)">
        {{ place.display_name }}
      </li>
    </ul>
    <!-- <SafeCity v-if="tooltip" /> -->
  </div>
</template>

<style scoped>
/* Layout Container */
/* Container must be relative for the dropdown to anchor correctly */
.city-search {
  position: relative;
  width: 100%;
  max-width: 450px;
  margin-bottom: 25px;
}

/* Input Styling */
.city-search input {
  width: 100%;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 175, 55, 0.3); /* Gold border tint */
  border-radius: 15px;
  color: white;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.city-search input:focus {
  border-color: rgba(212, 175, 55, 0.8);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
}

/* Dropdown Menu */
.dropdown {
  position: absolute;
  top: calc(100% + 10px); /* Gap below input */
  left: 0;
  right: 0;
  background: rgba(15, 25, 20, 0.85); /* Darker emerald glass for legibility */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* Individual List Items */
.dropdown li {
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dropdown li:last-child {
  border-bottom: none;
}

/* Hover State - Turkish Gold Highlight */
.dropdown li:hover {
  background: rgba(212, 175, 55, 0.2);
  color: #fde68a; /* Gold text */
  padding-left: 25px; /* Subtle slide effect */
}

/* Custom Scrollbar for the dropdown */
.dropdown::-webkit-scrollbar {
  width: 6px;
}

.dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 10px;
}

.dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.5);
}
</style>
