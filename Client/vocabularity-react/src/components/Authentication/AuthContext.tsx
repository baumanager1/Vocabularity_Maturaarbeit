import {createContext, useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    username : string;
    email : string;
    subject : string;
    picture : string;
}

interface AuthContextType {
    user : User | null;
    login : (jwt : string) => void;
    logout : () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children} : {children : React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const fakeUser= {
            username: "TestUser",
           email: "test@example.com",
           subject: "123",
            picture: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
       }
        //setUser(fakeUser);
        if(!token) {
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
            username : payload.username,
            email : payload.email,
            subject : payload.subject,
            picture : payload.picture
        });
    }, []);

    function login(jwt:string) {
        localStorage.setItem('jwt', jwt);

        const payload = JSON.parse(atob(jwt.split('.')[1]));
        setUser({
            username : payload.username,
            email : payload.email,
            subject : payload.subject,
            picture : payload.picture
        });
    }

    function logout() {
        try {
            localStorage.removeItem('jwt');
            setUser(null);
            navigate("/signedout");
        }
        catch (error) {
            console.error("Error during logout:", error);
            navigate("/error500 ", {state: {message: (error as Error).message}});
        }

    }

    return (
        <AuthContext.Provider value={{user,login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)!;
}