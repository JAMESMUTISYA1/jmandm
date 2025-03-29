import Footer from "@/components/Footer";
import Header from "@/components/Header";
import './globals.css'
import TopBar from "@/components/Topbar";
import  { Roboto } from "next/font/google"
const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});
const Layout = ({ children }) => {



  return (
    <>
    <html lang="en" className={roboto.className}  >
      <body>
        <TopBar/>
      <Header/>
      <main>

        {children}
       <Footer/>
        </main>
 
    </body></html></>
  );
};

export default Layout;