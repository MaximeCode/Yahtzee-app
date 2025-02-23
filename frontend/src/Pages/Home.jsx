import img_accueil from "../assets/photo_accueil.webp";
import React from "react";
import {Link} from "react-router-dom";

export function Home() {

    return (
        <div className="flex flex-column">
            <img src={img_accueil} alt="Home" className="img-fluid rounded-3"/>
            <div className="my-5">
                <h1 className="mb-4">Yahtzee: roll the dice, score points and win the game!</h1>
                <h3>Yahtzee World - Fun Gaming App</h3>
            </div>
            <Link to="/game">
                <button type="button" className="btnToClick fs-5" id="btnPlay">Play now</button>
            </Link>
            <Link to="/scores">
                <button type="button" className="btnToClick fs-5" id="btnSeeScores">See other players scores</button>
            </Link>
        </div>
    );
}