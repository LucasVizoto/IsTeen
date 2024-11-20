import { FooterPage } from "../components/Footer";
import { GameInfo } from "../components/GameInfo";

export function AboutGame(){
    return(
        <div className="mt-3 flex flex-col items-center">
            <div className="flex size-1/3">
                <img src='/src/assets/logo.png' alt="logo image" />
            </div>
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