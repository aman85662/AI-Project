import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, Trophy } from "lucide-react";

const StatsCards = ({ assesments }) => {
    const getAverageScore = () => {
        if (!assesments?.length) return 0;
        const total = assesments.reduce(
            (sum, assesments) => sum + assesment.quizscore, 0
        );
        return (total / assesments.length).toFixed(1);
    };

    const getLatestAssesment = () => { 
        if (!assesments?.length) return null;
        return assesments[0];
    }

    const getTotalQuestions = () => {
        if (!assesments?.length) return 0;
        return assesments.reduce((sum, assesment) => sum + assesment.questions.length, 0);
    }


  return (
      <div className='grid gap-4 md:grid-cols-3'>
           <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageScore()}%</div>
            <p className="text-muted-foreground text-xs">
             Across all assessments
            </p>
          </CardContent>
          </Card>

           <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Question Practiced</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalQuestions()}</div>
            <p className="text-muted-foreground text-xs">
           Total Questions
            </p>
          </CardContent>
          </Card>
          
           <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLatestAssesment()?.quizscore.toFixed(1) || 0}%</div>
            <p className="text-muted-foreground text-xs">
             Most Recent Quiz
            </p>
          </CardContent>
        </Card>

      </div>
  )
}

export default StatsCards