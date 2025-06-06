
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuthGuard('/');

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return null; // useAuthGuard will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;
