<template>
  <div class="container h-full m-auto flex justify-center" ref="container">
    <div class="inline-flex flex-col">
      <GameManagement @new-game="onNewGame" :score="score"/>
      <GameBoard
        ref="GameBoard"
        :board-data="boardData"
        :isGameOver="isGameOver"
      />
    </div>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import GameBoard from "./components/GameBoard";
import _ from "lodash";
import GameManagement from "./components/GameManagement";
import Hammer from "hammerjs";

export default {
  components: {
    GameBoard,
    GameManagement
  },
  data() {
    return {
      boardData: [],
      boardSize: 4,
      defaultCell: 2,
      cellPerAction: 1,
      score: 0,
      isMoving: false,
      isGameOver: false
    };
  },
  mounted() {
    this.initBoard();
    this.initEventListener();
    this.generateCell(this.defaultCell);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyDown);
  },
  errorCaptured(err, vm, info) {
    alert("error");
    this.err = err;
    this.vm = vm;
    this.info = info;
    return !this.stopPropagation;
  },
  methods: {
    initBoard() {
      this.boardData = [];

      for (var row = 0; row < this.boardSize; row++) {
        const rows = [];
        for (var column = 0; column < this.boardSize; column++) {
          rows.push({
            row: row,
            column: column,
            value: null,
            displayValue: null,
            isMerged: false,
            uniqueId: null
          });
        }
        this.boardData.push(rows);
      }
    },
    initEventListener() {
      window.addEventListener("keydown", this.onKeyDown);
      this.handleSwipe();
    },
    generateCell(number = this.cellPerAction) {
      const availableCells = this.getAvailableCells();
      const cells = _.sampleSize(availableCells, number); // get ramdom cells from available cells
      cells.forEach(cell => this.addValueToCell(cell, this.getRandomValue()));
    },
    getRandomValue() {
      // 20% generate cell with value 4
      const rd = Math.random();
      return rd < 0.2 ? 4 : 2;
    },
    getAvailableCells() {
      return _(this.boardData)
        .flatten()
        .filter(o => o.value === null)
        .value();
    },
    addValueToCell(cell, value) {
      this.$set(cell, "value", value);
      this.$set(cell, "displayValue", value);
      this.$set(cell, "uniqueId", _.uniqueId());
    },
    getCell(position) {
      if (!this.checkCellInBoard(position)) {
        return null;
      }
      return this.boardData[position.row][position.column];
    },
    resetCellState() {
      _.flatten(this.boardData).forEach(cell => {
        cell.isMerged = false;
      });
    },
    handleSwipe() {
      const manager = new Hammer.Manager(this.$refs["container"]);
      const swipe = new Hammer.Swipe();
      manager.add(swipe);
      manager.on("swipe", event => {
        const direction = this.getHammerDirection(event.offsetDirection);
        if (!direction || this.isMoving) return;
        this.handleMove(direction);
      });
    },
    getHammerDirection(direction) {
      const mapDirection = {
        2: "left",
        4: "right",
        8: "up",
        16: "down"
      };

      return mapDirection[direction];
    },
    getVector(direction) {
      const mapDirection = {
        up: { row: -1, column: 0 },
        down: { row: 1, column: 0 },
        left: { row: 0, column: -1 },
        right: { row: 0, column: 1 }
      };

      return mapDirection[direction];
    },
    onKeyDown(event) {
      const mapKey = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
      };
      const direction = mapKey[event.keyCode];
      if (!direction || this.isMoving) return;

      this.handleMove(direction);
    },
    handleMove(direction) {
      if (this.isGameOver) {
        return;
      }

      const movePromises = [];
      const sortedBoard = this.getSortedBoard(direction);

      sortedBoard.forEach(cell => {
        const position = this.findFarthestPosition(cell, direction);
        const next = this.getCell(position.next);
        const farthest = this.getCell(position.farthest);
        // merge
        if (next && next.value === cell.value && !next.isMerged) {
          this.isMoving = true;
          next.isMerged = true;
          next.value = cell.value * 2;
          cell.value = null;
          movePromises.push(this.handleAnimate(cell, next, direction, true));
        } else if (cell !== farthest) {
          this.isMoving = true;
          farthest.value = cell.value;
          cell.value = null;
          movePromises.push(
            this.handleAnimate(cell, farthest, direction, false)
          );
        }
      });

      if (movePromises.length) {
        return Promise.all(movePromises).then(() => {
          this.generateCell();
          this.checkIsGameOver();
          this.resetCellState();
          this.isMoving = false;
        });
      }
    },
    getSortedBoard(direction) {
      const sortBy = ["down", "up"].includes(direction) ? "row" : "column";
      const sortType = ["up", "left"].includes(direction) ? "asc" : "desc";

      return _(this.boardData)
        .flatten()
        .filter(cell => cell.value !== null)
        .orderBy(sortBy, sortType)
        .value();
    },
    findFarthestPosition(cell, direction) {
      const vector = this.getVector(direction);
      let cloneCell = { row: cell.row, column: cell.column };
      let previous;

      do {
        previous = cloneCell;
        cloneCell = {
          row: previous.row + vector.row,
          column: previous.column + vector.column
        };
      } while (this.checkCellAvailable(cloneCell));

      return {
        farthest: previous,
        next: cloneCell // Used to check if a merge is required
      };
    },
    checkCellAvailable(cell) {
      return (
        this.checkCellInBoard(cell) &&
        this.boardData[cell.row][cell.column].value === null
      );
    },
    checkCellInBoard(cell) {
      return (
        cell.row >= 0 &&
        cell.row < this.boardSize &&
        cell.column >= 0 &&
        cell.column < this.boardSize
      );
    },
    checkIsGameOver() {
      const availableCells = this.getAvailableCells();
      const isMovePossible = this.checkIsMovePossible();

      if (!availableCells.length && !isMovePossible) {
        this.isGameOver = true;
      }
    },
    checkIsMovePossible() {
      const gameBoard = _.flatten(this.boardData);

      for (const cell of gameBoard) {
        const directions = ["up", "down", "left", "right"];
        for (const direction of directions) {
          const vector = this.getVector(direction);
          const position = {
            row: cell.row + vector.row,
            column: cell.column + vector.column
          };

          const checkingCell = this.getCell(position);
          if (!checkingCell) {
            continue;
          }
          if (!checkingCell.value || cell.value === checkingCell.value) {
            return true;
          }
        }
      }

      return false;
    },
    handleAnimate(currentCell, destinationCell, direction, isMerged) {
      const animeConfig = this.getAnimateConfig(
        currentCell,
        destinationCell,
        direction,
        isMerged
      );
      const animation = anime(animeConfig);

      const handleAfterAnimate = () => {
        const value = destinationCell.value / 2;
        this.addValueToCell(destinationCell, destinationCell.value);
        this.addValueToCell(currentCell, currentCell.value);
        if (isMerged) {
          this.score += value;
        }
      };

      return animation.finished.then(handleAfterAnimate);
    },
    getAnimateConfig(currentCell, destinationCell, direction, isMerged) {
      const { row, column } = currentCell;
      const cellName = "cell" + row + column;
      const cellComponent = this.$refs["GameBoard"].$refs[cellName];
      const cellElement = cellComponent && cellComponent[0] && cellComponent[0].$el;
      if (!cellElement) {
        console.log("here");
        return;
      }

      const stepsToMove = this.getSteps(
        currentCell,
        destinationCell,
        direction
      );

      const cellWidth = cellElement.offsetWidth;
      const gridGap = cellWidth / 10;
      const duration = stepsToMove * 50;
      const vector = this.getVector(direction);
      const translateY = vector.row * (gridGap + cellWidth) * stepsToMove;
      const translateX = vector.column * (gridGap + cellWidth) * stepsToMove;
      const scale = isMerged
        ? { value: 1.3, duration: 75, delay: duration, easing: "linear" }
        : { value: 1, duration: 50, delay: duration, easing: "linear" };

      return {
        targets: cellElement,
        translateY,
        translateX,
        duration,
        direction: "normal",
        easing: "linear",
        scale
      };
    },
    getSteps(currentCell, destinationCell, direction) {
      return ["up", "down"].includes(direction)
        ? Math.abs(currentCell.row - destinationCell.row)
        : Math.abs(currentCell.column - destinationCell.column);
    },
    onNewGame() {
      this.initBoard();
      this.generateCell(this.defaultCell);
      this.score = 0;
      this.isGameOver = false;
    }
  }
};
</script>
