// This is the main organization page where the projects of the organization are displayed. The organization is fetched by the orgId from the params. The organization is fetched by the getOrganization function from the action folder. The organization name is displayed and the projects of the organization are displayed. The user assigned and reported issues are also displayed. The organization switcher is also displayed


import { getOrganization } from '@/action/organization';
import OrgSwitcher from '@/components/org-switcher';
import React from 'react'
import ProjectList from './_components/project-list';

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
    <div className='container mx-auto md:max-w-7xl px-4 py-10'>
      <div className='mb-4 flex flex-col sm:flex-row justify-between items-start'>
        <h1 className='text-5xl font-bold gradient-title pb-2'>{organization.name}&rsquo;s Projects</h1>

        {/* organization switcher */}
        <OrgSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:slug"
          afterSelectOrganizationUrl="/organization/:slug"
        />
      </div>

      {/* Displaying the list of projects in the organization as per org id */}
      <div className="mb-4 ">
        <ProjectList orgId={organization.id} />
      </div>

      <div className="mt-8">Show user assigned and reported issues here</div>
    </div>
  )

}

export default Organization