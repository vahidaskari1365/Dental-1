import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const appts = await db.appointment.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });
console.log('APPOINTMENTS:', JSON.stringify(appts.map(a => ({ code: a.trackingCode, name: a.fullName, svc: a.serviceName, date: a.date, slot: a.timeSlot, status: a.status })), null, 1));
const sms = await db.smsLog.findMany({ orderBy: { createdAt: 'desc' }, take: 2 });
console.log('SMS:', JSON.stringify(sms.map(s => ({ to: s.phone, type: s.type, status: s.status, msg: s.message.slice(0, 90) })), null, 1));
await db.$disconnect();
