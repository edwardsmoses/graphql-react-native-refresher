import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery } from '@apollo/client';

import { gql } from "@apollo/client";


const POSTS_QUERY = gql`
  query PostsQuery {
    posts {
      _id,
      body,
      createdAt,
    }
  }
`;

const Home = () => {

  const { data, loading } = useQuery(POSTS_QUERY); //execute query

  const ContinentItem = ({ post }) => {
    const { body } = post; //get the name of continent

    return (
      <Pressable>
        <Text>{body}</Text>
      </Pressable>
    );
  };

  if (loading) {
    return <Text>Fetching data...</Text>
  }
  return (
    <>
      <FlatList
        data={data.posts}
        renderItem={({ item }) => <ContinentItem post={item} />}
        keyExtractor={(item, index) => index}
      />
    </>
  )
}

export default function App() {

  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
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
