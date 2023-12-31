<script setup lang="ts">
import {computed} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const currentSession = computed(() => {
  const current_route = router.currentRoute.value
  if (current_route.name !== 'Session') {
    return null;
  }

  const session_id = current_route.params.session_id.toString() as string;
  return `S${session_id.padStart(5, '0')}`;
});
</script>

<template>
  <main>
    <header>
      <!-- Secondary navigation -->
      <nav class="flex overflow-x-auto border-b border-white/10 py-4">
        <ul role="list" class="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8">
          <RouterLink to="/" active-class="text-indigo-400">
            Live
          </RouterLink>

          <RouterLink
              to="/sessions" active-class="text-indigo-400"
              :class="{'text-indigo-400': currentSession}"
          >
            Previous Sessions
          </RouterLink>

          <li v-if="currentSession" class="text-indigo-400">
            {{ currentSession }}
          </li>
        </ul>
      </nav>
    </header>
    <RouterView />
  </main>
</template>
