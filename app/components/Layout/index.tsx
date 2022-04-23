import Footer from "../Footer";
import Hero from "../Hero";

interface Props {
  children: React.ReactNode;
  hideIllustration?: boolean;
}

export default function Layout({ children, hideIllustration = true }: Props) {
  return (
    <>
      <Hero hideIllustration={hideIllustration} />
      <main className="my-0 mx-auto max-w-screen-lg text-primary">
        {children}
      </main>
      <footer className="my-16 w-full shadow-footer">
        <Footer />
      </footer>
    </>
  );
}
