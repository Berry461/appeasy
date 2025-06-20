// components/StatsCard.tsx
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    indigo: 'bg-indigo-100 text-indigo-800',
};

export default function StatsCard({
    title,
    value,
    trend = 'none',
    color = 'indigo',
}: {
    title: string;
    value: number;
    trend?: 'up' | 'down' | 'none';
    color?: keyof typeof colorClasses;
}) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color]}`}>
                        <span className="text-lg font-semibold">{value}</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="flex items-baseline">
                            {trend !== 'none' && (
                                <div className={`ml-2 flex items-baseline text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {trend === 'up' ? (
                                        <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
                                    )}
                                </div>
                            )}
                        </dd>
                    </div>
                </div>
            </div>
        </div>
    );
}