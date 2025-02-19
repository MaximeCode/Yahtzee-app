import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export function Scores() {

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer les scores depuis l'API PHP
    async function fetchScores() {
      try {
        // Appel à l'API pour obtenir les scores
        const response = await fetch("http://localhost/yahtzee-app/backend/get_scores.php");
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

  return (
    <div className="pb-1">
      <Link to="/">
        <div className="position-absolute top-0 start-0 mt-4 ms-5 toHover">
          <i className="fa-solid fa-left-long fa-2xl"></i>
        </div>
      </Link>
      <h1 className="mb-5">Scores des meilleurs joueurs de la planète :</h1>

      {loading ? (
        <div className="text-success">
          <div className="spinner-border" role="status"></div>
          <div className="fs-3">Loading...</div>
        </div>
      ) : (
        !scores[0] ? (
          <h3>Aucun joueur n'a enregistré son score !<br />Soyez le premier (et donc le meilleur :) </h3>
        ) : (
          scores.map((score, index) => (
            <div key={score["id"]} className="bandeau w-75 mx-auto fs-5 py-2">
              <div>{index === 0 ? "🏆" : index + 1}</div>
              <div>{score["name"]}</div>
              <div>{score["score"]} pts</div>
              <div>Score effectué le {score["date"]}</div>
            </div>
          ))
        )
      )}


    </div>
  );
}