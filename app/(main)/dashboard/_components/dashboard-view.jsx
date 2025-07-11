"use client"
import {
  LineChart, TrendingUp
  , TrendingDown
 } from 'lucide-react';
import  { Badge } from "@/components/ui/badge"
import { format,formatDistanceToNow } from 'date-fns';

const DashboardView = ({insights}) => {
    const salaryData = insights.salaryRanges.map((range) => ({
        name: range.role,
        min: range.min / 10000,
        max: range.max / 10000,
        median: range.median / 10000,
    }));

  const getDemandLevelColor = (level) => { 
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  const getMarketOutlookInfo = (outlook) => { 
    switch (outlook.toLowerCase()) {
      case 'positive':
        return { icon: TrendingUp, color: "text-green-500" };
      case 'neutral':
        return { icon: LineChart, color: "text-yellow-500" };
      case 'negative':
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-grey-500" };
    }
  }

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketoutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true });

  return (
    <div className='space-y-6'> 
      <div className='flex justify-between items-center'>
        <Badge variant="outline">Last updated:{lastUpdatedDate }</Badge>
      </div>
    </div>
  )
}

export default DashboardView