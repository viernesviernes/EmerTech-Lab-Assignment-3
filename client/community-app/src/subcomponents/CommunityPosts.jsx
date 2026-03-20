import React from 'react'
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_COMMUNITY_POSTS_QUERY = gql`
  query GetCommunityPosts {
    getCommunityPosts {
        id
        title
        content
    }
  }
`

const CREATE_COMMUNITY_POST_MUTATION = gql`
    mutation CreateCommunityPost($title: String!, $content: String!, $category: String!) {
        createCommunityPost(title: $title, content: $content, category: $category) {
            title
        }
    }
`

const CommunityPosts = () => {
  const { data, loading, error } = useQuery(GET_COMMUNITY_POSTS_QUERY);
  const [createCommunityPost] = useMutation(CREATE_COMMUNITY_POST_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITY_POSTS_QUERY }],
    onCompleted: (data) => {
        console.log("Post created successfully!", data);
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  const handleCreatePost = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');

    createCommunityPost({ variables: { title, content, category } });

    e.target.reset();
  }

  return (
    <div>
        <h3>Community Posts v2</h3>
        <form onSubmit={handleCreatePost}>
            <input type="text" placeholder="Title" name="title" />
            <select name="category">
                <option value="">Select Category</option>
                <option value="discussion">Discussion</option>
                <option value="news">News</option>
            </select>
            <textarea placeholder="Content" name="content"></textarea>
            <button type="submit">Create Post</button>
        </form>
        {
            data.getCommunityPosts.map(post => (
                <div key={post.id}>
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                </div>
            ))
        }
    </div>
  )
}

export default CommunityPosts