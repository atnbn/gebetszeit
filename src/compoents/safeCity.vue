<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// State to control visibility
const isVisible = ref(true);
let timer: ReturnType<typeof setTimeout>;

const closeTooltip = () => {
  isVisible.value = false;
};

onMounted(() => {
  // Set the tooltip to disappear after 5 seconds (5000ms)
  timer = setTimeout(() => {
    closeTooltip();
  }, 5000);
});

// Clean up the timer if the component is removed manually
onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <!-- Transition wrapper for smooth exit -->
  <Transition name="fade">
    <div v-if="isVisible" class="tooltip-wrapper">
      <div class="glass-tooltip">
        <div class="tooltip-content">
          <span class="city-name">İstanbul</span>
          varsayılan şehriniz yapılsın mı?
        </div>

        <div class="tooltip-actions">
          <button @click="closeTooltip" class="btn-action btn-confirm" title="Onayla">
            <span class="icon">➔</span>
          </button>
          <button @click="closeTooltip" class="btn-action btn-cancel" title="Kapat">
            <span class="icon">✕</span>
          </button>
        </div>

        <div class="tooltip-arrow"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ... keep your existing styles ... */

/* Logic for the smooth fade-out */
.fade-leave-active {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Container for positioning */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
  font-family: 'Inter', sans-serif;
}

/* Tooltip Body */
.glass-tooltip {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(10, 35, 25, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 100;
  animation: tooltipFade 0.3s ease-out;
}

/* Your remaining CSS styles here... */
</style>
