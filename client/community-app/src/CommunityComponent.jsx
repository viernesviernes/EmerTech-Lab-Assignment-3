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
    const [chatToggled, setChatToggled] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [signOut] = useMutation(SIGN_OUT_MUTATION, {
        onCompleted: () => { window.location.href = '/'; }
    });

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, isUser: true }]);
            setMessage('');
        }
    }

    const handleSendMessageasAI = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, isUser: false }]);
            setMessage('');
        }
    }

    return (
        <div className='community-container'>
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

            {/* Backdrop */}
            <div
                className={`chat-overlay ${chatToggled ? 'chat-overlay-backdrop' : ''}`}
                onClick={() => setChatToggled(false)}
            />

            {/* Chat drawer */}
            <div className={chatToggled ? 'chat-isOpen' : 'chat-container'}>
                <div className="chat-panel">
                    <div className="chat-panel-header-row">
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.isUser ? 'user-message' : 'ai-message'}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input type="text" placeholder="Type your message..." onChange={(e) => setMessage(e.target.value)} value={message} />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                    <div className="chat-input">
                        <input type="text" placeholder="Type your message..." onChange={(e) => setMessage(e.target.value)} value={message} />
                        <button onClick={handleSendMessageasAI}>Send As AI</button>
                    </div>
                </div>
            </div>

            {/* FAB */}
            <button className="fab" onClick={() => setChatToggled(!chatToggled)}>
                {chatToggled ? '✕' : '💬'}
            </button>
        </div>
    )
}
