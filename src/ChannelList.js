// src/ChannelList.js
import React from "react";
import { useSignals } from "@preact/signals-react/runtime";

const ChannelList = ({ channels }) => {
  useSignals();

  return (
    <ul>
      {Object.values(channels.value).map((channel) => (
        <Channel key={channel.value.id} channel={channel} />
      ))}
    </ul>
  );
};

const Channel = ({ channel }) => {
  useSignals();

  return (
    <li>
      {channel.value.name}: {channel.value.description}
    </li>
  );
};

export default ChannelList;
