import React, {useEffect, useState} from "react";

import {format} from "date-fns";

export function Scores() {

    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fonction pour récupérer les scores depuis l'API PHP
        async function fetchScores() {
            try {
                // Appel à l'API pour obtenir les scores
                const response = await fetch("https://yahtzee.app.albabadminton.fr/get_scores.php");
                // Convertir la réponse en format JSON
                const data = await response.json();
                // Mettre à jour l'état avec les données récupérées
                setScores(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des scores:", error);
            } finally {
                setLoading(false);
            }
        }

        // Appeler la fonction pour récupérer les scores
        fetchScores();
    }, []);

    const first = "🏆";
    const second = "🥈";
    const third = "🥉";

    return (
        <div className="pb-1">
            <h1 className="mb-5">Scores des meilleurs joueurs de la planète :</h1>

            {loading ? (
                <div className="text-success">
                    <div className="spinner-border" role="status"></div>
                    <div className="fs-3">Loading...</div>
                </div>
            ) : (
                !scores[0] ? (
                    <h3>Aucun joueur n'a enregistré son score !<br/>Soyez le premier (et donc le meilleur 😉) </h3>
                ) : (
                    scores.map((score, index) => (
                        <div key={score["id"]}
                             className="bandeau row align-items-center text-center w-md-75 fs-5 py-2 px-3 rounded-pill">
                            <div className="col-1 px-1">
                                {index === 0 ? first : index === 1 ? second : index === 2 ? third : index + 1}
                            </div>
                            <div className="col row m-0 p-0">
                                <div className="col px-1">{score["name"]}</div>
                                <div className="col-auto col-md px-1">{score["score"]} pts</div>
                                <div className="col-12 col-md px-1" id="theScoreDate">
                                    Score effectué le {format(score["date"], 'dd/MM/yyyy')}
                                </div>
                            </div>
                        </div>
                    ))
                )
            )}
        </div>
    );
}