// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import { database } from './firebase'; // Import Firebase database instance
import { ref, onValue, set } from 'firebase/database'; // Import modular
import questionsData from './questions.json'; // Import data from JSON file

const App = () => {
  const [responses, setResponses] = useState({}); // State untuk menyimpan jawaban
  const [questions, setQuestions] = useState([]); // State untuk menyimpan daftar pertanyaan
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // State untuk menyimpan daftar pertanyaan yang sudah dijawab

  useEffect(() => {
    // Ambil data pertanyaan dari JSON dan simpan ke state
    setQuestions(questionsData);

    // Realtime listener untuk jawaban dari Firebase Realtime Database
    const responsesRef = ref(database, 'responses');
    const unsubscribe = onValue(responsesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setResponses(data);
        setAnsweredQuestions(Object.keys(data).map(Number));
      }
    });

    // Membersihkan listener saat komponen di-unmount
    return () => {
      unsubscribe(); // Mematikan listener dengan cara yang benar
    };
  }, []);

  const handleResponseChange = (questionId, answer) => {
    // Simpan jawaban ke state lokal
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answer,
    }));

    // Update jawaban ke Firebase Realtime Database
    const responseRef = ref(database, `responses/${questionId}`);
    set(responseRef, answer); // Use the `set` function from the modular import
  };

  const handleExportToTxt = () => {
    let resultText = '';
    questions.forEach((q) => {
      resultText += `${q.question}\n`;
      q.options.forEach((option, index) => {
        resultText += `${String.fromCharCode(65 + index)}. ${option}\n`;
      });
      const answer = responses[q.id];
      const answerIndex = q.options.indexOf(answer);
      resultText += `ANSWER: ${String.fromCharCode(65 + answerIndex)}\n\n`;
    });

    // Menyimpan ke file txt
    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "jawaban.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const styles = {
    appContainer: {
      display: 'grid', // Mengubah layout menjadi grid
      gridTemplateColumns: '1fr 200px', // Menentukan lebar kolom
      gap: '20px', // Jarak antar kolom
      maxWidth: '800px', // Lebar maksimum container
      margin: 'auto', // Center the container horizontally
      padding: '20px',
      backgroundColor: '#f0f0f0',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      textAlign: 'center', // Center align text inside container
      position: 'relative', // Needed for floating elements
    },
    header: {
      fontSize: '2rem',
      marginBottom: '20px',
      color: '#007bff', // Blue color for header
    },
    questionContainer: {
      backgroundColor: 'black',
      padding: '15px',
      marginBottom: '15px',
      borderRadius: '8px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
      textAlign: 'left', // Left align text inside question container
      maxWidth: '500px', // Limit width of question container
    },
    questionTitle: {
      fontSize: '1.2rem',
      marginBottom: '10px',
      fontWeight: 'bold',
      color: '#fff', // Set text color to white
    },
    optionsList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    optionItem: {
      marginBottom: '8px',
    },
    exportButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginTop: '20px',
    },
    answeredQuestionsContainer: {
      backgroundColor: 'black',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 0 5px rgba(0,0,0,0.1)',
      textAlign: 'center',
      width: '180px',
    },
    questionIndicator: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '3px',
    },
    questionNumber: {
      padding: '5px',
      cursor: 'pointer',
      // borderRadius: '50%',
      backgroundColor: '#ccc',
    },
    answered: {
      backgroundColor: 'green',
    },
  };

  return (
    <div style={styles.appContainer}>
      <div>
        <h1 style={styles.header}>Quiz</h1>
        {questions.map((q) => (
          <div key={q.id} style={styles.questionContainer}>
            <h3 style={styles.questionTitle}>{q.id}. {q.question}</h3>
            <ul style={styles.optionsList}>
              {q.options.map((option, optionIndex) => (
                <li key={optionIndex} style={styles.optionItem}>
                  <label>
                    <input
                      type="radio"
                      name={`question${q.id}`}
                      value={option}
                      checked={responses[q.id] === option}
                      onChange={() => handleResponseChange(q.id, option)}
                    />
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button style={styles.exportButton} onClick={handleExportToTxt}>
          Export to TXT
        </button>
      </div>
      <div style={styles.answeredQuestionsContainer}>
        <h2>Status:</h2>
        <div style={styles.questionIndicator}>
          {questions.map((q) => (
            <div
              key={q.id}
              style={{
                ...styles.questionNumber,
                ...(answeredQuestions.includes(q.id) ? styles.answered : {}),
              }}
              onClick={() => document.getElementById(`question${q.id}`).scrollIntoView()}
            >
              {q.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;