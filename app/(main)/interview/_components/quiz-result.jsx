import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@radix-ui/react-progress";
import { CheckCircle, Trophy, XCircle } from "lucide-react";



const QuizResult = ({result,hideStartNew = false,onStartNew}) => {
    if (!result) return null;
    
    return (
        <div className="mx-auto">
            <h1 className="flex item-center gap-2 text-3xl gradient-title">
                <Trophy className="h-8 w-8 text-blue-700" />
                Quiz Result
            </h1>

            <CardContent>
                <div className="text-center space-y-2">
                    <h3>{result.quizScore.toFixed(1)}%</h3>
                    <Progress value={result.quizScore} className="w-full h-4" />
                </div>
                
                {result.improvementTip && (
                    <div className="bg-muted p-4 rounded-lg ">
                        <p className="font-medium">ImprovementTip:</p>
                        <p className="text-muted-foreground">{result.improvementTip}</p>
                    </div>
                )}
                
                <div className="space-y-4">
                    <h3 className="font-medium">Question Review</h3>
                    {result.questions.map((q,index) => (
                        <div className="border rounded-lg p-4 space-y-2" key={index}>
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-medium">{q.question}</p>
                                {q.isCorrect ? (
                                    <CheckCircle className="text-green-500 h-5 w-5 flex-shrink-0" />
                                ):(
                                    <XCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
                                )}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                <p >Your answer: {q.userAnswer}</p>
                                {!q.isCorrect && <p>Correct answer: {q.correctAnswer}</p>}
                            </div>
                            
                            <div className="text-sm bg-muted p-2 rounded">
                                <p className="font-medium"> Explanation:</p>
                                <p>{q.explanation}</p>
                            </div>

                        </div>
                    ))

                    }
                </div>

            </CardContent>

            {!hideStartNew && (
                <CardFooter>
                    <Button onClick={onStartNew} className="w-full">Start New Quiz</Button>
                </CardFooter>
            )}
        </div>

    );
}

export default QuizResult;
