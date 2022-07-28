import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
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


export default function App() {

  const client = new ApolloClient({
    uri: 'https://countries.trevorblades.com/graphql',
    cache: new InMemoryCache()
  });
  
  const { data, loading } = useQuery(CONTINENT_QUERY); //execute query

  const ContinentItem = ({ continent }) => {
    const { name, code } = continent; //get the name of continent

    return (
      <Pressable>
        <Text>{name}</Text> //display name of continent
      </Pressable>
    );
  };

  console.log(data);

  if (loading) {
    return <Text>Fetching data...</Text> //while loading return this
  }

  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <FlatList
          data={data.continents}
          renderItem={({ item }) => <ContinentItem continent={item} />}
          keyExtractor={(item, index) => index}
        />
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
