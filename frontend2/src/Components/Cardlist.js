
import React, {useEffect} from "react";
import Card from "./Card.js";
import { useState } from "react";
const Cardlist = ({ Cardlist }) => {

    const [cards, setCards] = useState('');
    console.log(cards)
    useEffect(() => {
        console.log('HomePage component mounted');
        // Your data fetching logic here
      }, []);
     
  return (
    <div className="container  my-4">
      <div className="row ">
        {Cardlist.map((card) => {
          return (
            <div key={card.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <Card title={card.title} data={card.data} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Cardlist;
