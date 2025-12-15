"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@acme/backend/api";

export const CreatePostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createPost = useMutation(api.posts.create);
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-input rounded-md border border-gray-300 p-2"
        placeholder="Title"
      />
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-input rounded-md border border-gray-300 p-2"
        placeholder="Content"
      />
      <button
        className="rounded-md bg-blue-500 p-2 text-white"
        onClick={() => createPost({ title, content })}
      >
        Create Post
      </button>
    </div>
  );
};

export const PostList = () => {
  const posts = useQuery(api.posts.getAll);
  return (
    <div className="flex max-h-[500px] w-xl flex-col gap-2 overflow-y-auto">
      {posts?.map((post) => (
        <div key={post._id} className="bg-input rounded-md p-4">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p className="text-gray-500">{post.content}</p>
        </div>
      ))}
    </div>
  );
};
