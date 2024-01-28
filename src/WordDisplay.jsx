import React, { useState, useEffect, useMemo } from "react";
import { Typography, Modal, Flex, Card, Badge, Button, Alert, ColorPicker, Collapse } from "antd";
import { TeamOutlined, GlobalOutlined, ScheduleOutlined, TrophyOutlined, BulbOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
import "./WordDisplay.css"; // Import custom CSS for WordDisplay styling

import footballPlayersJSON from "./playersData.json";

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

const maxAttempts = 6;

const WordDisplay = () => {
  const [hiddenWord, setHiddenWord] = useState(footballPlayersJSON[Math.floor(Math.random() * footballPlayersJSON.length)]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [inputs, setInputs] = useState(Array(hiddenWord.length).fill(""));
  const [guess, setGuess] = useState("");
  const [isCongratulationsVisible, setIsCongratulationsVisible] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);

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
      Modal.error({
        title: "Sorry! You've run out of attempts.",
        content: `The correct word was "${mainWord}".`,
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
        content: `You guessed the word "${mainWord}" in ${attempts + 1} attempts.`,
        onOk: resetGame,
        centered: true,
      });
    }
  }, [isCongratulationsVisible, attempts, hiddenWord]);

  const handleGuess = () => {
    if (guess.toLowerCase() === mainWord.toLowerCase()) {
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
      setGuess("");
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

  const resetGame = () => {
    setGuess("");
    setHiddenWord(generateRandomWord());
    setAttempts(0);
    setFeedback([]);
    setIsCongratulationsVisible(false);
    setIsHintVisible(false);
  };

  const resetInput = () => {
    setInputs(Array(mainWord.length).fill(""));
    const input = document.getElementById(`input-0`);
    input.focus();
  };

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
      // showing hint will decrease the attempt by 1
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

  console.log({ hiddenWord, mainWord });

  return (
    <div className="word-display">
      <Badge.Ribbon text={`Attempts: ${attempts}/${maxAttempts} `} color="green">
        <Card title="Footuiqz" size="small">
          {renderFeedback()}
          <Flex gap={10} align="center" justify="center">
            {renderInputs()}
          </Flex>
          {!isHintVisible && (
            <Flex align="center" justify="center" style={{ marginTop: "40px" }}>
              <Button onClick={showHint} className="show-hint-button" icon={<BulbOutlined />} type="text">
                Show Hint
              </Button>
            </Flex>
          )}
        </Card>
      </Badge.Ribbon>

      {isHintVisible && <PlayerHint player={hiddenWord} />}
    </div>
  );
};

const PlayerHint = ({ player = {} }) => {
  const parseArray = (arrayString) => {
    try {
      // Try parsing as JSON
      const parsedArray = JSON.parse(arrayString.replace(/'/g, '"'));

      // Check if the parsed result is an array
      if (Array.isArray(parsedArray)) {
        return parsedArray;
      }

      // If not an array, treat it as a string array
      return arrayString.split(",").map((item) => item.trim().replace(/'/g, ""));
    } catch (error) {
      // If parsing as JSON fails, try alternative method
      console.error("Error parsing array string:", error);
      return arrayString.split(",").map((item) => item.trim().replace(/'/g, ""));
    }
  };

  const clubsArray = parseArray(player.clubs);
  const seasonsArray = parseArray(player.seasons);

  return (
    <Card style={{ width: "100%", marginTop: "20px" }} title="Hint" size="small">
      <Collapse
        size="large"
        style={{ maxWidth: "600px" }}
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: "Player Data",
            children: (
              <Flex vertical gap={10} style={{ maxWidth: "100%" }}>
                <Text className="hint-data-item">
                  <TeamOutlined /> <Typography.Text strong>Position:</Typography.Text>
                  <span> {player.position}</span>
                </Text>
                <Text className="hint-data-item">
                  <GlobalOutlined /> <Typography.Text strong>Nationality:</Typography.Text>
                  <span> {player.nationality}</span>
                </Text>
                {Array.isArray(clubsArray) && (
                  <Text className="hint-data-item">
                    <TeamOutlined /> <Typography.Text strong>Clubs: </Typography.Text>
                    <span>
                      {clubsArray.map((club, index) => (
                        <span key={index}>{club}</span>
                      ))}
                    </span>
                  </Text>
                )}

                {Array.isArray(seasonsArray) && (
                  <Text className="hint-data-item">
                    <TeamOutlined /> <Typography.Text strong>Seasons: </Typography.Text>
                    <span>
                      {seasonsArray.map((season, index) => (
                        <span key={index}>{season}</span>
                      ))}
                    </span>
                  </Text>
                )}

                <Text className="hint-data-item">
                  <ScheduleOutlined /> <Typography.Text strong>Number of Seasons:</Typography.Text>
                  <span> {player.num_of_seasons}</span>
                </Text>
                <Text className="hint-data-item">
                  <TrophyOutlined /> <Typography.Text strong>Apps:</Typography.Text>
                  <span> {player.apps}</span>
                </Text>
                <Text className="hint-data-item">
                  <TrophyOutlined /> <Typography.Text strong>Wins:</Typography.Text>
                  <span> {player.wins}</span>
                </Text>
                <Text className="hint-data-item">
                  <TrophyOutlined /> <Typography.Text strong>Losses:</Typography.Text>
                  <span> {player.losses}</span>
                </Text>
                <Text className="hint-data-item">
                  <TrophyOutlined /> <Typography.Text strong>Clean Sheets:</Typography.Text>
                  <span> {player.clean_sheets}</span>
                </Text>
                <Text className="hint-data-item">
                  <TrophyOutlined /> <Typography.Text strong>Assists:</Typography.Text>
                  <span> {player.assists}</span>
                </Text>
                <Text className="hint-data-item">
                  <TrophyOutlined /> <Typography.Text strong>Goals:</Typography.Text>
                  <span> {player.goals}</span>
                </Text>
              </Flex>
            ),
          },
        ]}
      />
      <Alert message="Your remaining attempts have been reduced by 1." type="success" style={{ marginTop: "20px", textAlign: "center" }} />
    </Card>
  );
};

export default WordDisplay;
