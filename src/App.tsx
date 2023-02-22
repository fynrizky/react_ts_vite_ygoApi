import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import PageChild from './components/PageChild';
import SearchingChild from './components/SearchingChild';

interface Card {
  id: number;
  name: string;
  type: string;
  desc: string;
  card_images: CardImage[];
}
interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
}

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgWait, setImageWait] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php');
        // staple card
        // const result = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', {
        //     params: { staple: 'yes' }
        // });
        // console.log(result.data.data)
        setCards(result.data.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error.";
        setError(message);
      } finally {
          setTimeout(()=>{
            setLoading(false);
          },1000);

      }
      
    };
    fetchData();
  }, []);


  //onchange
  // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearchTerm(event.target.value);
  // }

  //onsubmit
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // input name
    // const form = event.currentTarget as HTMLFormElement;
    // const formData = new FormData(form);
    // setSearchTerm(formData.get('searchTerm') as string);
    
    // input id

    // cara 1
    // const searchTermInput = document.getElementById('searchTerm') as HTMLInputElement;
    // const searchTerm = searchTermInput.value;
    // setSearchTerm(searchTerm);
    
    // cara2
    setSearchTerm(event.currentTarget.searchTerm.value);
    setCurrentPage(1);
  };


  const filteredData = cards.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
           item.type.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
           item.desc.toLowerCase().includes(searchTerm.toLocaleLowerCase()) 
  })


// pagination
const cardsPerPage = 8;
const indexOfLastCard = currentPage * cardsPerPage;
const indexOfFirstCard = indexOfLastCard - cardsPerPage;
// console.log(indexOfFirstCard);
const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);

const totalPages = Math.ceil(filteredData.length / cardsPerPage);

const handleClick = (pageNumber: number) => {
  setCurrentPage(pageNumber);
};

const handlePrevClick = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleNextClick = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};




  return (
    <div>
      {error && <p>Error: {error}</p>}
      {/* <input type="text" name="searchTerm" placeholder="Search..." onChange={handleSearch} /> */}
      <SearchingChild 
        onHandleSearch={(event)=>handleSearch(event)}
        setCurrentPage={setCurrentPage}
      />
      {loading && (
        <div className='fixed top-0 right-0 bottom-0 left-0 text-slate-300 flex items-center justify-center bg-gray-900'>
         <img src="https://thumbs.gfycat.com/PerfectDeadlyLadybug-max-1mb.gif" alt="ygogif" />
          <h5>Loading...</h5>
        </div>)}
        <h1 className="text-2xl font-bold my-4 text-slate-300">All Card Yugioh TCG</h1>
        {!loading && !error && filteredData.length === 0 && (
          <p className='text-slate-300'>Data Tidak Ditemukan</p>
        )}

            {/* Tampilkan pagination */}
            {!loading && !error && filteredData.length > cardsPerPage && (
              <div className="flex justify-center my-4">
                <button
                  className="mx-2 py-2 px-4 rounded bg-gray-500 hover:bg-gray-600 text-slate-300"
                  onClick={handlePrevClick}
                >
                  Prev
                </button>

                <PageChild 
                  cPage={currentPage} 
                  totalPages={totalPages} 
                  onHandleClick={(pageNumber)=>handleClick(pageNumber)} 
                />
                
                <button
                  className="mx-2 py-2 px-4 rounded bg-gray-500 hover:bg-gray-600 text-slate-300"
                  onClick={handleNextClick}
                >
                  Next
                </button>
              </div>
            )}


        {!loading && !error && filteredData.length > 0 && (
        
        <div className='grid grid-cols-4 max-sm:grid-cols-1 w-full gap-8'>
          <AnimatePresence>
          {currentCards.map(card => (
            <motion.div 
              key={card.id}
              initial={{opacity:0, y: 50}}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.7 }}
              className="bg-gray-600 text-slate-300 p-4 rounded">


              <h1 className='font-bold'>{card.name}</h1>
              <h3>Type: {card.type}</h3>
              
              {/* imgwait/spinner */}
               {card.card_images.length > 0 && (
              <div style={{ position: 'relative', minHeight: '200px' }}>
                {imgWait && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                    <p className="text-center">Wait...</p>
                  </div>
                )}
                <img
                  src={card.card_images[0].image_url}
                  alt=""
                  onLoad={() => setImageWait(false)}
                  onError={() => setImageWait(false)}
                  style={{ display: imgWait ? 'none' : 'block' }}
                />
              </div>
            )}
              
                
              <div className='font-bold'>Description:</div> 
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
      )}

      
    </div>
  );
};

export default App;