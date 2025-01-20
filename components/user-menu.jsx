"use client";

import { UserButton } from '@clerk/nextjs'
import { ChartAreaIcon, ChartBarStacked } from 'lucide-react';
import React from 'react'

const UserMenu = () => {
  return (
    // Appearance for the user button 
    <UserButton appearance={{
      element: {
        avatarBox: 'w-10 h-10',
      },
    }}>

      {/* Appearance for the user button menu, you can add or delete menu links  */}
      <UserButton.MenuItems>
        <UserButton.Link
          href='/onboarding'
          label='My Organizations'
          labelIcon={<ChartBarStacked size={15} />}
        />

        {/* bringing the manage account menu link below the organization link */}
        <UserButton.Action label='manageAccount' />
      </UserButton.MenuItems>


    </UserButton>
  );
};

export default UserMenu