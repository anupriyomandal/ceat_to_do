'use client';

import { useState, useEffect } from 'react';
import { useForumStore } from '@/store/forumStore';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { AppShell } from '@/components/AppShell';
import { Card, CardContent } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ForumPage() {
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
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Anonymous Forum</h1>
        </div>

        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Share your thoughts anonymously. Record your voice and let Whisper transcribe it for you.
            </p>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Ctrl+Enter to post)"
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none transition-all"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
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
          </CardContent>
        </Card>

        <div className="space-y-4">
          {posts.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
              <MessageSquare className="w-4 h-4" />
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </div>
          )}

          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="group hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
                    </div>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                      aria-label="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {posts.length === 0 && (
            <EmptyState
              title="No messages yet"
              description="Be the first to share something in the anonymous forum."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
