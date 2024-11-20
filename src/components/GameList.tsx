import { useEffect, useState } from "react"
import { getGames } from "../api/api";
import { Link } from "react-router-dom";

interface Game{
    id: number,
    name: string,
    description: string,
    release_date: string,
    url_game: string,
    url_image_game: string,
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
                <div className="grid grid-cols-2 gap-44 m-8 max-w-4xl mx-auto pt-0">
                    {games.map((game) =>(
                        <div key={game.id} className="border-4 border-slate-900 p-3 rounded-xl flex flex-col  bg-slate-900 text-slate-50">
                            
                            <div className="w-full rounded-lg mb-4 grid grid-cols-2 items-center">
                                <div className="flex size-44 items-center">
                                    <img src={game.url_image_game} alt="image_game" className="rounded-lg"/>
                                </div>
                                <div className="flex justify-center">
                                <Link to={`/view/${game.id}`} className="block text-center">
                                    <h2 className="font-bold text-3xl hover:text-slate-300">{game.name.toUpperCase()}</h2>
                                </Link>

                                </div>
                            </div>
                            <button
                            className="bg-blue-800 text-white px-2 py-1 m-2 
                             rounded-lg border-2 border-slate-900 
                             hover:bg-blue-600">

                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}