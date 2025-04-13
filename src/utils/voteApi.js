import { supabase } from '../supabaseClient';

export async function submitVote(date, optionId) {
  const { error } = await supabase.rpc('increment_vote', {
    vote_date: date,
    opt_id: optionId,
  });

  if (error) {
    console.error('Vote submission error:', error.message);
    return false;
  }

  return true;
}

export async function fetchVoteCounts(date) {
  const { data, error } = await supabase
    .from('votes')
    .select('option_id, count')
    .eq('date', date);

  if (error) {
    console.error('Vote fetch error:', error.message);
    return [];
  }

  return data;
}
