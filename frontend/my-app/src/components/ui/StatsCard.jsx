// src/components/ui/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, change, changeType = 'positive', description }) => {
  const changeColor = changeType === 'positive' ? 'text-success-600' : 'text-error-600';
  const changeBg = changeType === 'positive' ? 'bg-success-50' : 'bg-error-50';

  return (
    <div className="card p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="p-3 bg-primary-50 rounded-lg">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-2">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${changeBg} ${changeColor}`}>
            {change}
          </div>
          {description && (
            <span className="ml-1 text-sm text-gray-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;   