import { getResume } from '@/actions/resume'
import ResumeBuilder from './_component/Resume-builder'


const ResumePage = () => {
 const resume = getResume()
    return (
      <div className='container mx-auto py-6'><ResumeBuilder initialContent={resume?.content} /></div>
  )
}

export default ResumePage