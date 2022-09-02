import { useState } from 'react';
import './index.css';

const NoWLAN = () => {
  const [pendding, setPending] = useState<boolean>(false);

  const herfToConfig = () => {};
  return (
    <div className="center-div">
      <h2>当前计算机未连接 WLAN</h2>
      <button type="button" disabled={!pendding} onClick={herfToConfig}>
        进入离线配置
      </button>
    </div>
  );
};

export default NoWLAN;
