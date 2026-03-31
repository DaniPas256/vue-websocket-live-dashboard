<template>
  <div :class="['app-root', themeClass]">
    <header class="app-header">
      <div class="app-header-left">
        <h1 class="app-title">Live Matches Dashboard</h1>
        <span class="connection-indicator" :data-status="connectionStatus">
          {{ connectionLabel }}
        </span>
      </div>
      <div class="app-header-right">
        <button type="button" class="theme-toggle" @click="toggleTheme">
          {{ theme === "light" ? "Dark mode" : "Light mode" }}
        </button>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { useThemeStore } from "./stores/themeStore";
import { useConnectionStore } from "./stores/connectionStore";

export default defineComponent({
  components: {
    RouterView,
  },

  data() {
    return {
      themeStore: useThemeStore(),
      connectionStore: useConnectionStore(),
    };
  },

  computed: {
    theme(): string {
      return this.themeStore.theme;
    },

    themeClass(): string {
      return this.theme === "dark" ? "theme-dark" : "theme-light";
    },

    connectionStatus(): string {
      return this.connectionStore.status;
    },

    connectionLabel(): string {
      switch (this.connectionStatus) {
        case "connected":
          return "Live";
        case "connecting":
          return "Connecting…";
        case "disconnected":
          return "Disconnected";
        default:
          return "Idle";
      }
    },
  },

  methods: {
    toggleTheme() {
      this.themeStore.toggleTheme();
    },
  },
});
</script>
