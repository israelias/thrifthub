const types = {
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

export const actionCreators = {
  loading: () => ({ type: types.LOADING }),
  failure: () => ({ type: types.FAILURE }),
  success: (payload: any) => ({ type: types.SUCCESS, payload }),
};

export const initialState = {
  loading: true,
  error: false,
  posts: [],
};

export function reducer(state: any, action: any) {
  switch (action.type) {
    case types.LOADING:
      return { ...state, loading: true, error: false };
    case types.SUCCESS:
      return { loading: false, error: false, posts: action.payload };
    case types.FAILURE:
      return { ...state, loading: false, error: true };
  }
}

// export default function App() {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   useEffect(() => {
//     async function fetchPosts() {
//       dispatch(actionCreators.loading());

//       try {
//         const response = await fetch(
//           "https://jsonplaceholder.typicode.com/posts"
//         );
//         const posts = await response.json();
//         dispatch(actionCreators.success(posts));
//       } catch (e) {
//         dispatch(actionCreators.failure());
//       }
//     }

//     fetchPosts();
//   }, []);

//   const { posts, loading, error } = state;

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator animating={true} />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text>Failed to load posts!</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       style={styles.container}
//       keyExtractor={(post) => post.id}
//       data={posts}
//       renderItem={({ item: { id, title, body }, index }) => (
//         <View key={id} style={styles.post}>
//           <Text style={styles.title}>
//             {index}. {title}
//           </Text>
//           <Text style={styles.body}>{body}</Text>
//         </View>
//       )}
//     />
//   );
// }
