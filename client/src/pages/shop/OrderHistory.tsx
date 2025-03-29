import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Order interface
interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

// Sample orders (in a real app, this would come from the GraphQL API)
const sampleOrders: Order[] = [
  {
    id: 'ORD-2023-1001',
    date: '2025-03-25T14:30:00Z',
    status: 'delivered',
    total: 74.97,
    items: [
      {
        id: '1',
        name: 'Daily Multivitamin',
        quantity: 1,
        price: 24.99,
        image: 'https://picsum.photos/seed/sleep/100/100',
      },
      {
        id: '2',
        name: 'Omega-3 Fish Oil',
        quantity: 1,
        price: 19.99,
        image: 'https://picsum.photos/seed/sleep/100/100',
      },
      {
        id: '5',
        name: 'Vitamin D3',
        quantity: 2,
        price: 15.99,
        image: 'https://picsum.photos/seed/sleep/100/100',
      },
    ],
  },
  {
    id: 'ORD-2023-0932',
    date: '2025-02-18T10:15:00Z',
    status: 'delivered',
    total: 92.97,
    items: [
      {
        id: '3',
        name: 'Protein Powder',
        quantity: 1,
        price: 39.99,
        image: 'https://picsum.photos/seed/sleep/100/100',
      },
      {
        id: '4',
        name: 'Probiotics',
        quantity: 1,
        price: 29.99,
        image: 'https://picsum.photos/seed/sleep/100/100',
      },
      {
        id: '6',
        name: 'Magnesium Complex',
        quantity: 1,
        price: 22.99,
        image: 'https://picsum.photos/seed/sleep/100/100',
      },
    ],
  },
];

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch orders (simulated)
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be a GraphQL query
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(sampleOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  // Status badge
  const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    let bgColor;
    let textColor;
    
    switch (status) {
      case 'processing':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'shipped':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'delivered':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }
    
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="bg-white" data-cy="order-history-page">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order History</h1>
        <p className="mt-2 text-sm text-gray-500">
          Check the status of recent orders, manage returns, and download invoices.
        </p>
        
        {isLoading ? (
          <div className="mt-12 animate-pulse">
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {[...Array(2)].map((_, i) => (
                  <li key={i}>
                    <div className="p-4 sm:px-6">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-12 text-center py-12" data-cy="no-orders">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't placed any orders yet.
            </p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                data-cy="start-shopping-button"
              >
                Browse products
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 overflow-hidden bg-white shadow sm:rounded-md" data-cy="orders-list">
            <ul role="list" className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order.id} data-cy={`order-${order.id}`}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="truncate text-sm font-medium text-primary-600">
                          {order.id}
                        </div>
                        <div className="ml-2 flex flex-shrink-0">
                          <StatusBadge status={order.status} />
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{formatDate(order.date)}</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <svg
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{order.items.length} items</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-900 sm:mt-0">
                          ${order.total.toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Order items (compact view) */}
                      <div className="mt-4 flex space-x-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-md object-cover object-center"
                              title={`${item.name} (Qty: ${item.quantity})`}
                            />
                          </div>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 flex justify-between">
                        <button
                          type="button"
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                          data-cy={`view-order-${order.id}`}
                        >
                          View Order Details
                        </button>
                        <button
                          type="button"
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                          data-cy={`track-order-${order.id}`}
                        >
                          Track Shipment
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;