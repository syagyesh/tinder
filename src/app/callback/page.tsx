import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { createUser, getUserbyID } from '../neo4j.action';


export default async function Callback() {
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

  const dbUser = await getUserbyID(user.id);

  if (!dbUser) {
    //create user in Neo4j
    await createUser({ id: user.id, firstName: user.given_name!, lastName: user.family_name ?? undefined, email: user.email! });
  }

  return redirect('/');
}