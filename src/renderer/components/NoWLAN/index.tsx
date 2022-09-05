import { useState } from 'react';
import './index.css';
import { useNavigate, NavLink, Link, Outlet } from 'react-router-dom';

const NoWLAN = () => {
  const [pendding, setPending] = useState<boolean>(true);
  const navigate = useNavigate();

  const herfToConfig = () => {
    navigate('/config');
  };

  return (
    <div className="center-div">
      <h2>当前计算机未连接 WLAN</h2>
      <button type="button" disabled={!pendding} onClick={herfToConfig}>
        进入离线配置
      </button>
      {/* <NavLink to="/config">Messages</NavLink> */}
      {/* <Link to="/config">/config</Link> */}
      {/* <Outlet /> */}
    </div>
  );
};

export default NoWLAN;
