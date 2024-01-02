<script setup lang="ts">
import {getFullCarNameFromOrdinal, getFullTrackNameFromOrdinal} from "../../helpers/ordinals";
import {isoToFormattedTime} from "../../helpers/time";
</script>

<template>
<div class="">
  <!-- Activity list -->
  <div class="border-t border-white/10 pt-8">
    <h2 class="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
      Last Sessions
    </h2>
    <table class="mt-6 w-full whitespace-nowrap text-left">
      <thead class="font-mono border-b border-white/10 text-sm leading-6 text-white">
      <tr>
        <th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
          # ID
        </th>
        <th scope="col" class="py-2 pl-0 pr-8 font-semibold">
          Circuit
        </th>
        <th scope="col" class="py-2 font-semibold">
          Car
        </th>
        <th scope="col" class="py-2 font-semibold">
          Lap Count
        </th>
        <th scope="col" class="hidden py-2 font-semibold sm:table-cell">
          Saved At
        </th>
      </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
      <tr
          v-for="session in sessions" :key="session.id"
          class="cursor-pointer hover:bg-slate-800"
          @click="visitSession(session)"
      >
        <td class="pl-4 pr-8 sm:pl-6 lg:pl-8">
          <div class="flex pl-0 items-center gap-x-4">
            <div class="truncate font-mono font-medium leading-6 text-white">
              {{ session.id.toString().padStart(5, '0') }}
            </div>
          </div>
        </td>
        <td class="pl-0 pr-8">
          <div class="flex pl-0 items-center gap-x-4">
            <div class="truncate font-mono font-medium leading-6 text-white">
              {{ getFullTrackNameFromOrdinal(session.trackOrdinal) }}
            </div>
          </div>
        </td>
        <td class="py-4 pl-0 pr-4">
          <div class="font-mono leading-6 text-neutral-50">
            {{ getFullCarNameFromOrdinal(session.carOrdinal) }}
          </div>
        </td>
        <td class="py-4 pl-0 pr-4">
          <div class="font-mono leading-6 text-neutral-50">
            {{ session.lightData?.Laps?.length ?? 0 }} laps
          </div>
        </td>
        <td class="hidden py-4 pl-0 leading-6 text-neutral-200 md:table-cell">
          {{ isoToFormattedTime(session.createdAt) }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {getAllPreviousSessions} from "../../services/session";
import type {PersistedSession} from "../../types/Session";

export default defineComponent({
  name: "PreviousSessionPage",
  data() {
    return {
      sessions: [] as PersistedSession[],
    };
  },

  methods: {
    async getSessions() {
      this.sessions = await getAllPreviousSessions();
    },

    visitSession(session: PersistedSession): void {
      this.$router.push(`/sessions/${session.id}`, );
    },
  },

  beforeMount() {
    this.getSessions();
  }
});
</script>

<style scoped>

</style>