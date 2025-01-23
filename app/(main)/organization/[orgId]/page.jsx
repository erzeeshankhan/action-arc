import { getOrganization } from '@/action/organization';
import OrgSwitcher from '@/components/org-switcher';
import React from 'react'

const Organization = async ({ params }) => {
  const { orgId } = params;

  // Making the api call to the getOrganization() func in the action folder to fetch the data by that function
  const organization = await getOrganization(orgId);

  // if the organization not found 
  if (!organization) {
    return <div>Organization not found</div>;
  }

  // if the organization found return its name 
  return (
    <div className='container mx-auto'>
      <div className='mb-4 flex flex-col sm:flex-row justify-between items-start'>
        <h1 className='text-5xl font-bold gradient-title pb-2'>{organization.name}&rsquo;s Projects</h1>

        {/* organization switcher */}
        <OrgSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:slug"
          afterSelectOrganizationUrl="/organization/:slug"
        />
      </div>
      <div className="mb-4">Show org projects</div>
      <div className="mt-8">Show user assigned and reported issues here</div>
    </div>
  )

}

export default Organization