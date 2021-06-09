import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/link-error';
import AsyncStorage from '@react-native-community/async-storage'; 
import Constants from 'expo-constants';

export default async () => {

  /*
  let token = await AsyncStorage.getItem("access_token");
  console.log("using token: " + token);
  if(!token)
    token = "";*/

  const httpLink = new HttpLink({
    uri: `${Constants.manifest.extra.API_ADDRESS}:${Constants.manifest.extra.API_PORT}${Constants.manifest.extra.API_ENDPOINT}`,
    credentials: "include",
    onError: ({ graphQLErrors, networkError, operation, forward }) => {
      console.log("================")
      console.log(graphQLErrors)
    },
  });

  const authLink = setContext(async (_, { headers }) => {
    const tokens = JSON.parse(await AsyncStorage.getItem("tokens"));
    return {
      headers: {
        ...headers,
        authorization: tokens && tokens.access ? tokens.access : "",
        session: tokens && tokens.refresh ? tokens.refresh : ""
      }
    }
  });

  const wsLink = new WebSocketLink({
    uri: `ws://${Constants.manifest.extra.API_ADDRESS}:${Constants.manifest.extra.API_PORT}/${Constants.manifest.extra.API_ENDPOINT}`,
    credentials: "include",
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: () => ({
        authToken: async () => { return await AsyncStorage.getItem("access_token") ? await AsyncStorage.getItem("access_token") : ""}
      }),
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if(graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${location}, Path: ${path}`)
      });
    }
    if(networkError) console.log(`[Network error]: ${networkError}`);
  })

  const splitLink = split(({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" && definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink),
  errorLink
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all"
      },
      query: {
        errorPolicy: "all"
      },
      mutate: {
        errorPolicy: "all"
      }
    }
  });

  return client;
}