<template>
  <div class="dashboard-shell">
    <ToolbarFilters
      :search="filters.search"
      :sort-key="filters.sortKey"
      :sort-dir="filters.sortDir"
      @update:search="onSearch"
      @update:sortKey="onSortKey"
      @update:sortDir="onSortDir"
    />

    <div v-if="status === 'loading'" class="status-banner info">Loading matches…</div>

    <div v-else-if="status === 'error'" class="status-banner error">{{ errorMessage }} <button @click="reload">Retry</button></div>

    <div v-if="matches.length === 0 && status === 'ready'" class="empty-state">No matches found. Try adjusting your filters.</div>

    <MatchList v-else :matches="matches" :recently-updated-ids="recentlyUpdatedIds" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ToolbarFilters from "../components/ToolbarFilters.vue";
import MatchList from "../components/MatchList.vue";
import { useMatchesStore } from "../stores/matchesStore";
import { useMatchUpdatesChannel } from "../services/ws/matchUpdatesChannel";

export default defineComponent({
  components: {
    ToolbarFilters,
    MatchList,
  },
  data() {
    return {
      matchesStore: useMatchesStore(),
      wsChannel: useMatchUpdatesChannel(),
    };
  },
  computed: {
    matches() {
      return this.matchesStore.allMatches;
    },
    status() {
      return this.matchesStore.status;
    },
    errorMessage() {
      return this.matchesStore.errorMessage;
    },
    filters() {
      return this.matchesStore.filters;
    },
    recentlyUpdatedIds() {
      return this.matchesStore.recentlyUpdatedIds;
    },
  },
  methods: {
    onSearch(value: string) {
      this.matchesStore.setSearch(value);
    },
    onSortKey(value: "time" | "odds" | "score") {
      this.matchesStore.setSortKey(value);
    },
    onSortDir(value: "asc" | "desc") {
      this.matchesStore.setSortDir(value);
    },
    reload() {
      this.matchesStore.loadInitial();
    },
  },
  async mounted() {
    if (this.matchesStore.status === "idle") {
      await this.matchesStore.loadInitial();
    }

    console.log("DashboardView mounted, connecting to WebSocket channel");
    this.wsChannel.connect();
  },
});
</script>
