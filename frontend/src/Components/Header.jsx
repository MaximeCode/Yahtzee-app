import {Link} from "react-router-dom";

export function Header() {
    return (
        <div className="pt-4 pb-5 d-flex justify-content-between align-items-center">
            {/*Arrow to go back home*/}
            <Link to="/">
                <div className="btnBackHome">
                    <i className="fa-solid fa-home fa-xl"></i>
                </div>
            </Link>
            <h1 className="display-4">
                Yahtzee !
                <i className="ms-2 fa-solid fa-dice"></i>
            </h1>
            <div></div>
        </div>
    );
}