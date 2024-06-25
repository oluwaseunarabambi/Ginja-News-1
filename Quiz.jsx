import React, { useState } from "react";
import './src/styles/Quiz.css'
const Quiz = () => {
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizClosed, setQuizClosed] = useState(false);

    const questions = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: "Paris"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Mars", "Jupiter", "Venus", "Saturn"],
            correctAnswer: "Mars"
        },
        {
            question: "Which is the Nigerian state with the highest population?",
            options: ["Osun State", "Kano State", "Kaduna State", "Lokoja State"],
            correctAnswer: "Kano State"
        },
        {
            question: "What is the highest mountain in Africa?",
            options: ["Mount Everest", "Mount Kilimanjaro", "Mount Luke", "Mount Xian"],
            correctAnswer: "Mount Kilimanjaro"
        },
        {
            question: "Where is the headquarters of ECOWAS?",
            options: ["Cairo, Egypt", "Nairobi, Kenya", "Dakar, Senegal", "Abuja, Nigeria"],
            correctAnswer: "Abuja, Nigeria"
        },
        {
            question: "Who amalgamated the Northern and Southern protectorates of Nigeria?",
            options: ["Sir Lord Lugard", "Sir Dickson Williams", "Sir Brandon Lark", "Sir Alex Ferguson"],
            correctAnswer: "Sir Lord Lugard"
        },

    ];

    const handleAnswer = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
        // Move to the next question or close the quiz if it's the last question
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizClosed(true);
        }

    };


    return (
        <div className="quiz-container">
            <h2 className="quiz-title">Quiz</h2>
            {quizClosed ? (
                <div className="quiz-results">
                    <p> Quiz Completed </p>
                    <p>Your Score: {score} out of {questions.length} </p>
                </div>
            ) : (
                <div className="question-container">
                    <p className="question-number">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    <h3 className="question">{questions[currentQuestionIndex].question}</h3>
                    <ul className="options-list">
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <li key={index}>
                                <button className="close-button" onClick={() => handleAnswer(option)}>{option}</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setQuizClosed(true)} aria-label="Close Quiz Dialog">
                        Close Quiz
                    </button>
                </div>
            )}
        </div>
    )
};

export default Quiz;
