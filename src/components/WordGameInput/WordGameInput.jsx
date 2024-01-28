import "./WordGameInput.css";

const renderInputs = ({ inputs = [], handleInputChange, handleKeyDown }) => {
  return (
    <div className="input-container">
      {inputs.map((input, index) => (
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
      ))}
    </div>
  );
};

export default renderInputs;
