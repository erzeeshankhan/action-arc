"use client"

import { OrganizationSwitcher, SignedIn, useOrganization, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation';
import React from 'react'

const OrgSwitcher = () => {

    // checking if these components are loaded or not 
    const { isLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const pathname = usePathname();

    if (!isLoaded && !isUserLoaded) {
        return null;
    }
    return (
        <div>
            <SignedIn>
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl="/organization/:slug"
                    afterSelectOrganizationUrl="/organization/:slug"
                    // if the user is not the admin of the organizatoin he wont be allowed to create a project and if he tries we will redirect him to the onboarding page to tell him create his own org  
                    createOrganizationMode={
                        pathname === "/onboarding" ? "navigation" : "modal"
                    }
                    CreateOrganizationUrl="/onboarding"
                    appearance={{
                        elements: {
                            organizationSwitcherTrigger:
                                "border border-gray-300 rounded-md px-5 py-2",
                            organizationSwitcherTriggerIcon:
                                "text-white",
                        }
                    }}
                />
            </SignedIn>
        </div>
    )
}

export default OrgSwitcher