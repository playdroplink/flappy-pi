
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { paymentHistoryService, PaymentHistoryItem } from '@/services/paymentHistoryService';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { format } from 'date-fns';
import PaymentStatusIndicator from '@/components/PaymentStatusIndicator';

const PaymentHistoryPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, signInWithPi } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadPaymentHistory();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadPaymentHistory = async () => {
    setLoading(true);
    try {
      const history = await paymentHistoryService.getUserPaymentHistory();
      setPayments(history);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusChange = (paymentId: string, newStatus: string) => {
    setPayments(prevPayments => 
      prevPayments.map(payment => 
        payment.pi_transaction_id === paymentId 
          ? { ...payment, payment_status: newStatus as any }
          : payment
      )
    );
  };

  const formatAmount = (payment: PaymentHistoryItem) => {
    if (payment.payment_type === 'pi_payment' && payment.amount_pi > 0) {
      return `${payment.amount_pi} π`;
    } else if (payment.amount_coins > 0) {
      return `${payment.amount_coins} coins`;
    }
    return 'Free';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Coins className="w-6 h-6 text-purple-600" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Sign in with Pi Network to view your payment history.
              </p>
              <Button onClick={signInWithPi} className="bg-purple-600 hover:bg-purple-700">
                Sign in with Pi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <Button
            variant="outline"
            onClick={loadPaymentHistory}
            disabled={loading}
            className="ml-auto"
          >
            {loading ? <Spinner className="w-4 h-4" /> : 'Refresh'}
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8 text-purple-600" />
          </div>
        )}

        {/* Empty State */}
        {!loading && payments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Coins className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Payment History
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't made any purchases yet. Start exploring our shop!
              </p>
              <Button
                onClick={() => navigate('/shop')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Browse Shop
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment History List */}
        {!loading && payments.length > 0 && (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{payment.item_name}</h3>
                        <PaymentStatusIndicator 
                          paymentId={payment.pi_transaction_id} 
                          initialStatus={payment.payment_status}
                          onStatusChange={(newStatus) => 
                            handlePaymentStatusChange(payment.pi_transaction_id || '', newStatus)
                          }
                        />
                      </div>
                      
                      {payment.item_description && (
                        <p className="text-gray-600 text-sm mb-3">{payment.item_description}</p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>
                          {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                        <span className="capitalize">
                          {payment.payment_type.replace('_', ' ')}
                        </span>
                        {payment.pi_transaction_id && (
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {payment.pi_transaction_id.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600 mb-1">
                        {formatAmount(payment)}
                      </div>
                      {payment.completed_at && (
                        <div className="text-xs text-gray-500">
                          Completed {format(new Date(payment.completed_at), 'MMM dd, HH:mm')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && payments.length >= 50 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={loadPaymentHistory}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
