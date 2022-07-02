import React, { useState } from "react";
import Form from "./components/Form";
import List from "./components/List";
import "./App.css";

const App = () => {
  const [formMode, setFormMode] = useState("new");
  const [reloadAddressList, setReloadAddressList] = useState(false);

  const formModeHandler = (addressId = "new") => {
    setFormMode(addressId);
  };

  const reloadAddressListHandler = () => {
    setReloadAddressList((state) => !state);
  };

  return (
    <div className="App">
      <h1>YDS - Task</h1>

      <Form
        formMode={formMode}
        formModeHandler={formModeHandler}
        reloadAddressListHandler={reloadAddressListHandler}
      />

      <div className="divider" />
      <List
        formModeHandler={formModeHandler}
        reloadAddressList={reloadAddressList}
      />
    </div>
  );
};

export default App;
