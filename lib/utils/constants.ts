    export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

    export const NETWORKS = [
    { id: 'mtn', name: 'MTN' },
    { id: 'airtel', name: 'Airtel' },
    { id: 'glo', name: 'Glo' },
    { id: 'etisalat', name: '9mobile' }
    ];

    export const DATA_BUNDLES = [
    { id: 'data100mb', name: '100MB', price: 5 },
    { id: 'data500mb', name: '500MB', price: 15 },
    { id: 'data1gb', name: '1GB', price: 25 },
    { id: 'data2gb', name: '2GB', price: 45 },
    { id: 'data5gb', name: '5GB', price: 100 }
    ];

    export const TRANSACTION_STATUS = {
        PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        SUCCESS: { label: 'Success', color: 'bg-green-100 text-green-800' },
        FAILED: { label: 'Failed', color: 'bg-red-100 text-red-800' }
        } as const;