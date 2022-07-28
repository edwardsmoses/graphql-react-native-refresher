import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery } from '@apollo/client';

import { gql } from "@apollo/client";




const CONTINENT_QUERY = gql`
  query ContinentQuery {
    continents {
      code
      name
    }
  }
`;

const Home = () => {

  const { data, loading } = useQuery(CONTINENT_QUERY); //execute query

  const ContinentItem = ({ continent }) => {
    const { name, code } = continent; //get the name of continent

    return (
      <Pressable>
        <Text>{name}</Text>
      </Pressable>
    );
  };

  if (loading) {
    return <Text>Fetching data...</Text>
  }
  return (
    <FlatList
      data={data.continents}
      renderItem={({ item }) => <ContinentItem continent={item} />}
      keyExtractor={(item, index) => index}
    />
  )
}

export default function App() {

  const client = new ApolloClient({
    uri: 'https://countries.trevorblades.com/graphql',
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Home />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
