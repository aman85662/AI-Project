import { getAssesments } from "@/actions/interview"
import Statscards from "./_components/stat-card";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";

 const Interviewpage = async () => {
   const assesment = await getAssesments();
   
   return (
    <div>
      <h1 className="text-6xl font-bold text-center mb-10 gradient-title">
        Interview Prepration
      </h1>


      <div className="space-y-4">
         <Statscards assesments={assesment} />
         <PerformanceChart assesments={assesment} />
           <QuizList assesments = {assesment}/>
    </div>

    </div>
  )
}

export default Interviewpage