import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client';
import './App.css'

import CommunityPosts from './subcomponents/CommunityPosts'
import HelpRequests from './subcomponents/HelpRequests'

const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    currentUser {
      username
    }
  }
`

const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut
  }
`

export default function CommunityComponent() {

    const { data } = useQuery(GET_CURRENT_USER_QUERY);
    const [activeTab, setActiveTab] = useState('posts')
    const [signOut] = useMutation(SIGN_OUT_MUTATION, {
        onCompleted: () => { window.location.href = '/'; }
    });

    return (
        <div>
            <nav className="community-navbar">
                <h1>Community App</h1>
                {data?.currentUser?.username && (
                    <span className="username-badge">{data.currentUser.username}</span>
                )}
                <button className="signout-btn" onClick={() => signOut()}>Sign Out</button>
            </nav>
            <div className="community-content">
            <div className="tabs">
                <button
                    className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    Community Posts
                </button>
                <button
                    className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
                    onClick={() => setActiveTab('help')}
                >
                    Help Requests
                </button>
            </div>
            <div>
                {activeTab === 'posts' && <CommunityPosts />}
                {activeTab === 'help' && <HelpRequests />}
            </div>
            </div>
        </div>
    )
}
