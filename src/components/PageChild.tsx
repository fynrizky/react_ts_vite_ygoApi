import React, { useState } from 'react'

type Props = {
    cPage : number;
    onHandleClick : (pageNumber: number) => void;
    totalPages: number;
}

const PageChild: React.FC<Props> = (props : Props) => {

    const handleCLick = (pageNumber: number) =>{
        props.onHandleClick(pageNumber)
    }

    const getPageNumbers = () => {
        const maxPageNumbers = 3;
        const pageNumbers: number[] = [];
        let startPage = 1;
        let endPage = props.totalPages;
      
        if (props.totalPages > maxPageNumbers) {
          const middlePage = Math.ceil(maxPageNumbers / 2);
          if (props.cPage > middlePage) {
            startPage = props.cPage - (middlePage - 1);
            endPage = props.cPage + (maxPageNumbers - middlePage);
            if (endPage > props.totalPages) {
              endPage = props.totalPages;
              startPage = props.totalPages - maxPageNumbers + 1;
            }
          } else {
            endPage = maxPageNumbers;
          }
        }
      
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
      
        return pageNumbers;
      };
  return (
    <>
    {getPageNumbers().map(pageNumber => (
        <button
          key={pageNumber}
          className={`mx-2 py-2 px-4 rounded ${
            props.cPage === pageNumber
              ? "bg-gray-700 text-slate-300"
              : "bg-gray-500 hover:bg-gray-600 text-slate-300"
          }`}
          onClick={() => handleCLick(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
    </>
  )
}

export default PageChild