type PageProps = {
  params: { username: string; slug: string };
};

export default function CustomPage({ params }: PageProps) {
  return (
    <main>
      <h1>@{params.username}</h1>
      <p>Page: {params.slug}</p>
    </main>
  );
}
