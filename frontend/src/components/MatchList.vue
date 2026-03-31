<template>
  <div class="matches-grid">
    <MatchCard
      v-for="match in matches"
      :key="match.id"
      :match="match"
      :is-updated="recentlyUpdatedIds.has(match.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Match } from '../types/match';
import MatchCard from './MatchCard.vue';

defineProps<{
  matches: Match[];
  recentlyUpdatedIds: Set<string>;
}>();
</script>

