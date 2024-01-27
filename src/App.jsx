// WordleGame.js
import React, { useState, useEffect } from "react";
import WordDisplay from "./WordDisplay";

const WordleGame = () => {
  return (
    <div tabIndex="0" className="wordle-game-container">
      <WordDisplay />
    </div>
  );
};

export default WordleGame;
