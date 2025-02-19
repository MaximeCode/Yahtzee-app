export function Dice({ value }) {
  const diceClasses = {
    1: "fa-dice-one",
    2: "fa-dice-two",
    3: "fa-dice-three",
    4: "fa-dice-four",
    5: "fa-dice-five",
    6: "fa-dice-six fa-rotate-90"
  };

  const diceClass = `fa-solid ${diceClasses[value]} text-white`;

  return (
    <div className="die">
      <i className={diceClass}></i>
    </div>
  );
}

export default Dice;
