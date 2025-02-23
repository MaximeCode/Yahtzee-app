import React, {useState} from "react";

export function ScoreTable1({scores, points, onclickAddPts, calcSubtotal, calcBonus, calcUpperTotal, clickedCase, setClickedCase, gameFinished}) {

    const changeBtn = (index) => {
        const newClickedCase = clickedCase.map((value, indexCase) => {
            return index === indexCase ? true : value;
        });
        setClickedCase(newClickedCase);
    };


    return (
        <table className="score-table">
            <thead>
            <tr>
                <th colSpan="2" className="section-header">UPPER SECTION</th>
                <th className="section-header">MY POINTS</th>
            </tr>
            </thead>
            <tbody>

            {Object.entries(scores).map(([key, value], index) => (
                <tr key={index}>
                    <td>Total of</td>
                    <td className={`text-end ${clickedCase[index] ? "" : "score"}`}
                        onClick={!clickedCase[index] && !gameFinished ? () => {
                            onclickAddPts(index);
                            changeBtn(index);
                        } : null}>
                        {key} <i className={`fa-solid fa-xl ${value} ms-2`}></i>
                    </td>
                    <td>{points[index]}</td>
                </tr>
            ))}

            <tr>
                <td colSpan="2" className="subtotal">Subtotal</td>
                <td className="subtotal">{calcSubtotal(points)}</td>
            </tr>
            <tr>
                <td>If you've + 63 pts</td>
                <td className="bonus">Bonus 35 pts</td>
                <td className="bonus">{calcBonus(points, false)}</td>
            </tr>

            <tr>
                <td colSpan="2" className="total-section section-header">Total upper section</td>
                <td className="total-section section-header">{calcUpperTotal(points)}</td>
            </tr>
            </tbody>
        </table>);
}