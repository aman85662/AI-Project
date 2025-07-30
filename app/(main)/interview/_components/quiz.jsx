"use client"
import React, { useEffect, useState } from 'react';
import  useFetch  from '@/hooks/use-fetch';
import { generateQuiz } from '@/actions/interview';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem, Label } from '@/components/ui/radio-group';


  const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);
    
    const handleAnswer = (answers) => {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answers;
      setAnswers(newAnswers);
     }

  if (GeneratingQuiz) { 
    return <BarLoader className="mt-4" width={"100%"} color="grey" />;
  }

  const {
    loading: GeneratingQuiz,
    fn: generateQuizfn,
    data: quizData,
  } = useFetch(generateQuiz);
    
  if (!quizData) {
    return (
      <Card className="mx-2">
  <CardHeader>
    <CardTitle>Test your knowledge</CardTitle>
  </CardHeader>
  <CardContent>
    <p>this quiz contain 10 questions that will help you to test your knowledge.
    Answer the following questions to the best of your ability.</p>
  </CardContent>
  <CardFooter>
   <Button className="w-full" onClick={generateQuizfn}>Start Quiz</Button>
  </CardFooter>
</Card>
    )
    }
    
    const question = quizData[currentQuestion];

    return (
      <div>
         <Card className="mx-2">
  <CardHeader>
            <CardTitle>Question {currentQuestion + 1} of {quizData.length } </CardTitle>
  </CardHeader>
  <CardContent>
            <p>{question.question}</p>
            <RadioGroup classname ="space-y-2" onvalueChange ={handleAnswer} value={answers[currentQuestion]}>
              {question.options.map((option, index) => {
                return(
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                )
              })}
            </RadioGroup>
            {true && (
              <div className='mt-4 p-4 bg-muted rounded-lg'>
                <p className='font-medium'>Explanation:</p>
                <p className='text-muted-foreground'>{question.explanation}</p>
              </div>
            )}

  </CardContent>
  <CardFooter>

  </CardFooter>
</Card>
      </div>
    )
}

export default Quiz;