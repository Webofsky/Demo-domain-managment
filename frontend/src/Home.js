import Nav from "./Nav";
import Hosting from "./Hosting";

const Home = () => {
    return(
        <div className="w-auto flex flex-col items-center">
            <Nav/>
            <div className="flex w-full flex-row justify-around">
                <Hosting/>
            </div>
        </div>
    )
}

export default Home;