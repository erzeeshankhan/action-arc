import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { PenBox } from 'lucide-react';
import UserMenu from "./user-menu";
import { checkUser } from '@/lib/checkUser';
import UserLoading from './user-loading';

const header = async() => {

  await checkUser();
  return (
    <div>
      <header className="container mx-auto">
        <nav className="py-6 px-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl flex gap-1 font-bold">
              <Image
                src={"/action1.png"}
                alt="Zscrum Logo"
                width={200}
                height={56}
                className="h-10 w-auto object-contain"
              />
              <span>Action Arc</span>
            </h1>
          </Link>


          {/* Right side of the navbar */}
          <div className="flex items-center gap-4">
            <Link href={"/projects/create"} >
              {/* varients are pre built styles for shadcn ui components */}
              <Button variant='destructive' className="flex items-center gap-2">
                <PenBox width={17} />
                <span>Create Project</span>
              </Button>
            </Link>


            {/* If the user is signed out - showing signIn button */}
            <SignedOut>
              <SignInButton forceRedirectUrl='/onboarding'>
                <Button variant="outline">
                  <span>Sign In</span>
                </Button>
              </SignInButton>
            </SignedOut>


            {/* If the user is signed in - showing the "User" button */}
            <SignedIn>
              <UserMenu />
            </SignedIn>
          </div>
        </nav>

        <UserLoading />
      </header>
    </div>
  )
}

export default header