import NextAuth from 'next-auth';

import { authOptions } from '@/modules/auth/config';
import { NextRequest } from 'next/server';

type RouteHandlerContext = { params: { nextauth: string[] } };

const handler = async (req: NextRequest, context: RouteHandlerContext) => {
  return await NextAuth(req, context, authOptions(req.clone()));
};

export { handler as GET, handler as POST };
