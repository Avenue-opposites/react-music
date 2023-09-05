interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {

  return (
    <main className="w-full h-screen overflow-hidden">
      {children}
    </main>
  )
}
 
export default Layout