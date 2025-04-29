// components/Post.jsx
import { useEffect, useState } from 'react';
import axios from '../api';

export default function Post({ post, onVote }) {
  const [author, setAuthor] = useState('');
  const [localVoteCount, setLocalVoteCount] = useState(post.VoteCount ?? 0);
  const [localMyVote, setLocalMyVote] = useState(post.MyVote ?? 0);

  const fetchAuthor = async () => {
    if (post.UserID) {
      try {
        const res = await axios.get(`/profile?id=${post.UserID}`);
        setAuthor(res.data.username);
      } catch {
        setAuthor('Unknown');
      }
    }
  };

  useEffect(() => {
    fetchAuthor();
    setLocalVoteCount(post.VoteCount ?? 0);
    setLocalMyVote(post.MyVote ?? 0);
  }, [post.ID]);

  const handleVote = (voteType) => {
    console.log('Clicked Vote:', voteType);
    console.log('My current Vote:', localMyVote);
  
    if (localMyVote === voteType) {
      // undo
      onVote(post.ID, voteType);
      setLocalVoteCount((prev) => prev - voteType); // remove from local count
      setLocalMyVote(0); 
      post.MyVote = 0;
      return;
    }
  
    // normal voting (new or different vote)
    const delta = voteType - (localMyVote || 0);
    onVote(post.ID, voteType);
    setLocalVoteCount((prev) => prev + delta);
    setLocalMyVote(voteType);
    post.MyVote = voteType;
  };

  return (
    <div className="shadow-sm p-4 mb-4 bg-white rounded">
      <h3 className="font-bold text-lg mb-1">{post.Title}</h3>
      <p className="text-xs text-gray-500 italic mb-2">
        Posted by <span className="font-medium text-gray-700">{author || '...'}</span>
      </p>
  
      <p className="mb-4 text-gray-800 leading-relaxed">{post.Content}</p>
  
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={() => handleVote(1)}>👍</button>
  
        <span
          style={{
            display: 'inline-block',
            width: '3ch',           // fixed width
            textAlign: 'center',    // center the number
            margin: '0 16px',       // spacing around it
            fontWeight: 'bold',
            color:
              localMyVote === 1
                ? 'green'
                : localMyVote === -1
                ? 'red'
                : 'black',
          }}
        >
          {localVoteCount}
        </span>
  
        <button onClick={() => handleVote(-1)}>👎</button>
      </div>
    </div>
  );
  
  
}
