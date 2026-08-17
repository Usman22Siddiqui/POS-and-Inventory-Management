import React from 'react';
import { FiAlertTriangle, FiThermometer, FiCpu, FiShield, FiPackage } from 'react-icons/fi';

export const CategoryBadge = ({ category, showIcon = true }) => {
  const getBadgeConfig = () => {
    switch (category) {
      case 'Fragile':
        return {
          className: 'badge badge-fragile',
          icon: <FiAlertTriangle size={11} />,
          label: 'Fragile',
        };
      case 'Cold':
        return {
          className: 'badge badge-cold',
          icon: <FiThermometer size={11} />,
          label: 'Cold Storage',
        };
      case 'Tech':
        return {
          className: 'badge badge-tech',
          icon: <FiCpu size={11} />,
          label: 'Tech / Electronics',
        };
      case 'Cleaning':
        return {
          className: 'badge badge-cleaning',
          icon: <FiShield size={11} />,
          label: 'Chemical / Cleaning',
        };
      case 'General':
      default:
        return {
          className: 'badge badge-general',
          icon: <FiPackage size={11} />,
          label: 'General Item',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={config.className}>
      {showIcon && config.icon}
      {config.label}
    </span>
  );
};
