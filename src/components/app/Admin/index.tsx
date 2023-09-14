import { PAGES } from "./TopBarMenu/constants";
import TopBarMenu from "./TopBarMenu";
import Messages from "./Messages";
import Users from "./Users";
import { useState  } from "react";

const Admin = () => {
    const [currentPage, setCurrentPage] = useState(() => PAGES.Messages);
    const handlePageChange = (page: string) => {
        setCurrentPage(page);
    };
    return (
        <section className='designer d-flex flex-column justify-content-between'>
            <TopBarMenu currentPage={currentPage} handlePageChange={handlePageChange}/>
            {
                currentPage === PAGES.Messages && <Messages/>
            }
            {
                currentPage === PAGES.Users && <Users/>
            }
        </section>
    )
}

export default Admin