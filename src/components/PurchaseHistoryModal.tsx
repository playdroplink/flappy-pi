
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { gameBackendService } from '@/services/gameBackendService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { Clock, ShoppingBag, Coins, Zap, Crown } from 'lucide-react';

interface Purchase {
  id: string;
  item_type: 'premium' | 'ad_free' | 'skin' | 'elite';
  item_id: string;
  cost_coins: number;
  pi_transaction_id?: string;
  created_at: string;
}

interface PurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseHistoryModal: React.FC<PurchaseHistoryModalProps> = ({ isOpen, onClose }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const { profile } = useUserProfile();
  const { toast } = useToast();

  const fetchPurchaseHistory = async () => {
    if (!profile?.pi_user_id) return;

    setLoading(true);
    try {
      const history = await gameBackendService.getUserPurchases(profile.pi_user_id, 50);
      setPurchases(history);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && profile?.pi_user_id) {
      fetchPurchaseHistory();
    }
  }, [isOpen, profile?.pi_user_id]);

  const getItemTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'premium':
      case 'elite':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'ad_free':
        return <Zap className="h-4 w-4 text-purple-600" />;
      case 'skin':
        return <ShoppingBag className="h-4 w-4 text-blue-600" />;
      default:
        return <Coins className="h-4 w-4 text-green-600" />;
    }
  };

  const getItemTypeLabel = (itemType: string, itemId: string) => {
    switch (itemType) {
      case 'premium':
        return 'Premium Subscription';
      case 'elite':
        return 'Elite Subscription';
      case 'ad_free':
        return 'Ad-Free Experience';
      case 'skin':
        return `Bird Skin: ${itemId.charAt(0).toUpperCase() + itemId.slice(1)}`;
      default:
        return itemId;
    }
  };

  const getItemTypeBadgeColor = (itemType: string) => {
    switch (itemType) {
      case 'premium':
      case 'elite':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ad_free':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'skin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTransactionId = (transactionId?: string) => {
    if (!transactionId) return 'Game Coins';
    return transactionId.length > 20 
      ? `${transactionId.substring(0, 20)}...`
      : transactionId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 w-full h-full max-w-none max-h-none m-0 rounded-none bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <DialogHeader className="p-6 flex-shrink-0">
            <DialogTitle className="text-center text-3xl text-white flex items-center justify-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-white" />
              <span>Purchase History</span>
            </DialogTitle>
            <p className="text-center text-white/90 text-lg mt-2">
              Your verified purchases and transactions
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-auto px-6 pb-6">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                {loading ? (
                  <div className="p-8 flex items-center justify-center">
                    <Spinner className="h-8 w-8 text-blue-600" />
                    <span className="ml-3 text-blue-700">Loading purchase history...</span>
                  </div>
                ) : purchases.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Purchases Yet
                    </h3>
                    <p className="text-gray-600">
                      Your purchase history will appear here once you make your first purchase.
                    </p>
                    <Button 
                      onClick={onClose}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Browse Shop
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200">
                          <TableHead className="text-gray-700 font-semibold">Item</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Cost</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Transaction</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchases.map((purchase) => (
                          <TableRow key={purchase.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                {getItemTypeIcon(purchase.item_type)}
                                <span className="font-medium text-gray-900">
                                  {getItemTypeLabel(purchase.item_type, purchase.item_id)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getItemTypeBadgeColor(purchase.item_type)} border`}>
                                {purchase.item_type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {purchase.cost_coins > 0 ? (
                                  <>
                                    <Coins className="h-4 w-4 text-yellow-600" />
                                    <span className="font-medium text-gray-900">
                                      {purchase.cost_coins.toLocaleString()}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-purple-600 font-medium">Pi Payment</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <span className="text-gray-600">
                                  {formatTransactionId(purchase.pi_transaction_id)}
                                </span>
                                {purchase.pi_transaction_id && (
                                  <div className="text-xs text-green-600 mt-1">
                                    ✓ Pi Network Verified
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(purchase.created_at)}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>

              {purchases.length > 0 && (
                <Card className="mt-4 p-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {purchases.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Purchases</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {purchases.reduce((sum, p) => sum + p.cost_coins, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Coins Spent</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {purchases.filter(p => p.pi_transaction_id).length}
                      </div>
                      <div className="text-sm text-gray-600">Pi Transactions</div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseHistoryModal;
