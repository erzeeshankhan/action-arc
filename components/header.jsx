import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'

const header = () => {
  return (
    <div>











    
    {/* If the user is signed out - showing signIn button */}
      <SignedOut>
        <SignInButton />
      </SignedOut>
      {/* If the user is signed in - showing the "User" button */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default header