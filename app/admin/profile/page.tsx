export default function ProfilePage() {
  return (
    <main>
      <h1>Profile</h1>
      <form method="post" action="/api/username/claim">
        <label>
          Username
          <input name="username" type="text" />
        </label>
        <button type="submit">Claim</button>
      </form>
    </main>
  );
}
