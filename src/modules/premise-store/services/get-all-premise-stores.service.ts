import { OLD_API_URL } from '@/config/constants';
import { ApiPremiseStore } from './interfaces';
import { createPremiseStore } from './adapters';

interface Params {
  accessToken: string;
}

export async function getAllPremiseStoreServices({ accessToken }: Params) {
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${accessToken}`);

  const url = `${OLD_API_URL}/stores`;
  const res = await fetch(url, { headers });

  const data: ApiPremiseStore[] = await res.json();
  return data.map(createPremiseStore);
}
