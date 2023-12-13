<script setup lang="ts">
import {state} from "../socket";
import {$getTimeStringFromSeconds} from "../helpers/time";
</script>

<template>
  <main>
    <header>
      <!-- Heading -->
      <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8 pt-8">
        <div>
          <div class="flex items-center gap-x-3">
            <div
                class="flex-none rounded-full bg-green-400/10 p-1"
                :class="[state.connected ? 'text-green-400' : 'text-red-500']"
            >
              <div class="h-2 w-2 rounded-full bg-current" />
            </div>
            <h1 class="flex gap-x-3 text-base leading-7">
              <span class="font-semibold text-white">
                {{ currentTrack.Circuit }} - {{ currentTrack.Track }}
              </span>
              <span class="text-gray-600">/</span>
              <span class="font-semibold text-white">
                {{ currentCar.Year }} {{ currentCar.Make }} {{ currentCar.Model }}
              </span>
            </h1>
          </div>
          <p class="mt-2 text-xs leading-6 text-gray-400">
            Track Length: {{ currentTrack.Length }} km
          </p>
        </div>
        <div class="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
          S_00023
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-12">
        <div class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 lg:col-span-2">
          <p class="text-sm font-medium leading-6 text-gray-400 tracking-wider">Current Lap</p>
          <p v-if="state.activeSession" class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">
              {{ state.activeSession.currentLap }}
            </span>
          </p>
          <p v-else class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">-</span>
          </p>
        </div>
        <div class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 sm:border-l lg:col-span-3">
          <p class="text-sm font-medium leading-6 text-gray-400 tracking-wider">Tire Degradation</p>
          <p v-if="state.activeSession" class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">
              12 %
            </span>
            <span class="text-sm text-gray-400"> / lap </span>
          </p>
          <p v-else class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">-</span>
          </p>
        </div>
        <div class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 sm:border-l lg:col-span-3">
          <p class="text-sm font-medium leading-6 text-gray-400 tracking-wider">Fuel Consumption</p>
          <p v-if="state.activeSession" class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">
              5 %
            </span>
            <span class="text-sm text-gray-400"> / lap </span>
          </p>
          <p v-else class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">-</span>
          </p>
        </div>
        <div class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 sm:border-l lg:col-span-4">
          <p class="text-sm font-medium leading-6 text-gray-400 tracking-wider">Best Lap</p>
          <p v-if="state.activeSession" class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">
              {{ $getTimeStringFromSeconds(state.activeSession.last_packet.BestLap) }}
            </span>
          </p>
          <p v-else class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">-</span>
          </p>
        </div>
      </div>
    </header>

    <!-- Activity list -->
    <div class="border-t border-white/10 pt-8">
      <h2 class="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
        Session Laps
      </h2>
      <table class="mt-6 w-full whitespace-nowrap text-left">
        <colgroup>
<!--          <col class="lg:w-1/12" />-->
<!--          <col class="lg:w-3/12" />-->
<!--          <col class="lg:w-2/12" />-->
<!--          <col class="lg:w-1/12" />-->
<!--          <col class="lg:w-1/12" />-->
<!--          <col class="lg:w-1/12" />-->
<!--          <col class="lg:w-1/12" />-->
<!--          <col class="lg:w-2/12" />-->
        </colgroup>
        <thead class="font-mono border-b border-white/10 text-sm leading-6 text-white">
        <tr>
          <th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
            Lap
          </th>
          <th scope="col" class="py-2 font-semibold">
            Time
          </th>
<!--          <th scope="col" class="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">-->
<!--            Class.-->
<!--          </th>-->
          <th scope="col" class="hidden py-2 font-semibold md:table-cell">
            Tire Deg.
          </th>
          <th scope="col" class="hidden py-2 font-semibold sm:table-cell">
            Fuel Use
          </th>
          <th scope="col" class="hidden py-2 font-semibold md:table-cell">
            Max. Speed
          </th>
          <th scope="col" class="hidden py-2 font-semibold sm:table-cell">
            Min. Speed
          </th>
          <th scope="col" class="hidden py-2 font-semibold sm:table-cell">
            Pos. Change
          </th>
        </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
        <tr
            v-for="lap in laps" :key="lap.Number"
            :class="{
              'bg-purple-500/20': lap.Number > 1 && lap.IsAllTimeBest,
              'bg-green-500/20': ! lap.IsAllTimeBest && lap.IsBestAtTime,
            }"
        >
          <td class="pl-4 pr-8 sm:pl-6 lg:pl-8">
            <div class="flex pl-0 items-center gap-x-4">
              <div class="truncate font-mono font-medium leading-6 text-white">
                {{ lap.Number.toString().padStart(2, '0') }}
              </div>
            </div>
          </td>
          <td class="py-4 pl-0 pr-4">
            <div class="flex gap-x-3">
              <div class="font-mono leading-6 text-neutral-50">
                {{ $getTimeStringFromSeconds(lap.Time) }}
              </div>
            </div>
          </td>
