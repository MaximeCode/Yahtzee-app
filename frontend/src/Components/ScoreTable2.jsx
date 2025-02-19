import React, { useEffect, useState } from "react";
import { isGoodChoice } from "../utils/fonctionJeu2";
import { Popover } from "bootstrap";

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ! ADD "?" and when the user clicks on it -> modal with rules of the action !
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function ScoreTable2({
                              scores,
                              points,
                              calcBonus,
                              lowerTotal,
                              upperTotal,
                              pointsFirstGame,
                              diceValues,
                              clearDices,
                              countSecondGame,
                              setCountSecondGame
                            }) {

  const initialClickedCase = Array(7).fill(false);
  const [clickedCase, setClickedCase] = useState(initialClickedCase);

  const changeBtn = (index) => {
    const newClickedCase = clickedCase.map((value, indexCase) => {
      return index === indexCase ? true : value;
    });
    setClickedCase(newClickedCase);
    setCountSecondGame(countSecondGame + 1);
  };

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll("[data-bs-toggle=\"popover\"]");
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new Popover(popoverTriggerEl));
    // Optional: Cleanup function to destroy popovers when the component is unmounted
    return () => {
      popoverList.forEach(popover => popover.dispose());
    };
  }, [scores]);

  const infoPopover = [
    "You must have 3 identical dice",
    "You must have 4 identical dice",
    "You must have 3 identical dice and 2 identical dice",
    "You must have a suite of 4 dice",
    "You must have a suite of 5 dice",
    "You must have 5 identical dice",
    "You must make maximum points with 5 dice"
  ];

  return (
    <table className="score-table">
      <thead>
      <tr>
        <th colSpan="2" className="section-header">LOWER SECTION</th>
        <th className="section-header">MY POINTS</th>
      </tr>
      </thead>
      <tbody>
      {Object.entries(scores).map(([key, value], index) => (
        <tr key={index}>
          <td className={`text-end ${clickedCase[index] ? "" : "score"}`}
              onClick={!clickedCase[index] ? () => {
                isGoodChoice(key, diceValues, points, index);
                changeBtn(index);
                clearDices();
              } : null}>
            {key}
            <a
              tabIndex="0"
              role="button"
              data-bs-toggle="popover"
              data-bs-trigger="hover"
              data-bs-placement="top"
              data-bs-custom-class="custom-popover"
              data-bs-title={`How to do ${key} :`}
              data-bs-content={`${infoPopover[index]}`}>
              <i className="ms-1 fa-solid fa-circle-question"></i>
            </a>
          </td>
          <td>
            {value}
          </td>
          <td>{points[index]}</td>
        </tr>
      ))}
      <tr>
        <td>Bonus for Yahtzee</td>
        <td className="bonus">Bonus 100 pts</td>
        <td className="bonus">{calcBonus(points, true)}</td>
      </tr>

      <tr>
        <td colSpan="2" className="total-section section-header">Total lower section</td>
        <td className="total-section section-header">{lowerTotal(points)}</td>
      </tr>
      <tr>
        <td colSpan="2" className="total-section section-header">Total upper section</td>
        <td className="total-section section-header">{upperTotal(pointsFirstGame)}</td>
      </tr>
      </tbody>
    </table>

  )
    ;
}

