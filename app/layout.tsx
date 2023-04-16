import NavBar from "./components/NavBar";
import "./globals.css";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>OpenTable | Clone</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta
          name="OpenTable Clone"
          content="A OpenTable clone by Rafael Vendramini"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main className="bg-gray-100 min-h-screen w-screen">
          <main className="max-w-screen-2xl m-auto bg-white">
            <NavBar />
            {children}
          </main>
        </main>
      </body>
    </html>
  );
}

export default RootLayout;
