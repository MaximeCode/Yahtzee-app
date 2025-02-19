import img_accueil from "../assets/photo_accueil.webp";
import React from "react";
import { Link } from "react-router-dom";

export function Home() {

  return (
    <div className="flex flex-column">
      <img src={img_accueil} alt="Accueil" width="600px" />
      <div className="flex">
        <h1 className="mt-5">Yahtzee : lancez les dés, marquez des points et remportez la partie !</h1>
        <h3>Yahtzee World - Fun Gaming App</h3>
      </div>
      <p>Play Yahtzee for endless fun!</p>
      <Link to="/game">
        <button type="button" className="btnToClick fs-5" id="btnPlay">Play now</button>
      </Link>
      <Link to="/scores">
        <button type="button" className="btnToClick fs-5" id="btnSeeScores">See other players scores</button>
      </Link>
    </div>
  );
}