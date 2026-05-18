import React, { useState, useEffect } from 'react';
import { useForumStore } from '../store/forumStore';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { MessageSquare, Send, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ForumView: React.FC = () => {
  const { posts, fetchPosts, addPost, deletePost } = useForumStore();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await addPost(content.trim());
    setContent('');
    setIsPosting(false);
  };

  const handleTranscription = (text: string) => {
    setContent((prev) => (prev ? prev + '\n' + text : text));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Anonymous Forum
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Share your thoughts anonymously. Record your voice and let Whisper transcribe it for you.
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Ctrl+Enter to post)"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          <VoiceRecorder onTranscription={handleTranscription} />
          <Button
            variant="accent"
            onClick={handlePost}
            isLoading={isPosting}
            disabled={!content.trim()}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Post Message
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
            <MessageSquare className="w-4 h-4" />
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </div>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-black whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </div>
              <button
                onClick={() => deletePost(post.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                aria-label="Delete post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <EmptyState
            title="No messages yet"
            description="Be the first to share something in the anonymous forum."
          />
        )}
      </div>
    </div>
  );
};
