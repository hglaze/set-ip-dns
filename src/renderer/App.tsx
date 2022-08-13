import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = (props: { onlineFlag: boolean }) => {
  const { onlineFlag } = props;
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
      <button
        type="button"
        onClick={() => {
          window.electron.networkState.sendNetworkState(navigator.onLine);
        }}
      >
        test
      </button>
      <div>{onlineFlag ? 'online' : 'offline'}</div>
    </div>
  );
};

export default function App() {
  const [onlineFlag, setOnlineFlag] = useState<boolean>(navigator.onLine);
  const changeOnlineFlage = () => {
    if (navigator.onLine) setOnlineFlag(true);
    else setOnlineFlag(false);
  };
  useEffect(() => {
    window.addEventListener('online', changeOnlineFlage);
    window.addEventListener('offline', changeOnlineFlage);
  });
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello onlineFlag={onlineFlag} />} />
      </Routes>
    </Router>
  );
}
