// src/queries.js
import { gql } from '@apollo/client';

export const GET_CHANNELS = gql`
  query GetChannels {
    channels {
      id
      name
      description
    }
  }
`;

export const CHANNEL_UPDATED = gql`
  subscription OnChannelUpdated {
    channelUpdated {
      id
      name
      description
    }
  }
`;

