import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Input, Modal, Flex, Divider, Card, Badge } from "antd";
import "./WordDisplay.css"; // Import custom CSS for WordDisplay styling

const { Text } = Typography;

const colorClass = (status) => {
  switch (status) {
    case "correct":
      return "green";
    case "incorrect_position":
      return "yellow";
    case "incorrect":
      return "red";
    default:
      return "";
  }
};

const footballers = [
  "Messi",
  "Ronaldo",
  "Neymar",
  "Mbappe",
  "Haaland",
  "Lewandowski",
  "DeBruyne",
  "Kante",
  "Salah",
  "Kane",
  "Son",
  "Fernandes",
  "Ramos",
  "Varane",
  "VanDijk",
  "Alisson",
  "TerStegen",
  "DeJong",
  "Henderson",
  "Laporte",
  "Gundogan",
  "Foden",
  "Sterling",
  "Sancho",
  "Rashford",
  "Bellingham",
  "Mount",
  "Kimmich",
  "Sane",
  "Muller",
  "Gnabry",
  "Havertz",
  "Coman",
  "Lewandowski",
  "Alaba",
  "Neuer",
  "Lloris",
  "Kimpembe",
  "Pogba",
  "Kante",
  "Griezmann",
  "Dembele",
  "Zouma",
  "Chilwell",
  "Rice",
  "Maguire",
  "Shaw",
  "Pickford",
  "Benzema",
  "Modric",
  "Kroos",
  "Casemiro",
  "Valverde",
  "Courtois",
  "Carvajal",
  "Marcelo",
  "Mendy",
  "Casemiro",
  "Bale",
  "Isco",
  "Vinicius",
  "Asensio",
  "Jovic",
  "Firmino",
  "Alisson",
  "Thiago",
  "Fabinho",
  "DiogoJota",
  "AlexanderArnold",
  "Robertson",
  "Maguire",
  "Shaw",
  "Rashford",
  "Lingard",
  "Greenwood",
  "Sancho",
  "Pogba",
  "McTominay",
  "Fred",
  "BrunoFernandes",
  "DeGea",
  "Cavani",
  "Llorente",
  "Correa",
  "Koke",
  "Saul",
  "Suarez",
  "Oblak",
];

const FeedbackLine = ({ feedbackLine }) => {
  return (
    <Flex align="center" justify="center" gap="10px" className="feedback-line">
      {feedbackLine.map((item, charIndex) => (
        <div key={charIndex} className={`feedback-box ${colorClass(item.status)}`}>
          <span>{item.letter.toUpperCase()}</span>
        </div>
      ))}
    </Flex>
  );
};

const WordDisplay = () => {
  const [hiddenWord, setHiddenWord] = useState(footballers[Math.floor(Math.random() * footballers.length)]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [inputs, setInputs] = useState(Array(hiddenWord.length).fill(""));
  const [guess, setGuess] = useState("");
  const [isCongratulationsVisible, setIsCongratulationsVisible] = useState(false);

  useEffect(() => {
    if (attempts >= 5) {
      Modal.error({
        title: "Sorry! You've run out of attempts.",
        content: `The correct word was "${hiddenWord}".`,
        onOk: resetGame,
        centered: true,
      });
    }
  }, [attempts, hiddenWord]);

  useEffect(() => {
    resetInput();
  }, [hiddenWord]);

  useEffect(() => {
    if (isCongratulationsVisible) {
      Modal.success({
        title: "Congratulations!",
        content: `You guessed the word "${hiddenWord}" in ${attempts + 1} attempts.`,
        onOk: resetGame,
        centered: true,
      });
    }
  }, [isCongratulationsVisible, attempts, hiddenWord]);

  const handleGuess = () => {
    if (guess.toLowerCase() === hiddenWord.toLowerCase()) {
      setIsCongratulationsVisible(true);
    } else if (guess.length < hiddenWord.length) {
      return;
    } else {
      setGuess("");
      setAttempts(attempts + 1);
      const feedbackText = generateFeedback(guess);
      setFeedback([...feedback, feedbackText]);
      resetInput();
    }
  };

  const generateFeedback = (currentGuess) => {
    let feedbackText = [];
    for (let i = 0; i < hiddenWord.length; i++) {
      let status = "";

      if (currentGuess[i].toLowerCase() === hiddenWord[i].toLowerCase()) {
        status = "correct";
      } else {
        const isLetterInWord = hiddenWord.toLowerCase().includes(currentGuess[i].toLowerCase());

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

  const resetGame = () => {
    setGuess("");
    setHiddenWord(generateRandomWord());
    setAttempts(0);
    setFeedback([]);
    setIsCongratulationsVisible(false);
  };

  const resetInput = () => {
    setInputs(Array(hiddenWord.length).fill(""));
    const input = document.getElementById(`input-0`);
    input.focus();
  };

  const generateRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * footballers.length);
    return footballers[randomIndex];
  };

  const handleInputChange = (index, value, e) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setGuess(newInputs.join(""));

    if (index < hiddenWord.length - 1 && value !== "") {
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

  const renderInputs = () => {
    return inputs.map((input, index) => (
      <div className="guess-box" key={index}>
        <input
          id={`input-${index}`}
          style={{ width: "50px", textAlign: "center" }}
          maxLength={1}
          type="text"
          value={input}
          onChange={(e) => handleInputChange(index, e.target.value, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      </div>
    ));
  };

  const renderFeedback = () => {
    return feedback.map((feedbackLine, index) => <FeedbackLine key={index} feedbackLine={feedbackLine} />);
  };

  return (
    <div className="word-display">
      <Badge.Ribbon text={`Attempts: ${attempts}/5 `} color="green">
        <Card title="Football Wordle" size="small">
          {renderFeedback()}
          <Flex gap={10} align="center" justify="center">
            {renderInputs()}
          </Flex>
        </Card>
      </Badge.Ribbon>
    </div>
  );
};

export default WordDisplay;
