// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import { database } from './firebase'; // Import Firebase database instance
import { ref, onValue, set, remove } from 'firebase/database'; // Import modular
import questionsData from './questions.json'; // Import data from JSON file

const App = () => {
  const [responses, setResponses] = useState({}); // State untuk menyimpan jawaban
  const [questions, setQuestions] = useState([]); // State untuk menyimpan daftar pertanyaan
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // State untuk menyimpan daftar pertanyaan yang sudah dijawab
  const [onlineUsers, setOnlineUsers] = useState(0); // State untuk menyimpan jumlah pengguna online
  const [flaggedQuestions, setFlaggedQuestions] = useState([]); // State untuk menyimpan daftar pertanyaan yang di-flagging

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

    // Realtime listener untuk jumlah pengguna online dari Firebase Realtime Database
    const onlineUsersRef = ref(database, 'onlineUsers');
    const unsubscribeOnlineUsers = onValue(onlineUsersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOnlineUsers(data);
      }
    });

    // Membersihkan listener saat komponen di-unmount
    return () => {
      unsubscribe(); // Mematikan listener untuk jawaban dengan cara yang benar
      unsubscribeOnlineUsers(); // Mematikan listener untuk pengguna online dengan cara yang benar
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

  const handleResetResponse = (questionId) => {
    // Reset jawaban untuk pertanyaan tertentu
    setResponses((prevResponses) => {
      const newResponses = { ...prevResponses };
      delete newResponses[questionId];
      return newResponses;
    });

    // Hapus jawaban dari Firebase Realtime Database
    const responseRef = ref(database, `responses/${questionId}`);
    remove(responseRef); // Use the `remove` function from the modular import
  };

  const handleFlagQuestion = (questionId) => {
    // Tambahkan atau hapus pertanyaan dari daftar yang di-flagging
    setFlaggedQuestions((prevFlaggedQuestions) => {
      if (prevFlaggedQuestions.includes(questionId)) {
        return prevFlaggedQuestions.filter(id => id !== questionId);
      } else {
        return [...prevFlaggedQuestions, questionId];
      }
    });
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

  const handleBackToTop = () => {
    window.scrollTo(0, 0);
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
      color: '#fff',
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
      color: '#fff',
    },
    questionNumber: {
      padding: '5px',
      cursor: 'pointer',
      backgroundColor: '#ccc',
    },
    answered: {
      backgroundColor: 'green',
    },
    flagged: {
      backgroundColor: 'orange', // Warna untuk status yang di-flagging
    },
    onlineUsersIndicator: {
      color: 'black',
      marginBottom: '10px',
    },
    backToTopButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      zIndex: '1000',
    },
  };

  return (
    <div style={styles.appContainer}>
      <div>
        <h1 style={styles.header}>Quiz</h1>
        {questions.map((q) => (
          <div key={q.id} style={styles.questionContainer} id={`question${q.id}`}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button style={styles.exportButton} onClick={() => handleFlagQuestion(q.id)}>
                {flaggedQuestions.includes(q.id) ? 'Hapus Flag' : 'Flag'}
              </button>
              <button style={styles.exportButton} onClick={() => handleResetResponse(q.id)}>
                Reset
              </button>
            </div>
          </div>
        ))}
        <button style={styles.exportButton} onClick={handleExportToTxt}>
          Export to TXT
        </button>
      </div>
      <div style={styles.answeredQuestionsContainer}>
        <h2>Status:</h2>
        ({answeredQuestions.length}/{questions.length})
        <div style={styles.questionIndicator}>
          {questions.map((q) => (
            <div
              key={q.id}
              style={{
                ...styles.questionNumber,
                ...(answeredQuestions.includes(q.id) ? styles.answered : {}),
                ...(flaggedQuestions.includes(q.id) ? styles.flagged : {}),
              }}
              onClick={() => {
                const questionElement = document.getElementById(`question${q.id}`);
                if (questionElement) {
                  questionElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {q.id}
            </div>
          ))}
        </div>
      </div>
      <button style={styles.backToTopButton} onClick={handleBackToTop}>
        Kembali ke Atas
      </button>
    </div>
  );
};

export default App;