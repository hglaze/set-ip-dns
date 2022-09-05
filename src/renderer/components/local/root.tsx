import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const Root = () => {
  return (
    <>
      <div className="sidebar">
        <h1>WLAN 列表</h1>
        <div>
          <input
            id="q"
            aria-label="Search contacts"
            placeholder="Search"
            type="search"
            name="q"
          />
          <button type="submit">新建</button>
        </div>
        <nav>
          {/* {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>没有配置文件</i>
            </p>
          )} */}
        </nav>
      </div>
      <div className="sidebar">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
