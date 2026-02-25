
import { Box } from "lucide-react";
import { Link, useOutletContext } from "react-router";
import Button from "./ui/Button";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>()

    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Puter sign out failed: ${e}`);
            }

            return;
        }

        try {
            await signIn();
        } catch (e) {
            console.error(`Puter sign in failed: ${e}`);
        }
    };


    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <Link to="/" className="brand">
                        <Box className="logo" />

                        <span className="name">
                            Roomify
                        </span>
                    </Link>

                    <ul className="links">
                        <Link to="/product">Product</Link>
                        <Link to="/pricing">Pricing</Link>
                        <Link to="/community">Community</Link>
                        <Link to="/enterprise">Enterprise</Link>
                    </ul>
                </div>

                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                                {userName ? `Hi, ${userName}` : 'Signed in'}
                            </span>

                            <Button size="sm" onClick={handleAuthClick} className="btn">
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleAuthClick} size="sm" variant="ghost">
                                Log In
                            </Button>

                            <a href="#upload" className="cta">Get Started</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar