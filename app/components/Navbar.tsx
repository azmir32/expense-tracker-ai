import { checkUser } from "../lib/checkUser";


export default function Navbar() {
    const user = checkUser();
    console.log(user);
    return (
        <div>
            <h1>Navbar</h1>
        </div>
    )
}