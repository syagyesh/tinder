import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { getUserbyID, getUserWithNoConnections } from './neo4j.action';
import HomeComponent from './components/Home';

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!await isAuthenticated()) {
    return redirect(
      `/api/auth/login?post_login_redirect_url=http://localhost:3000/callback`
    );
  }

  const user = await getUser();

  if (!user) {
    return redirect(
      `/api/auth/login?post_login_redirect_url=http://localhost:3000/callback`
    )
  };

  const getUserswithNoConnections = await getUserWithNoConnections(user.id);
  const getCurrentUser = await getUserbyID(user.id);

  return (
    <main>
      {getCurrentUser &&
        <HomeComponent users={getUserswithNoConnections} currentUser={getCurrentUser} />
      }
    </main>
  );
}
