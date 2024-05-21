import { signal, batch } from "@preact/signals-react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { GET_CHANNELS, CHANNEL_UPDATED } from "./queries";

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: "ws://localhost:4000/graphql",
    options: {
      reconnect: true,
    },
  }),
  cache: new InMemoryCache(),
});

export const channels = signal({});

export function fetchChannels() {
  client
    .query({
      query: GET_CHANNELS,
    })
    .then((resp) => {
      const tmp = {};
      for (const channel of resp.data.channels) {
        tmp[channel.id] = signal(channel);
      }

      channels.value = tmp;
    })
    .catch((error) => {
      console.error("Error fetching channels:", error);
      throw error;
    });
}

export function subscribeToChannels() {
  const observable = client.subscribe({
    query: CHANNEL_UPDATED,
  });

  observable.subscribe({
    next({ data }) {
      if (channels.value[data.channelUpdated.id]) {
        channels.value[data.channelUpdated.id].value = data.channelUpdated;
      } else {
        channels.value = {
          ...channels.value,
          [data.channelUpdated.id]: signal(data.channelUpdated),
        };
      }
    },
    error(err) {
      console.error("Subscription error:", err);
    },
  });
}
