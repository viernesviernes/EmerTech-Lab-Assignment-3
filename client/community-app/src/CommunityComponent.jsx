import { useState } from 'react'
import { gql, useQuery } from '@apollo/client';

import CommunityPosts from './subcomponents/CommunityPosts'
import HelpRequests from './subcomponents/HelpRequests'
import YourProfile from './subcomponents/YourProfile'

const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    currentUser {
      username
    }
  }
`

export default function CommunityComponent() {

    const { data } = useQuery(GET_CURRENT_USER_QUERY);
    
    const [activeTab, setActiveTab] = useState(<></>)

    return (
        <div className="App">
            <h1>Community App {data?.currentUser?.username}</h1>
            <div>
                <ul>
                    <li><button onClick={() => setActiveTab(<CommunityPosts />)}>Community Posts</button></li>
                    <li><button onClick={() => setActiveTab(<HelpRequests />)}>Help Requests</button></li>
                    <li><button onClick={() => setActiveTab(<YourProfile />)}>Your Profile</button></li>
                </ul>
                <div>
                    {activeTab}
                </div>
            </div>
        </div>
    )
}