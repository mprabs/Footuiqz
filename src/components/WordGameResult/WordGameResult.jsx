import React from "react";
import { Result, Button, Typography, Flex } from "antd";

const { Text, Title } = Typography;

import "./WordGameResult.css";

const WordGameResult = ({ isWinner = false, hiddenWord, mainWord, attempts, handlePlayAgain }) => {
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

  return (
    <Flex className={isWinner ? "result-container winner" : "result-container loser"} align="center" justify="center" vertical>
      <Result
        icon={isWinner ? "🎉" : "😭"}
        status={isWinner ? "success" : "error"}
        title={resultMessage}
        extra={[
          <Text key={1} className="result-message">
            The name of the player is <b>{hiddenWord.name}</b>.
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
