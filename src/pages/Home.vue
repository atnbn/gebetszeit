<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { DayData } from '../types';
import InputCity from '../compoents/inputCity.vue';
const iftarData = ref<DayData | null>(null);
const loading = ref(false);
const currentDate = ref(new Date());
const cityName = ref('Forchheim');
const BASE_URL = 'https://api.aladhan.com/v1/timings';
const lat = ref(49.7175);
const lng = ref(11.0588);
const METHOD = 13;
const SCHOOL = 1;

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchPrayerTimes() {
  loading.value = true;

  try {
    const formattedDate = formatDate(currentDate.value);

    const response = await fetch(
      `${BASE_URL}/${formattedDate}?latitude=${lat.value}&longitude=${lng.value}&method=${METHOD}&school=${SCHOOL}`
    );
    const res = await response.json();
    iftarData.value = res.data ?? null;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
  } finally {
    loading.value = false;
  }
}

const handleCoordinates = (coords: any) => {
  lat.value = Number(coords.lat);
  lng.value = Number(coords.lon);
  cityName.value = coords.city;
  fetchPrayerTimes(); // refresh data when city changes
};

function changeDay(amount: number) {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + amount);
  currentDate.value = newDate;
  fetchPrayerTimes();
}

onMounted(fetchPrayerTimes);

const arabicPrayers = computed(() => {
  if (!iftarData.value) return [];

  const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return order.map((key) => ({
    name: key,
    time: iftarData.value!.timings[key].split(' ')[0],
  }));
});
</script>
<template>
  <div v-if="loading" class="loading-state">Loading...</div>

  <div v-else class="ramadan-container">
    <header class="header">
      <h1 class="title">Ramazan-ı Şerif</h1>
      <p class="subtitle">Prayer Times & Spiritual Guide</p>
    </header>
    <InputCity @update:coordinates="handleCoordinates" />
    <div class="prayer-card" v-if="iftarData">
      <!-- Date Navigation Bar -->
      <div class="date-nav">
        <button class="nav-btn" @click="changeDay(-1)">‹</button>
        <h2 class="date-display">{{ iftarData.date.readable }}</h2>
        <button class="nav-btn" @click="changeDay(1)">›</button>
      </div>
      <span>{{ cityName }}</span>
      <div class="prayer-row" v-for="prayer in arabicPrayers" :key="prayer.name">
        <span class="vakit">{{ prayer.name }}</span>
        <span class="saat">{{ prayer.time }}</span>
      </div>
    </div>
  </div>
</template>
<style>
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', 'Poppins', sans-serif;
  /* Deep Emerald Islamic Pattern feel */
  background: radial-gradient(circle at top right, #064e3b, #022c22);
  color: #ffffff;
  padding: 20px;
}

.ramadan-container {
  width: 100%;
  max-width: 480px;
  animation: fadeIn 0.8s ease-out;
}

/* Header Styling */
.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.8rem;
  margin: 0;
  background: linear-gradient(to bottom, #fde68a 20%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-top: 5px;
}

/* Main Prayer Card */
.prayer-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 25px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Date Navigation */
.date-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.date-display {
  font-size: 1.1rem;
  color: #fde68a;
  margin: 0;
  font-weight: 600;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: #fde68a;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #fde68a;
  transform: scale(1.1);
}

/* City Name Display */
.prayer-card > span {
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin-bottom: 20px;
  font-style: italic;
}

.prayer-card > span::before {
  content: '📍 ';
}

/* Prayer Rows */
.prayer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.prayer-row:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

/* Highlight for Akşam/Iftar */
.prayer-row:nth-child(6) {
  border-color: rgba(217, 119, 6, 0.4);
  background: linear-gradient(90deg, rgba(217, 119, 6, 0.15), transparent);
}

.vakit {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.saat {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  color: #fde68a;
}

/* Loading State */
.loading-state {
  font-size: 1.5rem;
  color: #fde68a;
  text-align: center;
  margin-top: 50px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .title {
    font-size: 2.2rem;
  }
  .prayer-card {
    padding: 20px;
  }
  .prayer-row {
    padding: 14px 16px;
  }
}
</style>
