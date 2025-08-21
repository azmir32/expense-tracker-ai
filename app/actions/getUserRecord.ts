'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Record } from '@/types/Record';

async function getUserRecord(): Promise<{
  record?: number;
  daysWithRecords?: number;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const records = await db.record.findMany({
      where: { userId },
    });

    const record = records.reduce((sum: number, record: Record) => sum + record.amount, 0);

    // Count the number of days with valid expense records
    const daysWithRecords = records.filter(
      (record: Record) => record.amount > 0
    ).length;

    return { record, daysWithRecords };
  } catch (error) {
    console.error('Error fetching user record:', error); // Log the error
    return { error: 'Database error' };
  }
}

export default getUserRecord;