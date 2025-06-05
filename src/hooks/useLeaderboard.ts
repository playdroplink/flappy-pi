
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  id: string;
  pi_user_id: string;
  username: string;
  highest_score: number;
  total_games: number;
  created_at: string;
  updated_at: string;
}

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submittingScore, setSubmittingScore] = useState(false);
  const { toast } = useToast();

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_scores')
        .select('*')
        .order('highest_score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard",
          variant: "destructive"
        });
        return;
      }

      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async (piUserId: string, username: string, score: number) => {
    setSubmittingScore(true);
    try {
      const { error } = await supabase.rpc('update_user_score', {
        p_pi_user_id: piUserId,
        p_username: username,
        p_score: score
      });

      if (error) {
        console.error('Error submitting score:', error);
        toast({
          title: "Error",
          description: "Failed to submit score",
          variant: "destructive"
        });
        return false;
      }

      // Refresh leaderboard after successful submission
      await fetchLeaderboard();
      
      toast({
        title: "Score Submitted! 🎯",
        description: `Your score of ${score} has been recorded!`
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting score:', error);
      toast({
        title: "Error",
        description: "Failed to submit score",
        variant: "destructive"
      });
      return false;
    } finally {
      setSubmittingScore(false);
    }
  };

  // Set up real-time subscription for leaderboard updates
  useEffect(() => {
    fetchLeaderboard();

    // Create a unique channel name to avoid conflicts
    const channelName = `leaderboard-changes-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_scores'
        },
        () => {
          // Refresh leaderboard when any score changes
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    leaderboard,
    loading,
    submittingScore,
    fetchLeaderboard,
    submitScore
  };
};
