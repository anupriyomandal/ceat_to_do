import { create } from 'zustand';
import type { Post } from '../types';

const API_BASE = '';

interface ForumState {
  posts: Post[];
  isLoading: boolean;

  fetchPosts: () => Promise<void>;
  addPost: (content: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

export const useForumStore = create<ForumState>((set) => ({
  posts: [],
  isLoading: false,

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/api/posts`);
      const posts = await res.json();
      set({ posts, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      set({ isLoading: false });
    }
  },

  addPost: async (content) => {
    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const newPost = await res.json();
      set((state) => ({ posts: [newPost, ...state.posts] }));
    } catch (err) {
      console.error('Failed to add post:', err);
    }
  },

  deletePost: async (id) => {
    try {
      await fetch(`${API_BASE}/api/posts/${id}`, { method: 'DELETE' });
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  },
}));
