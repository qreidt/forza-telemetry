<script setup lang="ts">
const secondaryNavigation = [
  { name: 'Live', href: '/' },
  { name: 'History', href: '/history' },
];
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

          <RouterLink to="/sessions" active-class="text-indigo-400">
            Previous Sessions
          </RouterLink>
        </ul>
      </nav>
    </header>
    <RouterView />
  </main>
</template>
