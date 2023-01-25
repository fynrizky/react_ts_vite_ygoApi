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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

 

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading && (
        <div style={{position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff"}}>
         <img src="https://thumbs.gfycat.com/PerfectDeadlyLadybug-max-1mb.gif" alt="ygogif" />
          <h5>Loading...</h5>
        </div>)}
      {!loading && !error && cards.length > 0 && (
        
        <div>
          <AnimatePresence>
          {cards.map(card => (
            <motion.div 
              key={card.id}
              initial={{opacity:0, y: 50}}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.7 }}>

              <h1>{card.name}</h1>
              <h3>Type: {card.type}</h3>
              {card.card_images.length > 0 && (
                <img src={card.card_images[0].image_url} alt="" />
                )}
              <p>Description: {card.desc}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default App;