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

const POSTS_UPDATE_MUTATION = gql`
mutation UpdatePost($body: String!, $id: String!) {
  updatePost(_id: $id, body: $body)
}
`

const POSTS_DELETE_MUTATION = gql`
mutation DeletePost($postId: String!) {
  deletePost(_id: $postId) {
    _id
  }
}
`;

const Delete = ({ id }) => {

  const [deletePost, { loading }] = useMutation(POSTS_DELETE_MUTATION, {
    refetchQueries: [
      { query: POSTS_QUERY },
      'PostsQuery'
    ],
  });

  return (
    <>
      <TouchableOpacity
        style={{ marginHorizontal: 10, }}
        disabled={loading}
        onPress={() => {
          deletePost({
            variables: {
              postId: id
            }
          })
        }}>
        <Text>{loading ? "Deleting" : "Delete"}</Text>
      </TouchableOpacity>
    </>
  )
}

const Update = ({ id, body }) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [postBody, setPostBody] = useState(body);


  const [updatePost, { loading }] = useMutation(POSTS_UPDATE_MUTATION, {
    refetchQueries: [
      { query: POSTS_QUERY },
      'PostsQuery'
    ],
  });

  return (
    <>
      {isUpdate ? <TextInput onChangeText={(text) => setPostBody(text)} value={postBody} style={{ borderColor: "black", borderWidth: 1, }} /> : <Text>{body}</Text>}
      <TouchableOpacity
        disabled={loading}
        style={{ marginHorizontal: 10, }}
        onPress={() => {
          if (!isUpdate) {
            setIsUpdate(true);
            return;
          }
          updatePost({
            variables: {
              body: postBody,
              id: id,
            }
          }).then(() => {
            setIsUpdate(false);
          })
        }}>
        <Text>{loading ? "Updating" : "Update"}</Text>
      </TouchableOpacity>
    </>
  )
}


const Add = () => {
  const [postBody, setPostBody] = useState("");
  const [addPost, { loading }] = useMutation(POSTS_ADD_MUTATION, {
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
    const { _id, body } = post; //get the name of continent

    return (
      <Pressable style={{ flexDirection: 'row' }}>
        <Update id={_id} body={body} />
        <Delete id={_id} />
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
