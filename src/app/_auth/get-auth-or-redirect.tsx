import { getAuth } from './get-auth'
import { redirect } from 'next/navigation';
import { signInPath } from '../paths';

const getAuthOrRedirect = async () => {
    const auth = await getAuth();

    if(!auth.user) redirect(signInPath())

  return { ...auth }
}

export default getAuthOrRedirect
