import React from 'react'
type Props = {
    onHandleSearch : (event: React.FormEvent<HTMLFormElement>) => void
    setCurrentPage : React.Dispatch<React.SetStateAction<number>>
}
const SearchingChild: React.FC<Props> = (props : Props) => {
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onHandleSearch(event);
        props.setCurrentPage(1);
    }
  return (
    <>
    <form onSubmit={(event) => handleSearch(event)} className="flex my-4 w-full">
        <input type="text" id="searchTerm" className='border border-grey-300 rounded bg-gray-900 text-slate-300 py-2 px-2 mr-2 flex-grow'  placeholder="Search..." />
        <button type="submit" className='bg-gray-500 hover:bg-gray-600 text-slate-300 font-bold py-2 px-4 rounded'>Search</button>
    </form>
    </>
  )
}

export default SearchingChild