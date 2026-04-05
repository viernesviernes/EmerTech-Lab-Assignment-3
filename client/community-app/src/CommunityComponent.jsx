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

const SEND_MESSAGE_TO_AI_MUTATION = gql`
  mutation SendMessageToAI($userMsg: String!) {
    sendMessageToAI(userMsg: $userMsg) {
      text
      suggestedQuestions
      retrievedPosts {
        id
        title
      }
    }
  }
`

export default function CommunityComponent() {

    const { data } = useQuery(GET_CURRENT_USER_QUERY);
    const [chatToggled, setChatToggled] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [retrievedPosts, setRetrievedPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');

    const [signOut] = useMutation(SIGN_OUT_MUTATION, {
        onCompleted: () => { window.location.href = '/'; }
    });

    const [sendMessageToAI, { loading: aiLoading }] = useMutation(SEND_MESSAGE_TO_AI_MUTATION, {
        onCompleted: (data) => {
            const ai = data.sendMessageToAI;
            setMessages(prev => [...prev, { text: ai.text, isUser: false }]);
            setSuggestedQuestions(ai.suggestedQuestions ?? []);
            setRetrievedPosts(ai.retrievedPosts ?? []);
        }
    });

    const handleSendMessage = () => {
        if (!message.trim() || aiLoading) return;
        const userMsg = message.trim();
        setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
        setSuggestedQuestions([]);
        setMessage('');
        sendMessageToAI({ variables: { userMsg } });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    }

    const handleSuggestedQuestion = (q) => {
        setMessages(prev => [...prev, { text: q, isUser: true }]);
        setSuggestedQuestions([]);
        sendMessageToAI({ variables: { userMsg: q } });
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
                        <button className="chat-close-btn" onClick={() => setChatToggled(false)}>✕</button>
                    </div>
                    {retrievedPosts.length > 0 && (
                        <div className="retrieved-posts-box">
                            <span className="retrieved-posts-label">Referenced posts</span>
                            {retrievedPosts.map(post => (
                                <div key={post.id} className="retrieved-post-item">{post.title}</div>
                            ))}
                        </div>
                    )}
                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <p>Ask me anything about the community!</p>
                        )}
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.isUser ? 'user-message' : 'ai-message'}>
                                {msg.text}
                            </div>
                        ))}
                        {aiLoading && (
                            <div className="ai-message">Thinking...</div>
                        )}
                        {suggestedQuestions.length > 0 && (
                            <div className="suggested-questions">
                                {suggestedQuestions.map((q, i) => (
                                    <button key={i} className="suggested-question-btn" onClick={() => handleSuggestedQuestion(q)}>
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Ask about the community..."
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={message}
                            disabled={aiLoading}
                        />
                        <button onClick={handleSendMessage} disabled={aiLoading}>Send</button>
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