<!--          <td class="font-mono hidden sm:table-cell py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">-->
<!--            <div class="flex items-center justify-end gap-x-2 sm:justify-start">-->
<!--              <div-->
<!--                  class="flex-none rounded-full p-1"-->
<!--                  :class="{-->
<!--                    'text-neutral-400 bg-neutral-300/10': lap.Number === 1 || ! lap.IsBestAtTime && ! lap.IsAllTimeBest,-->
<!--                    'text-purple-400 bg-purple-400/10': lap.Number > 1 && lap.IsAllTimeBest,-->
<!--                    'text-green-400 bg-green-400/10': lap.Number > 1 && lap.IsBestAtTime && ! lap.IsAllTimeBest,-->
<!--                  }"-->
<!--              >-->
<!--                <div class="h-2 w-2 rounded-full bg-current" />-->
<!--              </div>-->
<!--              <div class="hidden text-white sm:block">-->
<!--                {{ lap.Number === 1 ? '' : lap.IsAllTimeBest ? 'Best' : (lap.IsBestAtTime) ? 'Improved' : '' }}-->
<!--              </div>-->
<!--            </div>-->
<!--          </td>-->
          <td class="hidden py-4 pl-0 leading-6 text-neutral-50 md:table-cell">
            12 %
          </td>
          <td class="hidden py-4 pl-0 leading-6 text-neutral-50 sm:table-cell">
            5 %
          </td>
          <td class="hidden py-4 pl-0 leading-6 text-neutral-50 md:table-cell">
            293 km/h
          </td>
          <td class="hidden py-4 pl-0 leading-6 text-neutral-50 sm:table-cell">
            70 km/h
          </td>
          <td class="hidden py-4 pl-0 pr-4 leading-6 text-neutral-50 sm:table-cell sm:pr-6 lg:pr-8">
            <span class="text-green-300 text-base pr-2">&#9650;</span> 3
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {socket, state} from "../socket";
import tracks from '../data/tracks.json';
import cars from '../data/cars.json';
import type {Lap} from "../types/Session";

export default defineComponent({
  name: 'Dashboard',

  methods: {
    // connect() {
    //   socket.connect();
    // },
    //
    // disconnect() {
    //   socket.disconnect();
    // },
  },

  computed: {
    currentTrack(): Track {
      if (!state.activeSession || state.activeSession.currentCarOrdinal === 0) {
        return {
          Circuit: '',
          IOCCode: '',
          Length: '',
          Location: '',
          Track: '',
          Ordinal: ''
        };
      }

      return tracks.find((track) => track.Ordinal === state.activeSession?.currentTrackOrdinal.toString())
          ?? {
            Circuit: '',
            IOCCode: '',
            Length: '',
            Location: '',
            Track: '',
            Ordinal: ''
          };
    },
    currentCar(): Car {
      if (!state.activeSession || state.activeSession.currentCarOrdinal === 0) {
        return {
          Ordinal: '',
          Year: '',
          Make: '',
          Model: '',
        };
      }

      return cars.find((track) => track.Ordinal === state.activeSession?.currentCarOrdinal.toString())
          ?? {
            Ordinal: '',
            Year: '',
            Make: '',
            Model: '',
          };
    },

    laps(): Lap[] {
      if (! state.activeSession) {
        return [];
      }

      return state.activeSession.laps.reverse().map(function (lap) {
        lap.IsAllTimeBest = state.activeSession?.last_packet?.BestLap === lap.Time;
        return lap;
      });
    }
  }
});

type Track = {
  Ordinal: string,
  Circuit: string,
  Location: string,
  IOCCode: string,
  Track: string,
  Length: string
};

type Car = {
  Ordinal: string,
  Year: string,
  Make: string,
  Model: string,
};
</script>