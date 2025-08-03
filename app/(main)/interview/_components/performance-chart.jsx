"use client"

import { useState, useEffect } from "react";
import { format } from "date-fns";

const PerformanceChart = ({assesments}) => {
  
  const [chartData, setChartData] = useState({});

  useEffect(() => { 
    if (assesments) {
      const formattedData = assesments.map((assesments) => ({
        date: format(new Date(assesments.createdAt), "MMM dd"),
        score: assesments.quizScore,
      }));
      setChartData(formattedData);
    }
  },[assesments])
  
  
  return (
 <Card>
  <CardHeader>
    <CardTitle className="gradient-title text-3xl md:text-4xl">Performance Trend</CardTitle>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
  )
}

export default PerformanceChart