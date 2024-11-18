import { useEffect, useState } from "react"
import { getGames } from "../api/api";
import { Link } from "react-router-dom";

interface Game{
    id: number,
    name: string,
    description: string,
    release_date: string,
    url_game: string,
    developer: string
}

export function GameList(){

    const [games, setGames] = useState<Game[]>([]);
    useEffect(() =>{
        loadGames();
    }, []);

    const loadGames = async() => {
        const response = await getGames();
        setGames(response.data);
    };



    return(
        <div>
            <div>
                <div className="grid grid-cols-4 gap-8 m-16">
                    {games.map((game) =>(
                        <div key={game.id} className="border-4 p-6 rounded-xl flex flex-col">
                            
                            <div className="w-full h-auto rounded-lg mb-4">
                                <h2>{game.name}</h2>
                                <p>{game.description}</p>
                            </div>

                            <button
                            className="bg-blue-800 text-white px-2 py-1 m-2 
                             rounded-lg hover:border-2 hover:border-b-slate-50 
                             hover:scale-110">
                                <Link to={`/view/${game.id}`} className="block text-center">
                                    View
                                </Link>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}