import { getUserData, getUsers, User, UserData, updateUser, getUserPoolData } from "./utils";
import { useSession } from "../../../auth/useSession";
import { useState, useEffect } from "react";

const PAGE_SIZE = 8;
const Users = () => {
    // Auth
    const { getSession } = useSession();
    // Flow
    const [numberOfUsers, setNumberOfUsers] = useState<number | undefined>(undefined);
    const [users, setUsers] = useState<User[]>([]);
    const [paginationToken, setPaginationToken] = useState('');
    const [previousTokens, setPreviousTokens] = useState<string[]>(['']);
    const [selected, setSelected] = useState<UserData | undefined>(undefined);
    const [searchEmail, setSearchEmail] = useState('');
    useEffect(() => {
        fetchData('');
        setSelected(undefined);
    }, [searchEmail]);
    const fetchData = (paginationToken: string) => {
        getSession()
        .then(tokens => {
            // get user pool data
            getUserPoolData(tokens.id_token)
            .then(res => setNumberOfUsers(res?.number_of_users))
            .catch(err => console.log(err));
            // get user list
            getUsers({limit: PAGE_SIZE, email_filter: searchEmail, subscribed_only: false, pagination_token: paginationToken}, tokens.id_token)
            .then(res => {
                const users = res?.users;
                const pagination_token = res?.pagination_token;
                if (users) setUsers(users);
                if (pagination_token){
                    setPreviousTokens(prev => [...prev, pagination_token]);
                    setPaginationToken(pagination_token);
                }
                else {
                    setPaginationToken('');
                }
            })
            .catch(err => {
                console.error(err);
            })
        });
    }
    const handleNextPage = () => {
        fetchData(paginationToken);
    };
    const handlePreviousPage = () => {
        const previousTokensCopy = previousTokens.slice(0, previousTokens.length - 2);
        const previousToken = previousTokensCopy[previousTokensCopy.length - 1];
        setPreviousTokens(previousTokensCopy);
        try{
            fetchData(previousToken);
        }
        catch(err){
            console.error(err);
            setPreviousTokens(prev => [...prev, previousToken]);
        }
    };
    return (
        <>
        <section className='designer-window hstack flex-grow-1' style={{overflow: "auto"}}>
            <section className="vstack gap-2 p-3 px-4">
                <section className="vstack gap-2">
                    <header>
                        {/* <h1 className="fs-3">Manage Users</h1> */}
                        <span className="">User Count: <b>{numberOfUsers}</b></span>
                    </header>
                    <section>
                        {/* <label className="form-label">Search by email</label> */}
                        <input value={searchEmail} 
                            onChange={e => setSearchEmail(e.target.value)}
                            type="text" className="form-control" placeholder="email@example.com"
                        />
                        <span className="form-text">Search by email and click to edit.</span>
                    </section>
                    <section className="py-0">
                            {
                                selected && (
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th scope="col">Email</th>
                                            <th scope="col">Subscribed</th>
                                            <th scope="col">Admin</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{selected.UserAttributes.find(attr => attr.Name === 'email')?.Value}
                                                </td>
                                                <td>
                                                    <input type={'checkbox'}
                                                    className="form-check-input"
                                                    checked={selected.is_subscribed}
                                                    onChange={async () => {
                                                        const tokens = await getSession();
                                                        const email = selected.UserAttributes.find(attr => attr.Name === 'email')?.Value;
                                                        if (email){
                                                            const is_subscribed = !selected.is_subscribed;
                                                            const status = await updateUser(email, {is_subscribed}, tokens.id_token);
                                                            if (status !== 204){
                                                                console.log("Failed to update user");
                                                            }
                                                            setSelected(await getUserData(email, tokens.id_token));
                                                        }
                                                    }}
                                                    />
                                                </td>
                                                <td>{selected.is_admin ? 'Yes' : 'No'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )
                            }
                    </section>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                {/* <th scope="col">ID</th> */}
                                <th scope="col">Email</th>
                                <th scope="col">Date Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 && users.map(user => {
                                const id = user.Attributes.find(attr => attr.Name === 'sub');
                                const email = user.Attributes.find(attr => attr.Name === 'email');
                                return (
                                    <tr key={id?.Value}>
                                        <td
                                        style={{cursor: "pointer"}}
                                        onClick={async () => {
                                            const tokens = await getSession();
                                            const userData = await getUserData(email?.Value || '', tokens.id_token);
                                            console.log(userData);
                                            setSelected(userData);
                                        }}
                                        >{email?.Value}</td>
                                        <td>{new Date(user.UserCreateDate).toDateString()}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                    <ul className="pagination hstack gap-2">
                        <li className="page-item">
                            <button className="btn btn-secondary" 
                            onClick={handlePreviousPage}
                            type="button"
                            disabled={!paginationToken}
                            >Previous</button>
                        </li>
                        <li className="page-item">
                            <button className="btn btn-secondary"
                            onClick={handleNextPage}
                            type="button"
                            disabled={!paginationToken}
                            >Next</button>
                        </li>
                    </ul>
                </section>
            </section>
        </section>
        </>
    )
}

export default Users;