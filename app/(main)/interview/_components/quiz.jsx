"use client"
import React, { useEffect, useState } from 'react';
import useFetch from '@/hooks/use-fetch';
import { generateQuiz, saveQuizResult } from '@/actions/interview';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import QuizResult from './quiz-result';
import { Label } from '@/components/ui/label';
import { Loader2 } from "lucide-react"; // ensure Loader2 is imported if needed

const Quiz = () => {
  const {
    loading: GeneratingQuiz,
    fn: generateQuizfn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResults,
    fn: saveQuizfn,
    data: resultData,
  } = useFetch(saveQuizResult);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);
    
    const handleAnswer = (answer) => {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = answer;
      setAnswers(newAnswers);
    }
    
    const calculateScore = () => { 
      let correct = 0;
      answers.forEach((answer, index) => {
        if (answer === quizData[index].correctAnswer) {
          correct++;
        }
      });
      return (correct / quizData.length) * 100;
    };

    const finishQuiz = async () => { 
      const score = calculateScore();

      try {
        await saveQuizfn(quizData, answers, score);
        toast.success("Quiz Completed");
      } catch (error) {
        toast.error(error.message || "Failed to save quiz result");
      }
    };

    const handleNext = () => { 
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowExplanation(false);
      } else { 
        finishQuiz();
      }
    }
   
    const startNewQuiz = () => { 
      setCurrentQuestion(0);
      setAnswers([]);
      setShowExplanation(false);
      generateQuizfn();
      // Optionally clear existing result data if needed
    }
   
  if (GeneratingQuiz) { 
    return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  }

    if (resultData) {
      return (
        <div>
          <QuizResult result={resultData} onstartNew={startNewQuiz} />
      </div>
    );
  }
    
  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Test your knowledge</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This quiz contains 10 questions that will help you test your knowledge.
          Answer the following questions to the best of your ability.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateQuizfn}>Start Quiz</Button>
        </CardFooter>
      </Card>
    );
  }
    
  const question = quizData[currentQuestion];

  return (
    <div>
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Question {currentQuestion + 1} of {quizData.length} </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{question.question}</p>
          <RadioGroup className="space-y-2" onValueChange={handleAnswer} value={answers[currentQuestion]}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {showExplanation && (
            <div className='mt-4 p-4 bg-muted rounded-lg'>
              <p className='font-medium'>Explanation:</p>
              <p className='text-muted-foreground'>{question.explanation}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!showExplanation && (
            <Button onClick={() => { setShowExplanation(true) }} variant="outline" disabled={!answers[currentQuestion]}>Show Explanation</Button>
          )}
          {!showExplanation && (
            <Button onClick={handleNext} className="ml-auto" disabled={!answers[currentQuestion] || savingResults}>
              {savingResults && <Loader2 className="mr-2 h-4 w-4 animate-spin" /> }
              {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Quiz;