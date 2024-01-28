import { useState, useEffect, useMemo } from "react";
import { Modal, Flex, Card, Badge, Button } from "antd";
import { BulbOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import "./WordGame.css";

import footballPlayersJSON from "../../assets/playersData.json";
import WordGameHint from "../../components/WordGameHint";
import WordGameDisplay from "../../components/WordGameDisplay";
import WordGameInput from "../../components/WordGameInput";
import WordGameResult from "../../components/WordGameResult";
import WordGameHowToPlay from "../../components/WordGameHowToPlay";

const maxAttempts = 6;

const WordGame = () => {
  const [hiddenWord, setHiddenWord] = useState(footballPlayersJSON[Math.floor(Math.random() * footballPlayersJSON.length)]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [inputs, setInputs] = useState(Array(hiddenWord.length).fill(""));
  const [guess, setGuess] = useState("");
  const [isCongratulationsVisible, setIsCongratulationsVisible] = useState(false);
  const [isAttemptsFinished, setIsAttemptsFinished] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isHowToPlayModalVisible, setIsHowToPlayModalVisible] = useState(false);

  const mainWord = useMemo(() => {
    try {
      const name = hiddenWord.name;
      const nameArray = name.split(" ");
      return nameArray[0];
    } catch (error) {
      return "";
    }
  }, [hiddenWord]);

  useEffect(() => {
    if (attempts >= maxAttempts) {
      setIsAttemptsFinished(true);
    }
  }, [attempts, hiddenWord]);

  useEffect(() => {
    onGameReset();
  }, [hiddenWord]);

  const handleGuess = () => {
    if (guess.toLowerCase() === mainWord.toLowerCase()) {
      const feedbackText = generateFeedback(guess);
      setFeedback([...feedback, feedbackText]);
      setIsCongratulationsVisible(true);
    } else if (guess.length < mainWord.length) {
      return;
    } else if (!checkPlayerInJSON()) {
      Modal.error({
        title: "Invalid Player",
        content: "The player you entered is not in the list. Please enter a valid player.",
        onOk: resetInput,
        centered: true,
      });
      resetInput();
    } else {
      setAttempts(attempts + 1);
      const feedbackText = generateFeedback(guess);
      setFeedback([...feedback, feedbackText]);
      resetInput();
    }
  };

  const checkPlayerInJSON = () => {
    const playerName = guess.toLowerCase();

    const isPlayerinJSON = footballPlayersJSON.some((player) => {
      if (player.name.toLowerCase().includes(playerName)) {
        return true;
      }
      return false;
    });

    return isPlayerinJSON;
  };

  const generateFeedback = (currentGuess) => {
    let feedbackText = [];
    for (let i = 0; i < mainWord.length; i++) {
      let status = "";

      if (currentGuess[i].toLowerCase() === mainWord[i].toLowerCase()) {
        status = "correct";
      } else {
        const isLetterInWord = mainWord.toLowerCase().includes(currentGuess[i].toLowerCase());

        if (isLetterInWord) {
          status = "incorrect_position";
        } else {
          status = "incorrect";
        }
      }

      feedbackText.push({ letter: currentGuess[i], status });
    }

    return feedbackText;
  };

  const resetGame = async () => {
    const newHiddenWord = await generateRandomWord();
    setHiddenWord(newHiddenWord);
  };

  const onGameReset = () => {
    setFeedback([]);
    setAttempts(0);
    setIsCongratulationsVisible(false);
    setIsAttemptsFinished(false);
    setIsHintVisible(false);
    resetInput();
  };

  const resetInput = () => {
    setGuess("");
    setInputs(Array(mainWord.length).fill(""));
  };

  useEffect(() => {
    if (inputs.every((input) => input == "")) {
      const input = document.getElementById(`input-0`);
      input.focus();
    }
  }, [inputs]);

  const generateRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * footballPlayersJSON.length);
    return footballPlayersJSON[randomIndex];
  };

  const handleInputChange = (index, value, e) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setGuess(newInputs.join(""));

    if (index < mainWord.length - 1 && value !== "") {
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.keyCode === 8 && index > 0 && inputs[index] === "") {
      const previousInput = document.getElementById(`input-${index - 1}`);
      previousInput.focus();
    }

    if (e.keyCode === 13) {
      handleGuess();
    }
  };

  const showHint = () => {
    Modal.confirm({
      title: "Confirm Show Hint ?",
      content: "Showing a hint will decrease your remaining attempts by 1.",
      onOk: handleShowHint,
      centered: true,
    });
  };

  const handleShowHint = () => {
    if (attempts + 1 === maxAttempts) {
      Modal.error({
        title: "Sorry! You've run out of attempts.",
        content: `The correct word was "${mainWord}".`,
        onOk: resetGame,
        centered: true,
      });
      return;
    }
    setAttempts(attempts + 1);
    setIsHintVisible(true);
  };

  console.log({
    hiddenWord,
    mainWord,
    attempts,
    isCongratulationsVisible,
    isAttemptsFinished,
    isHintVisible,
  });

  return (
    <div className="word-display">
      <Badge.Ribbon text={`Attempts: ${attempts}/${maxAttempts} `} color="green">
        <Card className="game-card" title="Footuiqz" size="small">
          <WordGameDisplay feedback={feedback} />

          {isCongratulationsVisible || isAttemptsFinished ? (
            <WordGameResult isWinner={isCongratulationsVisible} hiddenWord={hiddenWord} mainWord={mainWord} attempts={attempts} handlePlayAgain={resetGame} />
          ) : (
            <>
              <WordGameInput inputs={inputs} handleInputChange={handleInputChange} handleKeyDown={handleKeyDown} />

              {!isHintVisible && (
                <Flex align="center" justify="center" style={{ margin: "40px 0" }}>
                  <Button onClick={showHint} className="show-hint-button" icon={<BulbOutlined />} type="text">
                    Show Hint
                  </Button>
                </Flex>
              )}
              {isHintVisible && !isCongratulationsVisible && <WordGameHint player={hiddenWord} />}
            </>
          )}
        </Card>
      </Badge.Ribbon>

      {/* how to play */}

      <Flex align="center" justify="center" style={{ margin: "40px 0" }}>
        <Button onClick={() => setIsHowToPlayModalVisible(true)} className="home-how-to-play how-to-play-button" icon={<QuestionCircleOutlined />} type="text">
          How to Play ?
        </Button>
      </Flex>

      {isHowToPlayModalVisible && <WordGameHowToPlay visible={isHowToPlayModalVisible} onCancel={() => setIsHowToPlayModalVisible(false)} />}
    </div>
  );
};

export default WordGame;
