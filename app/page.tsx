import { redirect } from 'next/navigation'
import { tokenService } from '@/lib/utils/token'

export default function HomePage() {
  // Check if user is already authenticated
  const token = tokenService.getToken()
  
  if (token) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}