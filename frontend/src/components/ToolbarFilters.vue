<template>
  <div class="toolbar-row">
    <div class="toolbar-left">
      <input class="search-input" type="search" placeholder="Search by match name…" :value="search" @input="onSearch" />
    </div>

    <div class="toolbar-right">
      <select class="select" :value="sortKey" @change="onSortKey">
        <option value="time">Sort by time</option>
        <option value="odds">Sort by odds</option>
        <option value="score">Sort by score</option>
      </select>

      <select class="select" :value="sortDir" @change="onSortDir">
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import type { SortKey } from "../types/match";

export default defineComponent({
  props: {
    search: {
      type: String,
      required: true,
    },
    sortKey: {
      type: String as PropType<SortKey>,
      required: true,
    },
    sortDir: {
      type: String as PropType<"asc" | "desc">,
      required: true,
    },
  },
  emits: ["update:search", "update:sortKey", "update:sortDir"],
  methods: {
    onSearch(event: Event) {
      const target = event.target as HTMLInputElement;
      this.$emit("update:search", target.value);
    },
    onSortKey(event: Event) {
      const target = event.target as HTMLSelectElement;
      this.$emit("update:sortKey", target.value as SortKey);
    },
    onSortDir(event: Event) {
      const target = event.target as HTMLSelectElement;
      this.$emit("update:sortDir", target.value as "asc" | "desc");
    },
  },
});
</script>
