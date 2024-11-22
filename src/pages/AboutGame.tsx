import { Link } from "react-router-dom";
import { FooterPage } from "../components/Footer";
import { GameInfo } from "../components/GameInfo";

export function AboutGame(){
    return(
        <div className="mt-3 flex flex-col items-center">
            <Link to={`/`} className="flex justify-center items-center cursor-default">
            <div className="flex size-1/3">
                <img src='/src/assets/logo.png' alt="logo image" />
            </div>
            </Link>
            <div className="flex-grow">
                <GameInfo />
            </div>
            <div className="m-28"></div>
            <div className="w-full">
                <FooterPage/>
            </div>
        </div>
    )
}