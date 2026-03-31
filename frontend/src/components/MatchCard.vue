<template>
  <transition name="flash">
    <article class="card" :class="{ 'card-updated': isUpdated }">
      <header class="card-header">
        <div>
          <h2 class="card-title">
            {{ match.name }}
          </h2>
          <div class="card-meta">
            <span>{{ match.id }}</span>
          </div>
        </div>
        <span class="pill live">Live</span>
      </header>
      <section class="card-main">
        <div>
          <div class="score">
            {{ match.score }}
          </div>
          <div class="time">
            {{ match.time }}’
          </div>
        </div>
        <div>
          <div class="odds-badge">
            <span class="odds-label">Odds</span>
            <span>{{ match.odds.toFixed(2) }}</span>
          </div>
        </div>
      </section>
    </article>
  </transition>
</template>

<script setup lang="ts">
import type { Match } from '../types/match';

defineProps<{
  match: Match;
  isUpdated: boolean;
}>();
</script>

