<template>
  <div class="game-management flex justify-between mb-4">
    <div class="flex items-center">
      <button
        class="px-4 py-2 border border-blue-400 rounded bg-transparent text-blue-400 font-semibold hover:text-white hover:bg-blue-600 focus:outline-none"
        @click="$emit('new-game')"
      >New Game</button>
    </div>
    <h1 class="text-center text-8rem"> 2048 </h1>
    <div class="flex flex-col justify-center">
      <p class="font-semibold">Hight Score</p>
      <p class="text-center font-semibold text-4rem text-blue-400"> {{ score }} </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameManagement",
  props: {
    score: Number
  }
};
</script>
