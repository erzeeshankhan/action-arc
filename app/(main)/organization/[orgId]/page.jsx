import React from 'react'

const Organization = ({params}) => {
    const { orgId } = params;
  return (
    <div>{orgId}</div>
  )
}

export default Organization