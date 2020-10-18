import React, { FunctionComponent } from 'react';
import { useQuery,useMutation } from '../../lib/api'
import { Listing, ListingsData, DeleteListingData, DeleteListingVariable } from './types'

const LISTINGS = `
query Listings{
  listings{
    id
    title
    image
    address
    price
    numOfGuests
    numOfBeds
    numOfBaths
    rating
  }
}
`

const DELETE_LISTING = `
mutation DeleteListing($id: ID!){
deleteListing(id:$id){
  id
}
}
`

interface Props {
  title: string
}

export const Listings: FunctionComponent<Props> = ({ title }) => {
  const { data,loading,error,refetch } = useQuery<ListingsData>(LISTINGS)

  const [deleteListing,{loading:deleteListingLoading,error:deleteLoadingError}]=useMutation<DeleteListingData,DeleteListingVariable>(DELETE_LISTING)

  const handleDeleteListing = async (id: string) => {
   await deleteListing({id})
    refetch()
  }

  const listings = data ? data.listings : null

  const listingsList = listings ? (
    <ul>
      {
        listings?.map((listing: Listing) =>
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => handleDeleteListing(listing.id)}>Delete Listing!</button>
          </li>)
      }
    </ul>) : null

  if(loading){
    return <h2>Loading...</h2>
  }

  if(error){
    return(
      <h2>Uh oh! Something went Wrong - please try  again later :(</h2>
    )
  }

  const deleteListingLoadingMessage=deleteListingLoading?(
  <h4>Deletion in progress...</h4>
  ):null

  const deleteLoadingErrorMessage=deleteLoadingError?(
    <h2>Uh oh! Something went Wrong with deleting- please try  again later :(</h2>
  ):null

  return (
  <div>
    <h2>{title}</h2>
    {listingsList}
    {deleteListingLoadingMessage}
    {deleteLoadingErrorMessage}
  </div>
  )
};
