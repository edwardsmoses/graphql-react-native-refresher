import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

import { useState } from 'react';


const POSTS_QUERY = gql`
  query PostsQuery {
    posts {
      _id,
      body,
      createdAt,
    }
  }
`;


const POSTS_ADD_MUTATION = gql`
mutation CreatePost($body: String!) {
  createPost(post: {body: $body}){
    _id,
    body, 
    createdAt,
  }
}
`


const Add = () => {
  const [postBody, setPostBody] = useState("");
  const [addPost, { data, loading, error }] = useMutation(POSTS_ADD_MUTATION, {
    refetchQueries: [
      { query: POSTS_QUERY },
      'PostsQuery'
    ],
  });

  return (
    <>
      <TextInput onChangeText={(text) => setPostBody(text)} value={postBody} style={{ borderColor: "black", borderWidth: 1, }} />
      <TouchableOpacity
        disabled={loading}
        onPress={() => {
          addPost({
            variables: {
              body: postBody
            }
          }).then(() => {
            setPostBody("");
          })
        }}>
        <Text>{loading ? "Adding" : "Add"}</Text>
      </TouchableOpacity>
    </>
  )
}

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
        <Add />
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
