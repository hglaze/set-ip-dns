import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import NotWlan from './NotWlan';

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
  const [onlineFlag, setOnlineFlag] = useState<boolean>(false);
  const [networkProfileType, setNetworkProfileType] = useState<boolean>(false);
  const [paddingFlage, setPaddingFlage] = useState<boolean>(true);

  const changeOnlineFlage = () => {
    const onlineState = navigator.onLine;
    if (onlineState) {
      setOnlineFlag(true);
      window.electron.networkService
        .sendNetworkState(onlineState)
        .then((networkProfileInfo) => {
          console.log(networkProfileInfo);
          if (networkProfileInfo.type) {
            setNetworkProfileType(true);
          } else {
            console.log('未连接无线网络');
          }
          return null;
        })
        .catch(console.log);
    } else setOnlineFlag(false);
  };
  useEffect(() => {
    changeOnlineFlage();
    window.addEventListener('online', changeOnlineFlage);
    window.addEventListener('offline', changeOnlineFlage);
    return () => {
      window.removeEventListener('online', changeOnlineFlage);
      window.removeEventListener('offline', changeOnlineFlage);
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            onlineFlag && networkProfileType ? (
              <Hello onlineFlag={onlineFlag} />
            ) : (
              <NotWlan />
            )
          }
        />
      </Routes>
    </Router>
  );
}
