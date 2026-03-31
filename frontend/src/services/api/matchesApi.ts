import axios from 'axios';
import type { Match } from '../../types/match';
import { apiBaseUrl } from '../config';

export async function fetchMatches(): Promise<Match[]> {
  const url = `${apiBaseUrl}/api/matches`;
  const response = await axios.get<{ data: Match[] }>(url);
  return response.data.data;
}

