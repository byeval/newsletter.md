type PageProps = {
  params: { username: string };
};

export default function UserHomePage({ params }: PageProps) {
  return (
    <main>
      <h1>@{params.username}</h1>
      <p>Public profile page</p>
    </main>
  );
}
