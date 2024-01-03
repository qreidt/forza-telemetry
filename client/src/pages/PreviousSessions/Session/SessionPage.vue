<script setup lang="ts">
//
import {getFullCarNameFromOrdinal, getFullTrackNameFromOrdinal, getTrackFromOrdinal} from "../../../helpers/ordinals";
import {$diffTime, $getTimeStringFromSeconds} from "../../../helpers/time";
import {$percentage} from "../../../helpers/numbers";
import LineChart from "../../../components/Charts/LineChart.vue";
</script>

<template>
  <main>
    <header>
      <!-- Heading -->
      <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8 pt-8">
        <div>
          <div class="flex items-center gap-x-3">
            <h1 class="flex gap-x-3 text-base leading-7">
              <span class="font-semibold text-white">
                {{ getFullTrackNameFromOrdinal(track_ordinal) }}
              </span>
              <span class="text-gray-600">/</span>
              <span class="font-semibold text-white">
                {{ getFullCarNameFromOrdinal(car_ordinal) }}
              </span>
            </h1>
          </div>
          <p class="mt-2 text-xs leading-6 text-gray-400">
            Track Length: {{ getTrackFromOrdinal(track_ordinal).Length }} km
          </p>
        </div>
        <div class="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
          S{{ session_id.toString().padStart(5, '0') }}
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-12">
        <div class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 lg:col-span-2">
          <p class="text-sm font-medium leading-6 text-gray-400 tracking-wider">Lap Count</p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">
              {{ light_data?.LapCount ?? '-' }}
            </span>
          </p>
        </div>
        <div class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 sm:border-l lg:col-span-3">
          <p class="text-sm font-medium leading-6 text-gray-400 tracking-wider">Tire Degradation</p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">
              {{ $percentage((light_data?.TireWearPerLap ?? 0) * -1, 1) }} %
            </span>
            <span class="text-sm text-gray-400"> / lap </span>
          </p>
        </div>
        <div class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 sm:border-l lg:col-span-3">
          <p class="text-sm font-medium leading-6 text-gray-400 tracking-wider">Fuel Consumption</p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">
              {{ $percentage((light_data?.FuelUsagePerLap ?? 0) * -1, 1) }} %
            </span>
            <span class="text-sm text-gray-400"> / lap </span>
          </p>
        </div>
        <div class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8 sm:border-l lg:col-span-4">
          <p class="text-sm font-medium leading-6 text-gray-400 tracking-wider">Best Lap Time</p>
          <p class="mt-2 flex items-baseline gap-x-2">
            <span class="text-5xl font-semibold tracking-tight text-white">
              {{ $getTimeStringFromSeconds(light_data?.BestLapTime ?? 0) }}
            </span>
          </p>
        </div>
      </div>
    </header>

    <!-- Data Analisys -->
    <div class="border-t border-white/10 pt-8">
      <h2 class="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
        Data Analisys
      </h2>
      <div class="flex flex-col space-y-6 mx-8">
        <div class="flex flex-row">
          <div class="flex flex-row mx-auto max-w-2xl space-x-12">
            <div class="">
              <label for="dataset-01" class="block text-sm font-medium leading-6 text-white">
                Dataset 01
              </label>
              <div class="mt-2">
                <select
                    id="dataset-01"
                    v-model="lap_selection_1"
                    class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                >
                  <option
                      v-for="lap in laps" :key="lap.Number"
                      :value="lap.Number" v-text="lap.Number.toString().padStart(2, '0')"
                  />
                </select>
              </div>
            </div>
            <div class="">
              <label for="dataset-02" class="block text-sm font-medium leading-6 text-white">
                Dataset 02
              </label>
              <div class="mt-2">
                <select
                    id="dataset-02"
                    v-model="lap_selection_2"
                    class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                >
                  <option
                      v-for="lap in laps" :key="lap.Number"
                      :value="lap.Number" v-text="lap.Number.toString().padStart(2, '0')"
                  />
                </select>
              </div>
            </div>
          </div>
        </div>
        <div v-if="dataset_1" class="flex">
          <LineChart
              :dataset_1="dataset_1?.speed" :dataset_2="dataset_2?.speed"
              title="Speed (km/h) x Distance (m)"
              x_title="Distance (m)" y_title="Speed (km/h)"
              class="w-max min-h-32"
          />
        </div>

        <div v-if="dataset_1" class="flex">
          <LineChart
              :dataset_1="dataset_1?.accel" :dataset_2="dataset_2?.accel"
              title="Throttle (%) x Distance (m)"
              x_title="Distance (m)" y_title="Throttle (%)"
              y_tick_suffix="%" class="w-max min-h-32"
          />
        </div>

        <div v-if="dataset_1" class="flex">
          <LineChart
              :dataset_1="dataset_1?.brake" :dataset_2="dataset_2?.brake"
              title="Brake (%) x Distance (m)"
              x_title="Distance (m)" y_title="Brake (%)"
              y_tick_suffix="%" class="w-max min-h-32"
          />
        </div>

        <div v-if="dataset_1" class="flex">
          <LineChart
              :dataset_1="dataset_1?.steer" :dataset_2="dataset_2?.steer"
              title="Steer (%) x Distance (m)"
              x_title="Distance (m)" y_title="Steer (%)"
              y_tick_suffix="%" class="w-max min-h-32"
          />
        </div>
      </div>
    </div>

    <!-- Activity list -->
    <div class="pt-8">
      <h2 class="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
        Session Laps
      </h2>
      <table class="mt-6 w-full whitespace-nowrap text-left">
        <thead class="font-mono border-b border-white/10 text-sm leading-6 text-white">
        <tr>
          <th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
            Lap
          </th>
          <th scope="col" class="py-2 pl-0 pr-8 font-semibold">
            Stint
          </th>
          <th scope="col" class="py-2 font-semibold">
            Time
          </th>
          <th scope="col" class="py-2 font-semibold">
            Diff.
          </th>
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
              'bg-purple-700/20': lap.Number > 1 && lap.IsAllTimeBest,
              'bg-green-700/20': lap.Number > 1 && ! lap.IsAllTimeBest && lap.IsBestAtTime,
            }"
        >
          <td class="pl-4 pr-8 sm:pl-6 lg:pl-8">
            <div class="flex pl-0 items-center gap-x-4">
              <div class="truncate font-mono font-medium leading-6 text-white">
                {{ lap.Number.toString().padStart(2, '0') }}
              </div>
            </div>
          </td>
          <td class="pl-0 pr-8">
            <div class="flex pl-0 items-center gap-x-4">
              <div class="truncate font-mono font-medium leading-6 text-white">
                01
              </div>
            </div>
          </td>
          <td class="py-4 pl-0 pr-4">
            <div class="font-mono leading-6 text-neutral-50">
              {{ $getTimeStringFromSeconds(lap.Time) }}
            </div>
          </td>
          <td class="py-4 pl-0 pr-4">
            <div class="font-mono leading-6 text-neutral-50">
              {{ $diffTime(light_data.BestLapTime, lap.Time) }}
            </div>
          </td>
          <td class="hidden py-4 pl-0 leading-6 text-neutral-200 md:table-cell">
            {{ $percentage(lap.AvgWear * -1, 2) }} %
          </td>
          <td class="hidden py-4 pl-0 leading-6 text-neutral-200 sm:table-cell">
            {{ $percentage(lap.DeltaFuel * -1, 2) }} %
          </td>
          <td class="hidden py-4 pl-0 leading-6 text-neutral-200 md:table-cell">
            {{ (lap.MaxSpeed * 3.6).toFixed() }} km/h
          </td>
          <td class="hidden py-4 pl-0 leading-6 text-neutral-200 sm:table-cell">
            {{ (lap.MinSpeed * 3.6).toFixed() }} km/h
          </td>
          <td class="hidden py-4 pl-1.5 pr-4 leading-6 text-neutral-50 sm:table-cell sm:pr-6 lg:pr-8">
            <span v-if="lap.PositionChanges > 0" class="text-green-300 text-base pr-1">&#9650;</span>
            <span v-if="lap.PositionChanges < 0" class="text-rose-400 text-base pr-1">&#9650;</span>
            {{ lap.PositionChanges }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {RouteLocationNormalizedLoaded} from "vue-router";
import type {Dataset, Lap, PersistedSession, PersistedSessionLightData} from "../../../types/Session";
import {getSession, loadLapTelemetry} from "../../../services/session";
import {addIsAllTimeBestLaptimeToLaps} from "../../../helpers/mapper";

type DatasetSelection = {
  speed: Dataset,
  accel: Dataset,
  brake: Dataset,
  steer: Dataset
};

export default defineComponent({
  name: 'SessionPage',
  data() {
    return {
      session_id: null as number|null,
      track_ordinal: null as number|null,
      car_ordinal: null as number|null,
      created_at: null as number|null,
      updated_at: null as number|null,

      laps: [] as Lap[],
      light_data: null as null|Omit<PersistedSessionLightData, 'Laps'>,

      lap_selection_1: null as string|null,
      lap_selection_2: null as string|null,
    };
  },

  methods: {
    async loadSession() {
      this.session_id = this.currentRoute.params.session_id;
      const session = await getSession(this.session_id);
      this.setSession(session);

      this.loadLapsTelemetries();
    },

    async loadLapsTelemetries() {
      const lap_ids = this.laps.map((lap: Lap) => lap._id!);
      const laps = (await loadLapTelemetry(this.session_id, lap_ids))
          .reduce((aggr: Record<string, Lap>, lap: Lap) => {
            aggr[lap._id!] = lap;
            return aggr;
          }, {});

      this.laps = this.laps.map((lap: Lap) => {
        if (lap._id! in laps) {
          lap.Data = laps[lap._id!].Data;
        }

        return lap;
      });

      this.lap_selection_1 = this.laps.find((lap: Lap) => {
        return lap.IsAllTimeBest === true;
      })?.Number;
    },

    setSession(session: PersistedSession): PersistedSession {
      this.track_ordinal = session.trackOrdinal;
      this.car_ordinal = session.carOrdinal;
      this.created_at = session.createdAt;
      this.updated_at = session.updatedAt;

      this.laps = addIsAllTimeBestLaptimeToLaps(session.lightData.Laps, session.lightData.BestLapTime)
          .sort((a, b) => b.Number - a.Number);

      delete session.lightData.Laps;
      this.light_data = session.lightData

      return session;
    },

    getLapDatasetSelection(lap: Lap): DatasetSelection {
      const label = 'Lap ' + lap.Number.toString().padStart(2, '0');
      const speed_data: {x: number, y: number}[] = lap.Data.map(
          (item) => ({
            x: item.CurrentLapDistance,
            y: item.Speed * 3.6
          })
      );

      const accel_data: {x: number, y: number}[] = lap.Data.map(
          (item) => ({
            x: item.CurrentLapDistance,
            y: (item.Accel / 255) * 100
          })
      );

      const brake_data: {x: number, y: number}[] = lap.Data.map(
          (item) => ({
            x: item.CurrentLapDistance,
            y: (item.Brake / 255) * 100
          })
      );

      const steer_data: {x: number, y: number}[] = lap.Data.map(
          (item) => ({
            x: item.CurrentLapDistance,
            y: (item.Steer / 128) * 100
          })
      );

      return {
        speed: { label, data: speed_data },
        accel: { label, data: accel_data },
        brake: { label, data: brake_data },
        steer: { label, data: steer_data },
      }
    }
  },

  computed: {
    currentRoute(): RouteLocationNormalizedLoaded {
      return this.$router.currentRoute.value;
    },

    dataset_1(): DatasetSelection|null {
      if (! this.lap_selection_1) {
        return null;
      }

      const lap = this.laps.find((lap: Lap) => lap.Number == this.lap_selection_1);

      if (! lap) {
        return null;
      }

      return this.getLapDatasetSelection(lap);
    },

    dataset_2(): DatasetSelection|null {
      if (! this.lap_selection_1) {
        return null;
      }

      const lap = this.laps.find((lap: Lap) => lap.Number == this.lap_selection_2);

      if (! lap) {
        return null;
      }

      return this.getLapDatasetSelection(lap);
    },
  },

  beforeMount() {
    this.loadSession();
  }
});
</script>
