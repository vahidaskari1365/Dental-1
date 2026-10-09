import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const p = await db.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 2 });
console.log(JSON.stringify(p.map(x => ({ code: x.trackingCode, amount: x.amount, status: x.status, refId: x.refId })), null, 1));
const s = await db.smsLog.findMany({ orderBy: { createdAt: 'desc' }, take: 1 });
console.log('LAST SMS:', s[0]?.type, '|', s[0]?.message.slice(0, 80));
await db.$disconnect();
