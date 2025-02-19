import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dice from "../Components/Dice";
import { randomNumber } from "../utils/utils";
import { ScoreTable1 } from "../Components/ScoreTable1";
import { ScoreTable2 } from "../Components/ScoreTable2";
import { Button, Modal } from "react-bootstrap";


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ! ADD MODALS ON FIRST LOADING OF PAGE to know how to play !
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//////////////// Valeur initial de chaque state

const initialDiceValues = [0, 0, 0, 0, 0];
const initialKeptDice = [false, false, false, false, false];
const initialLaps = 3;
const initialPointsFirstGame = Array(6).fill(0);
const initialPointsSecondGame = Array(7).fill(0);

//////////////// Tableaux des scores

const scoresFirstGame = {
  "One": "fa-dice-one",
  "Two": "fa-dice-two",
  "Three": "fa-dice-three",
  "Four": "fa-dice-four",
  "Five": "fa-dice-five",
  "Six": "fa-dice-six fa-rotate-90"
};

const scoresSecondGame = {
  "Brelan": "Total des 5 dés",
  "Carre": "Total des 5 dés",
  "Full": "25 pts",
  "Petite suite": "30 pts",
  "Grande suite": "40 pts",
  "Yahtzee": "50 pts",
  "Chance": "Total des 5 dés"
};

