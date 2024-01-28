import React from "react";
import { Result, Button, Typography, Flex } from "antd";

const { Text, Title } = Typography;

import "./WordGameResult.css";

const WordGameResult = ({ isWinner = false, hiddenWord, mainWord, attempts, handlePlayAgain }) => {
  const calculateScore = () => {
    const totalAttempts = 6; // Assuming a total of 6 attempts
    const score = (totalAttempts - attempts) * mainWord.length;
    return score > 0 ? score : 0; // Ensure the score is not negative
  };

  const getResultMessage = () => {
    if (isWinner) {
      return (
        <div className="result-message">
          <Title level={3}>Congratulations!</Title>
          <Text strong>
            You guessed the word <span className="result-word">{mainWord}</span> in {attempts + 1} attempts.
          </Text>
        </div>
      );
    } else {
      return (
        <div className="result-message">
          <Title level={3}>Game Over !!!</Title>
          <Text>Sorry! You've run out of attempts.</Text>
          <br />
          <Text>
            The correct word was <span className="result-word">{mainWord}</span>.
          </Text>
        </div>
      );
    }
  };

  const resultMessage = getResultMessage();
  const score = calculateScore();

  return (
    <Flex className={isWinner ? "result-container winner" : "result-container loser"} align="center" justify="center" vertical>
      <Result
        icon={isWinner ? "🎉" : "😭"}
        status={isWinner ? "success" : "error"}
        title={resultMessage}
        extra={[
          <Text key={2} className="result-message">
            Your Score: <b>{score}</b>
          </Text>,
        ]}
      />
      <Button size="large" shape="round" className="play-again" onClick={handlePlayAgain}>
        Play Again
      </Button>
    </Flex>
  );
};

export default WordGameResult;
