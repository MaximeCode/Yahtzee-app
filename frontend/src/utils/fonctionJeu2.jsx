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
    // Final result of counts is like {1: 2, 2: 3, ...} (2 ones, 3 twos, ...)

    // Pour les Suites :

    const smallStraightPossible = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
    ];

    const bigStraightPossible = [
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
        case "3 of a Kind":
            Object.entries(counts).forEach(([key, element]) => {
                if (element >= 3) {
                    return points[indexCase] = totalDice;
                }
            });
            break;

        case "4 of a Kind":
            Object.entries(counts).forEach(([key, element]) => {
                if (element >= 4) {
                    return points[indexCase] = totalDice;
                }
            });
            break;

        case "Full House":
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

        case "Small Straight":
            for (let sequence of smallStraightPossible) {
                let match = sequence.every(value => sortedDiceValues.includes(value));
                if (match) {
                    return points[indexCase] = 30;
                }
            }
            break;

        case "Large Straight":
            for (let sequence of bigStraightPossible) {
                let match = sequence.every(value => sortedDiceValues.includes(value));
                if (match) {
                    return points[indexCase] = 40;
                }
            }
            break;

        case "Yahtzee":
            console.log("counts : ", counts);
            Object.entries(counts).forEach(([key, element]) => {
                console.log("element", element);
                if (element === 5 && key !== "0") {
                    return points[indexCase] = 50;
                }
            });
            break;

        case "Chance":
            return points[indexCase] = totalDice;

        default:
    }
}
