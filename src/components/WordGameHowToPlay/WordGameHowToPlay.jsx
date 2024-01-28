import React, { useState } from "react";
import { Modal, Button, Typography, Steps, Card } from "antd";
import { CloseSquareFilled } from "@ant-design/icons";

const { Text } = Typography;
const { Step } = Steps;

import "./WordGameHowToPlay.css";

const HowToPlayModal = ({ visible, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Intro",
      content: (
        <b>
          <h3>Welcome to Footuiqz! Here's how you can play:</h3>
          - You'll be given the name of a football player.
          <br />
          - Your goal is to guess the correct name within a limited number of attempts.
          <br />- Each input box corresponds to a letter in the player's name.
        </b>
      ),
    },
    {
      title: "Guess",
      content: (
        <b>
          Pay attention to the symbols and colors of the input boxes :
          <br />
          <CloseSquareFilled style={{ color: "green" }} /> : Correct letter in the correct position.
          <br />
          <CloseSquareFilled style={{ color: "#f0ad4e" }} /> : Correct letter in the wrong position.
          <br />
          <CloseSquareFilled style={{ color: "red" }} /> : Incorrect letter.
        </b>
      ),
    },
    {
      title: "Hint 1",
      content: (
        <b>
          - Use the "Show Hint" button carefully, as it will decrease your remaining attempts.
          <br />- If you guess the correct name or run out of attempts, the result will be displayed.
        </b>
      ),
    },
    {
      title: "Hint 2",
      content: (
        <b>
          - You can use the "Show Hint" button to reveal all the information about the player.
          <br />- The "Show Hint" button will decrease your remaining attempts by 1. Hence, use it wisely.
        </b>
      ),
    },
    {
      title: "Score",
      content: (
        <b>
          - Your score is based on the number of attempts taken to guess the name.
          <br />- Try to guess with the fewest attempts for a higher score!
        </b>
      ),
    },
  ];

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Modal
      title="How to Play"
      open={visible}
      className="how-to-play-modal"
      style={{ maxWidth: "100vw" }}
      onCancel={onCancel}
      centered
      footer={[
        <Button key="close" className="how-to-play-button" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Card style={{ padding: "2rem" }}>
        <Steps current={currentStep} size="small">
          {steps.map((step) => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>
        <div style={{ marginTop: "16px" }}>{steps[currentStep].content}</div>
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          {currentStep < steps.length - 1 && (
            <Button className="how-to-play-button" onClick={nextStep}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button className="how-to-play-button" onClick={onCancel}>
              Finish
            </Button>
          )}
          {currentStep > 0 && (
            <Button className="how-to-play-button" style={{ marginLeft: 8 }} onClick={prevStep}>
              Previous
            </Button>
          )}
        </div>
      </Card>
    </Modal>
  );
};

export default HowToPlayModal;
