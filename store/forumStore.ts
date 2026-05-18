'use client';

import { create } from 'zustand';
import type { Post } from '../types';

// API calls go through Vercel rewrites (/api/* -> Railway backend)
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
      if (!res.ok) throw new Error('Failed to fetch posts');
      const posts = await res.json();
      set({ posts, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      set({ isLoading: false });
    }
  },

  addPost: async (content) => {
    const res = await fetch(`${API_BASE}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to create post');
    const newPost = await res.json();
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },

  deletePost: async (id) => {
    const res = await fetch(`${API_BASE}/api/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete post');
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    }));
  },
}));
