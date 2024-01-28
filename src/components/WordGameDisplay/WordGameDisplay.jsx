import "./WordGameDisplay.css";

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
    <div className="feedback-line">
      {feedbackLine.map((item, charIndex) => (
        <div key={charIndex} className={`feedback-box ${colorClass(item.status)}`}>
          <span>{item.letter.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
};
const WordGameDisplay = ({ feedback }) => {
  return feedback.map((feedbackLine, index) => <FeedbackLine key={index} feedbackLine={feedbackLine} />);
};

export default WordGameDisplay;
