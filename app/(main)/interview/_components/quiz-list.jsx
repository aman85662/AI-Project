"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card,CardContent,CardHeader,CardTitle,CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import QuizResult from './quiz-result';
import { format } from "date-fns";

const QuizList = ({assesments}) => {
 
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
 
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="gradient-title text-3xl md:text-4xl">Recent Quizzes</CardTitle>
    <CardDescription>Review your past quizzes and their performance</CardDescription>
          </div>
    <Button onClick={() => router.push('/interview/mock')}>Start New Quiz</Button>
  </CardHeader>
  <CardContent>
          <div className='space-y-4'>
            {assesments.map((assesments, i) => {
              return (
                <Card className=" cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedQuiz(assesments)} key={assesments.id}>
  <CardHeader>
                    <CardTitle>Quiz { i+1}</CardTitle>
                    <CardDescription className = "flex justify-between w-full">
                      <div>
                        Score: {assesments.quizScore.toFixed(1)}%
                      </div>
                      <div>
                        {format(
                          new Date(assesments.createdAt),
                          'MMM dd,yyyy HH:mm'
                        )}
                      </div>
    </CardDescription>
  </CardHeader>
  <CardContent>
                    <p className='text-sm text-muted-foreground'>{ assesments.improvementTip}</p>
  </CardContent>
</Card>
              )
            })}
  </div>
  </CardContent>
      </Card>
      

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription>
       <QuizResult result={selectedQuiz} onStartNew={() => router.push('/interview/mock')} hideStartNew/>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default QuizList