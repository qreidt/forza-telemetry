<script setup lang="ts">
//
</script>

<template>
  <div class=""></div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {RouteLocationNormalizedLoaded} from "vue-router";
import type {Lap, PersistedSession, PersistedSessionLightData} from "../../../types/Session";
import {getSession, loadLapTelemetry} from "../../../services/session";
import {addIsAllTimeBestLaptimeToLaps} from "../../../helpers/mapper";

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
    };
  },

  methods: {
    async loadSession() {
      this.session_id = this.currentRoute.params.session_id;
      const session = await getSession(this.session_id);
      this.setSession(session);

      this.loadFastestLap();
    },

    loadFastestLap() {
      const best_lap_id = this.laps.find((lap: Lap) => lap.IsAllTimeBest === true)?._id;

      if (! best_lap_id) {
        return;
      }

      this.loadLapsTelemetries([best_lap_id]);
    },

    async loadLapsTelemetries(lap_ids: string[]) {
      const laps = (await loadLapTelemetry(this.session_id, lap_ids))
          .reduce((aggr: Record<string, Lap>, lap: Lap) => {
            aggr[lap._id!] = lap;
            return aggr;
          }, {});

      this.laps = this.laps.map((lap: Lap) => {
        if (lap._id! in laps) {
          return laps[lap._id!];
        }

        return lap;
      });
    },

    setSession(session: PersistedSession): PersistedSession {
      this.track_ordinal = session.trackOrdinal;
      this.car_ordinal = session.carOrdinal;
      this.created_at = session.createdAt;
      this.updated_at = session.updatedAt;

      this.laps = addIsAllTimeBestLaptimeToLaps(
          session.lightData.Laps,
          session.lightData.BestLapTime
      );

      delete session.lightData.Laps;
      this.light_data = session.lightData

      return session;
    },
  },

  computed: {
    currentRoute(): RouteLocationNormalizedLoaded {
      return this.$router.currentRoute.value;
    },
  },

  beforeMount() {
    this.loadSession();
  }
});
</script>
