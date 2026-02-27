type PageProps = {
  params: { username: string; slug: string };
};

export default async function CustomPage({ params }: PageProps) {
  return (
    <main>
      <h1>@{params.username}</h1>
      <p>Page feature removed. Use posts instead.</p>
    </main>
  );
}
