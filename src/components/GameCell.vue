<template>
  <div
    class="flex justify-center items-center h-full text-4rem font-semibold text-white"
    :class="displayColor"
  >
    {{ cell.displayValue }}
  </div>
</template>

<script>
export default {
  props: {
    cell: Object
  },
  data() {
    return {
      colorsMap: {
        2: "bg-gray-600",
        4: "bg-red-600",
        8: "bg-orange-600",
        16: "bg-yellow-600",
        32: "bg-green-600",
        64: "bg-teal-600",
        128: "bg-blue-600",
        256: "bg-indigo-600",
        512: "bg-purple-600",
        1024: "bg-pink-600",
        2048: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"
      }
    };
  },
  computed: {
    displayColor() {
      if (!this.cell.displayValue) {
        return null;
      }
      return this.colorsMap[this.cell.displayValue] || this.colorsMap["2048"];
    }
  }
};
</script>
