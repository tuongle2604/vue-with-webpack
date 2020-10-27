<template>
  <div class="relative">
    <div class="bg-gray-800 p-2 flex flex-col" :class="{'disabled': isGameOver}">
      <div
        class="row flex"
        v-for="(row, rowIndex) in boardData"
        :key="rowIndex"
      >
        <div
          class="column"
          v-for="(cell, columnIndex) in row"
          :key="cell.uniqueId"
        >
          <div class="cell bg-gray-900 h-20 w-20 m-1">
            <GameCell
              :cell="cell"
              v-if="cell.displayValue"
              :ref="'cell' + rowIndex + columnIndex"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="absolute-center" v-if="isGameOver">
      <h3 class="text-center text-4rem text-blue-400">Game Over!</h3>
    </div>
  </div>
</template>

<script>
import GameCell from "./GameCell";
export default {
  name: "GameBoard",
  components: {
    GameCell
  },
  props: {
    boardData: Array,
    isGameOver: Boolean
  },
  created() {}
};
</script>
