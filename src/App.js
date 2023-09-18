import { useEffect, useState } from 'react';
import './App.css';

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function App() {
  const [titleJSON, setTitleJSON] = useState([]);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState([]);
  const [answer, setAnswer] = useState('');
  const [refresh, setRefresh] = useState(0);

  const currentTest = test[test.length - 1];

  const onCheckAnswer = (e) => {
    e.preventDefault();

    if (answer === currentTest.hiragana || answer === currentTest.japanese) {
      setRefresh((prev) => prev + 1);
      setAnswer('');
    }
  };

  useEffect(() => {
    const getNewQuestion = () => {
      const questionLength = questions.length;

      if (test.length === questionLength) {
        return;
      }

      if (questionLength > 0) {
        const num = getRandom(0, questionLength - 1);
        const item = questions[num];
        const isExist = test.includes(item);

        if (!isExist) {
          setTest((prev) => [...prev, item]);
        } else {
          getNewQuestion();
        }
      }
    };

    getNewQuestion();
  }, [questions, refresh]);

  useEffect(() => {
    fetch(`title.json`)
      .then((response) => response.json())
      .then(setTitleJSON);
  }, []);

  useEffect(() => {
    if (questionTitle) {
      fetch(`${questionTitle}.json`)
        .then((response) => response.json())
        .then(setQuestions);
    }
  }, [questionTitle]);

  console.log(questionTitle);

  return (
    <form onSubmit={onCheckAnswer}>
      {titleJSON.map((item) => (
        <div
          className={`text ${item.engTitle === questionTitle ? 'active' : ''}`}
          key={item.engTitle}
          onClick={() => setQuestionTitle(item.engTitle)}
        >
          {item.chTitle}
        </div>
      ))}
      <div className="wrapper">
        <div>全部題數: {questions.length}</div>
        <div>問題: {test.length > 0 ? `${test[test.length - 1].chinese}(${test[test.length - 1].japanese})` : ''}</div>
        <div>
          <span>答案: </span>
          <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </div>
        <button type="submit">確定</button>
      </div>
    </form>
  );
}

export default App;
