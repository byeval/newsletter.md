type PageProps = {
  params: { username: string; slug: string };
};

export default function PostPage({ params }: PageProps) {
  return (
    <main>
      <h1>@{params.username}</h1>
      <p>Post: {params.slug}</p>
    </main>
  );
}
