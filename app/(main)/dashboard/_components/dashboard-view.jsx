"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, TrendingUp, TrendingDown, BriefcaseIcon, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";

const DashboardView = ({ insights }) => {
  if (!insights) {
    return <div className="text-center p-10">No insights available</div>;
  }

  // Use default empty arrays if properties are missing
  const salaryData = (insights.salaryRanges || []).map((range) => ({
    name: range.role,
    min: range.min / 10000,
    max: range.max / 10000,
    median: range.median / 10000,
  }));

  // If your backend returns these keys in lowercase, adjust here.
  const keyTrends = insights.keyTrends || insights.Keytrends || [];
  const recommendedSkills = insights.recommendedSkills || insights.RecommendedSkills || [];
  
  const getDemandLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Ensure market outlook exists before calling toLowerCase()
  const getMarketOutlookInfo = (outlook) => {
    if (!outlook) {
      return { icon: LineChart, color: "text-grey-500" };
    }
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-grey-500" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } = getMarketOutlookInfo(insights.marketOutlook);
  const lastUpdatedDate = insights.lastUpdated ? format(new Date(insights.lastUpdated), "dd/MM/yyyy") : "N/A";
  const nextUpdateDistance = insights.nextUpdate ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true }) : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <OutlookIcon className={`h-6 w-6 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook || "N/A"}</div>
            <p className="text-muted-foreground text-xs">
              Next Update: {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeof insights.growthRate === "number" ? insights.growthRate.toFixed(1) : "0.0"}%</div>
            <Progress value={insights.growthRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel || "N/A"}</div>
            <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`}></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(insights.topSkills || []).map((skill) => (
                <Badge key={skill} className="mr-1 mb-1" variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Salary Ranges by Roles</CardTitle>
              <CardDescription>Display minimum and maximum salary ranges for each role (in thousands)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      content={({active, payload, label}) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-md">
                              <p className="font-medium">{label}</p>
                              {payload.map((item) => (
                                <p key={item.name} className="text-xs">{item.name}: ${item.value}k</p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="min" fill="#8884d8" name="Min salary" />
                    <Bar dataKey="median" fill="#8884d8" name="Median salary" />
                    <Bar dataKey="max" fill="#82ca9d" name="Max salary" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Key Industry trends</CardTitle>
            <CardDescription>Current trends shaping the industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-1" />
                  <span className="text-sm">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recommended Skills</CardTitle>
            <CardDescription>Skills to focus on for career growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 flex flex-wrap gap-2">
              {recommendedSkills.map((skill, index) => (
                <Badge key={index} className="mr-1 mb-1" variant="outline">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;