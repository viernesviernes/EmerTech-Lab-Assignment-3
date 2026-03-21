import { gql, useQuery, useMutation } from '@apollo/client';

const GET_CURRENT_USER_ID_QUERY = gql`
  query GetCurrentUserId {
    currentUser {
      id
    }
  }
`

const GET_HELP_REQUESTS_QUERY = gql`
  query GetHelpRequests {
    getHelpRequests {
        id
        author
        description
        location
        isResolved
        volunteers
    }
  }
`

const CREATE_HELP_REQUEST_MUTATION = gql`
    mutation CreateHelpRequest($description: String!, $location: String) {
        createHelpRequest(description: $description, location: $location) {
            id
            description
            location
            isResolved
        }
    }
`

const UPDATE_HELP_REQUEST_IS_RESOLVED_MUTATION = gql`
    mutation UpdateHelpRequestIsResolved($helpRequestId: ID!, $isResolved: Boolean!) {
        updateHelpRequestIsResolved(helpRequestId: $helpRequestId, isResolved: $isResolved) {
            id
            description
            location
            isResolved
        }
    }
`

const VOLUNTEER_FOR_HELP_REQUEST_MUTATION = gql`
    mutation VolunteerForHelpRequest($helpRequestId: ID!) {
        volunteerForHelpRequest(helpRequestId: $helpRequestId) {
            id
            description
            location
            isResolved
            volunteers
        }
    }
`

const HelpRequests = () => {

  const { data: currentUserData } = useQuery(GET_CURRENT_USER_ID_QUERY);
  
  const { data, loading, error } = useQuery(GET_HELP_REQUESTS_QUERY);
  

  const [createHelpRequest] = useMutation(CREATE_HELP_REQUEST_MUTATION, {
    refetchQueries: [{ query: GET_HELP_REQUESTS_QUERY }],
  });

  const [volunteerForHelpRequest] = useMutation(VOLUNTEER_FOR_HELP_REQUEST_MUTATION, {
    refetchQueries: [{ query: GET_HELP_REQUESTS_QUERY }],
    onError: (error) => {
      window.alert("Error volunteering for help request: " + error.message);
    }
  });

  const [updateHelpRequestIsResolved] = useMutation(UPDATE_HELP_REQUEST_IS_RESOLVED_MUTATION, {
    refetchQueries: [{ query: GET_HELP_REQUESTS_QUERY }],
    onError: (error) => {
      window.alert("Error updating help request: " + error.message);
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const description = formData.get('description');
    const location = formData.get('location') || null;
    createHelpRequest({ variables: { description, location } });
    e.target.reset();
  }

  return (
    <div className='contain'>
        <form className="post-form" onSubmit={handleCreateRequest}>
            <textarea placeholder="Describe your help request..." name="description" required></textarea>
            <input type="text" placeholder="Location (optional)" name="location" />
            <button type="submit">Submit Request</button>
        </form>
        <div className="cards-list">
            {data.getHelpRequests.map(request => (
                <div className="card" key={request.id}>
                    <p>{request.description}</p>
                    <div className="card-meta">
                        {request.location && <span className="badge">{request.location}</span>}
                        <span className={`badge ${request.isResolved ? 'resolved' : 'unresolved'}`}>
                            {request.isResolved ? 'Resolved' : 'Open'}
                        </span>
                        <span className="badge">{request.volunteers.length} volunteer{request.volunteers.length !== 1 ? 's' : ''}</span>
                    </div>
                    {request.volunteers.length > 0 && (
                        <div className="volunteers-list">
                            <small>Participants: {request.volunteers.join(', ')}</small>
                        </div>
                    )}
                    {!request.isResolved && (
                        request.author === currentUserData?.currentUser?.id
                            ? <button
                                className="volunteer-btn"
                                onClick={() => updateHelpRequestIsResolved({ variables: { helpRequestId: request.id, isResolved: true } })}
                              >
                                Mark as Resolved
                              </button>
                            : <button
                                className="volunteer-btn"
                                onClick={() => volunteerForHelpRequest({ variables: { helpRequestId: request.id } })}
                              >
                                Join
                              </button>
                    )}
                </div>
            ))}
        </div>
    </div>
  )
}

export default HelpRequests
