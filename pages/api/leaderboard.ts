import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export interface LeaderboardItem {
  points: number;
  date: string;
}

const STORAGE_KEY = 'leaderboard';
const MAX_COUNT = 9;

function compareItems(a: LeaderboardItem, b: LeaderboardItem) {
  const pointCompare = a.points - b.points;
  if (pointCompare !== 0) return pointCompare;
  return a.date.localeCompare(b.date);
}

function addItem(list: LeaderboardItem[], item: LeaderboardItem): LeaderboardItem[] {
  const updated = [...list, item];
  updated.sort((a, b) => compareItems(b, a));
  return updated.slice(0, MAX_COUNT);
}

async function loadLeaderboard(): Promise<LeaderboardItem[]> {
  const data = await kv.get<LeaderboardItem[]>(STORAGE_KEY);
  return Array.isArray(data) ? data : [];
}

async function saveLeaderboard(items: LeaderboardItem[]): Promise<void> {
  await kv.set(STORAGE_KEY, items);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const item = req.body as LeaderboardItem;
    const items = await loadLeaderboard();
    const updated = addItem(items, item);
    await saveLeaderboard(updated);
    res.status(200).json(updated);
    return;
  }

  if (req.method === 'GET') {
    const items = await loadLeaderboard();
    res.status(200).json(items);
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method Not Allowed');
}
