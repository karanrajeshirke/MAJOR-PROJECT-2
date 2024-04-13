import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
const Layout = (props) => {
  return (
    <>
      <Header />

      <main>
        <div className="container-fluid">{props.children}</div>
      </main>
     

      <Toaster />
    </>
  );
};

export default Layout;
