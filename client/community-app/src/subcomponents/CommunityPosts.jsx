import { gql, useQuery, useMutation } from '@apollo/client';

const GET_COMMUNITY_POSTS_QUERY = gql`
  query GetCommunityPosts {
    getCommunityPosts {
        id
        author
        title
        content
        category
        createdAt
        aiSummary
    }
  }
`

const CREATE_COMMUNITY_POST_MUTATION = gql`
    mutation CreateCommunityPost($title: String!, $content: String!, $category: String!) {
        createCommunityPost(title: $title, content: $content, category: $category) {
            id
            title
            content
            category
        }
    }
`

const CommunityPosts = () => {
  const { data, loading, error } = useQuery(GET_COMMUNITY_POSTS_QUERY);
  const [createCommunityPost] = useMutation(CREATE_COMMUNITY_POST_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITY_POSTS_QUERY }],
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
    <div className='contain'>
        <form className="post-form" onSubmit={handleCreatePost}>
            <input type="text" placeholder="Title" name="title" required />
            <select name="category" required>
                <option value="">Select Category</option>
                <option value="discussion">Discussion</option>
                <option value="news">News</option>
            </select>
            <textarea placeholder="What's on your mind?" name="content" required></textarea>
            <button type="submit">Post</button>
        </form>
        <div className="cards-list">
            {data.getCommunityPosts.map(post => (
                <div className="card" key={post.id}>
                    <div className="card-header">
                        <h3>{post.title}</h3>
                        <span className="badge">{post.category}</span>
                    </div>
                    <div className="card-meta-info">
                        <small className="card-author">By {post.author}</small>
                        <small>&sdot;</small>
                        <small className="card-date">Created at {new Date(Number(post.createdAt)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</small>
                    </div>
                    {post.aiSummary && (
                        <div className="ai-summary">
                            <small className="ai-summary-label">For More Context:</small>
                            <p>{post.aiSummary}</p>
                        </div>
                    )}
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default CommunityPosts
