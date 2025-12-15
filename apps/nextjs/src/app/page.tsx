import { CreatePostForm, PostList } from "./posts";

export default function HomePage() {
  return (
    <div className="bg-background h-screen w-screen">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">T3</span> Turbo
        </h1>
        <CreatePostForm />
        <PostList />
      </div>
    </div>
  );
}
