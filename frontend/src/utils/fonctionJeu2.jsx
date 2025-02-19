import { cLog } from "./utils";

export function isGoodChoice(type, diceValues, points, indexCase) {

  let totalDice = diceValues.reduce((a, b) => a + b, 0);

  let counts = {};
  diceValues.forEach((element) => {
    if (counts[element]) {
      counts[element] += 1;
    } else {
      counts[element] = 1;
    }
  });

  // Pour les Suites :

  const smallPossibleSuite = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6]
  ];

  const bigPossibleSuite = [
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6]
  ];

  const sortedDiceValues = [];

  diceValues.forEach((value) => {
    if (!sortedDiceValues.includes(value)) {
      sortedDiceValues.push(value);
    }
  });
  sortedDiceValues.sort();

  switch (type) {
    case "Brelan":
      Object.entries(counts).forEach(([key, element]) => {
        if (element >= 3) {
          return points[indexCase] = totalDice;
        }
      });
      break;

    case "Carre":
      Object.entries(counts).forEach(([key, element]) => {
        if (element >= 4) {
          return points[indexCase] = totalDice;
        }
      });
      break;

    case "Full":
      let isTriple = false;
      let isPair = false;
      Object.entries(counts).forEach(([key, element]) => {
        if (element === 2) {
          isPair = true;
        } else if (element === 3) {
          isTriple = true;
        }
      });
      points[indexCase] = isPair && isTriple ? 25 : 0;
      break;

    case "Petite suite":
      for (let sequence of smallPossibleSuite) {
        let match = sequence.every(value => sortedDiceValues.includes(value));
        if (match) {
          return points[indexCase] = 30;
        }
      }
      break;

    case "Grande suite":
      for (let sequence of bigPossibleSuite) {
        let match = sequence.every(value => sortedDiceValues.includes(value));
        if (match) {
          return points[indexCase] = 40;
        }
      }
      break;

    case "Yahtzee":
      Object.entries(counts).forEach(([key, element]) => {
        if (element === 5) {
          return points[indexCase] = 50;
        }
      });
      break;

    case "Chance":
      return points[indexCase] = totalDice;

    default:
  }
}
