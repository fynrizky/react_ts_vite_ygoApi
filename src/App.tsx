import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php', {
            params: { staple: 'yes' }
        });
        // console.log(result.data.data)
        setCards(result.data.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error.";
        setError(message);
      } finally {
          setTimeout(()=>{
            setLoading(false);
          },3000);
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
    const searchTermInput = document.getElementById('searchTerm') as HTMLInputElement;
    const searchTerm = searchTermInput.value;
    setSearchTerm(searchTerm);
  };


  const filteredData = cards.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase());
  })
 

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {/* <input type="text" name="searchTerm" placeholder="Search..." onChange={handleSearch} /> */}
      <form onSubmit={handleSearch} className="flex my-4 w-full">
        <input type="text" className='border border-grey-300 rounded bg-gray-900 text-slate-300 py-2 px-2 mr-2 flex-grow' id="searchTerm" placeholder="Search..." />
        <button type="submit" className='bg-gray-500 hover:bg-gray-600 text-slate-300 font-bold py-2 px-4 rounded'>Search</button>
      </form>
      {!loading && !error && filteredData.length === 0 && (
        <p className='text-slate-300'>Data Tidak Ditemukan</p>
      )}
      {loading && (
        <div style={{position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          color: 'white',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000"}}>
         <img src="https://thumbs.gfycat.com/PerfectDeadlyLadybug-max-1mb.gif" alt="ygogif" />
          <h5>Loading...</h5>
        </div>)}
        <h1 className="text-2xl font-bold my-4 text-slate-300">Yugioh Staple</h1>
        {!loading && !error && filteredData.length > 0 && (
        
        <div className='grid grid-cols-4 max-sm:grid-cols-1 w-full gap-8'>
          <AnimatePresence>
          {filteredData.map(card => (
            <motion.div 
              key={card.id}
              initial={{opacity:0, y: 50}}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.7 }}
              className="bg-gray-600 text-slate-300 p-4 rounded">


              <h1 className='font-bold'>{card.name}</h1>
              <h3>Type: {card.type}</h3>
              {card.card_images.length > 0 && (
                <img src={card.card_images[0].image_url} alt="" />
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