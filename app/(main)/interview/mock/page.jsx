import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Quiz from '../_components/quiz'

const MockInterviewpage = () => {
  return (
    <div className='container mx-auto space-y-4 py-6'>
      <div>
        <Link href="/interview">
          <Button variant={"link"} className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview
          </Button>
        </Link>
        <div>
          <h2 className='text-6xl font-bold gradient-title'>Mock Interview</h2>
          <p className='text-muted-foreground'>Get ready for your upcoming interview with our mock interview service.</p>
        </div>
      </div>

      <Quiz />
    </div>
  )
}

export default MockInterviewpage