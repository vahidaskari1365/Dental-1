import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const a = await db.appointment.deleteMany({});
const p = await db.payment.deleteMany({});
const s = await db.smsLog.deleteMany({});
const c = await db.chatMessage.deleteMany({});
console.log(`cleaned: ${a.count} appointments, ${p.count} payments, ${s.count} sms, ${c.count} chats`);
await db.$disconnect();