export function Game() {

  ///////////// Modal Bootstrap

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showS, setShowS] = useState(false);
  const handleCloseS = () => setShowS(false);
  const handleShowS = () => setShowS(true);

  //////////////////////////// useState

  // Valeur des dés
  const [diceValues, setDiceValues] = useState(initialDiceValues);
  // Dé gardé durant la partie
  const [keptDice, setKeptDice] = useState(initialKeptDice);
  //Nb de tour
  const [laps, setLaps] = useState(initialLaps);
  //points 1ère partie
  const [pointsFirstGame, setpointsFirstGame] = useState(initialPointsFirstGame);
  //points 2nde partie
  const [pointsSecondGame, setpointsSecondGame] = useState(initialPointsSecondGame);
  // Bool 1ère partie terminée
  const [firstGameIsFinished, setFirstGameIsFinished] = useState(false);
  // Quand les 6 cases ont été joué, on affiche le texte avec un bouton vers la partie suivante
  const [countGame, setCountGame] = useState(0);
  // Count seconde partie
  const [countSecondGame, setCountSecondGame] = useState(0);

  // Clear State
  const clearCountGame = () => {
    setCountGame(0);
  };

  const clearCountSecondGame = () => {
    setCountSecondGame(0);
  };
  const clearLaps = () => {
    setLaps(initialLaps);
  };
  const clearKeptDice = () => {
    setKeptDice(initialKeptDice);
  };
  const clearDiceValues = () => {
    setDiceValues(initialDiceValues);
  };
  const clearDices = () => {
    clearKeptDice();
    clearLaps();
    clearDiceValues();
  };

  const resetGame = () => {
    clearCountGame();
    clearCountSecondGame();
    clearDices();
    setpointsFirstGame(initialPointsFirstGame);
    setpointsSecondGame(initialPointsSecondGame);
    setFirstGameIsFinished(false);
  };

  //////////////////////////// Fonctions, variables...

  // Switch dé gardé <=> dé à rejouer
  const toggleKeptDice = (diceIndex) => {
    setKeptDice(keptDice.map((kept, i) => (i === diceIndex ? !kept : kept)));
  };

  // Somme des 5 dés
  let total5Dice = diceValues.reduce((a, b) => a + b, 0);

  // Relancer les dés non gardés par le joueur
  const rerollDice = () => {
    const newDiceValues = diceValues.map((value, index) => {
      return keptDice[index] ? value : randomNumber();
    });
    setDiceValues(newDiceValues);
    setLaps(laps - 1);
  };

  const addPts = (index) => {
    let diceCase = index + 1;
    let count = 0;
    diceValues.forEach((element) => {
      if (element === diceCase) {
        count += 1;
      }
    });

    //calcul puis affichage dans la case correspondante
    let result = (count * diceCase);
    setpointsFirstGame(pointsFirstGame.map((number, i) => (i === index ? result : number)));

    setCountGame(countGame + 1);
    clearDices();
  };

  const subtotal = (points) => points.reduce((a, b) => a + b, 0);
  const calculateBonus = (points, firstGameIsFinished) => {
    if (!firstGameIsFinished) {
      return subtotal(points) >= 63 ? 35 : 0;
    } else {
      // Assumes the Yahtzee condition is met if there are any points in the second game (this should be replaced by actual Yahtzee logic)
      return points.includes(50) ? 100 : 0;
    }
  };
  const upperTotal = (points) => subtotal(points) + calculateBonus(points, firstGameIsFinished);
  const lowerTotal = (points) => subtotal(points) + calculateBonus(points, firstGameIsFinished);

  let finalTotal = upperTotal(pointsFirstGame) + lowerTotal(pointsSecondGame);

  // Fonction asynchrone -> envoi des données vers le serveur
  const [playerName, setPlayerName] = useState("");
  const [mes, setMes] = useState("");
  const [scoreAdded, setScoreAdded] = useState(false);
  const addScore = async () => {
    try {
      const response = await fetch("http://localhost/yahtzee-app/backend/add_scores.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: playerName, score: finalTotal })
      });
      const result = await response.json();
      if (result.success) {
        setMes("Score successfully added !");
        setScoreAdded(true);
      } else {
        setMes("Error adding score !");
        console.error(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du score:", error);
    }
  };

  return (
    <div className="game py-4">
      <Link to="/">
        <div className="position-absolute top-0 start-0 mt-4 ms-5 toHover">
          <i className="fa-solid fa-left-long fa-2xl"></i>
        </div>
      </Link>
      <div className="row justify-content-between">
        <div className="col-12 col-md-5 d-flex justify-content-center mb-4">
          {!firstGameIsFinished ?
            <ScoreTable1 scores={scoresFirstGame} points={pointsFirstGame} onclickAddPts={addPts}
                         calcSubtotal={subtotal} calcBonus={calculateBonus}
                         calcUpperTotal={upperTotal} />
            :
            <ScoreTable2 scores={scoresSecondGame} points={pointsSecondGame} clearDices={clearDices}
                         countSecondGame={countSecondGame} setCountSecondGame={setCountSecondGame}
                         calcBonus={calculateBonus} diceValues={diceValues}
                         lowerTotal={lowerTotal} upperTotal={upperTotal} pointsFirstGame={pointsFirstGame} />}
        </div>

        {!firstGameIsFinished ? (
          countGame < 6 ? (
            <div className="col">
              <div className="fs-4">Remaining laps : {laps}</div>

              {diceValues[0] !== 0 && (
                <>
                  <div className="row my-5" id="diceRow">
                    {diceValues.map((value, index) => (
                      <div
                        key={index}
                        className={`col d-flex flex-column justify-content-center align-items-center mt-0`}
                      >
                        <Dice key={index} value={value} />
                        <button
                          type="button"
                          className={`btnToClick ${keptDice[index] ? "grey" : ""}`}
                          id="btnKeepDice"
                          onClick={() => toggleKeptDice(index)}
                        >
                          {keptDice[index] ? "Roll the dice" : "Keep the dice"}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="my-5 fs-3 fw-bold">Total of 5 dice : {total5Dice}</div>
                </>
              )}

              {laps >= 1 ? (<button type="button" onClick={rerollDice} className="btnToClick my-4 fs-5">
                Throw the dice
              </button>) : (<button type="button" disabled className="btnToClick my-4 fs-5 grey cursor-disabled">
                It was the last lap
              </button>)}
            </div>
          ) : (
            <div className="col my-5 fs-3 fw-bold" id="textEndFirstGame">
              <div>You've just completed part 1 of Yahtzee!</div>
              <div>Congratulations, you can now proceed to the 2nd and final part!</div>
              <div>Good luck!</div>
              <button
                type="button"
                onClick={() => {
                  setFirstGameIsFinished(true);
                  clearDices();
                  clearCountGame();
                }}
                className="btnToClick"
              >
                Next to the final part
              </button>
            </div>
          )
        ) : (
          countSecondGame < 7 ? (
            <div className="col">
              <div className="fs-4">Remaining laps : {laps}</div>
              {diceValues[0] !== 0 && (
                <>
                  <div className="row my-5" id="diceRow">
                    {diceValues.map((value, index) => (<div
                      key={index}
                      className={`col d-flex flex-column justify-content-center align-items-center mt-0`}
                    >
                      <Dice key={index} value={value} />
                      <button
                        type="button"
                        className={`btnToClick ${keptDice[index] ? "grey" : ""}`}
                        id="btnKeepDice"
                        onClick={() => toggleKeptDice(index)}
                      >
                        {keptDice[index] ? "Roll the dice" : "Keep the dice"}
                      </button>
                    </div>))}
                  </div>
                  <div className="my-5 fs-3 fw-bold">Total of 5 dice : {diceValues.reduce((a, b) => a + b, 0)}</div>
                </>)}

              {laps >= 1 ? (
                <button type="button" onClick={rerollDice} className="btnToClick my-4 fs-5">
                  Throw the dice
                </button>
              ) : (
                <button type="button" disabled className="btnToClick my-4 fs-5 grey cursor-disabled">
                  It was the last lap
                </button>
              )}
            </div>
          ) : (
            <div className="col my-5 fs-3 fw-bold" id="textEndFirstGame">
              <div>
                <div>You've finished Yahtzee game with</div>
                <div>
                  <span
                    className="display-1 fw-bold">{finalTotal}</span>
                  pts
                </div>
                <div>🥳 Congratulations ! 🎉</div>
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  onClick={() => {
                    resetGame();
                  }}
                  className="btnToClick"
                  id="replay"
                >
                  Replay the game
                </button>
                <Link to="/" className="btnToClick d-flex align-items-center text-decoration-none" id="backToHome"
                      onClick={() => {
                        resetGame();
                      }}>
                  Back to Home Page
                </Link>
              </div>
              <div className="d-flex justify-content-between">
                {scoreAdded ? ("") : (
                  <Button className="btnToClick" id="saveScore" variant="primary" onClick={handleShow}>
                    Save my score
                  </Button>
                )}
                <Link to="/scores" className="btnToClick d-flex align-items-center text-decoration-none"
                      id="btnSeeScores" onClick={() => {
                  resetGame();
                }}>
                  See other players scores
                </Link>
              </div>

              {/* Modal 1 with input and addScores */}
              <Modal show={show} onHide={handleClose} className="modals">
                <Modal.Header closeButton>
                  <Modal.Title>Save my score</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="mb-3 text-center">
                    <label htmlFor="player_name" className="col-form-label fs-4">What's your name ?</label>
                    <input type="text" className="form-control text-center fs-5" id="player_name" value={playerName}
                           onChange={(e) => {
                             setPlayerName(e.target.value);
                           }}
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" className="btn btn-success"
                          onClick={playerName === "" ?
                            () => alert("You must enter your name to save your score !")
                            :
                            () => {
                              addScore();
                              handleClose();
                              handleShowS();
                            }
                          }
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Modal go to Scores page */}
              <Modal show={showS} onHide={handleCloseS} className="text-dark modals">
                <Modal.Header closeButton>
                  <Modal.Title>{!mes ? "Add score" : "Successful !"}</Modal.Title>
                </Modal.Header>
                {mes ? (
                  <>
                    <Modal.Body>{mes}</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseS}>
                        Close
                      </Button>
                      <Link to="/scores">
                        <Button variant="primary" onClick={handleCloseS} className="btn btn-success">
                          Open the high scores page
                        </Button>
                      </Link>
                    </Modal.Footer>
                  </>
                ) : (
                  <div className="text-success my-3 text-center">
                    <div className="spinner-border" role="status"></div>
                    <div className="fs-3">Loading...</div>
                  </div>
                )}
              </Modal>
            </div>
          )
        )}
      </div>

    </div>);

}


