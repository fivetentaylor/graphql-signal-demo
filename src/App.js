// src/App.js
import React from "react";
import ChannelList from "./ChannelList";
import { channels, fetchChannels, subscribeToChannels } from "./signals";

const App = () => (
  <div>
    <button onClick={fetchChannels}>Fetch</button>
    <button onClick={subscribeToChannels}>Subscribe</button>
    <h1>Channel List</h1>
    <ChannelList channels={channels} />
  </div>
);

export default App;
