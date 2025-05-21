import SidePanel from "./SidePanel"

export default function DefaultLayout({children}) {
    return (
        <div className="flex flex-col w-full h-[100vh] bg-[#ecf2f3] ">
            <header className="h-[10vh] bg-white w-full px-4 flex items-center">
            <h1 className='text-2xl text-black font-bold'>Group 3</h1>
            <h1 className='text-2xl text-black font-bold text-center ml-64'>HOTEL MANAGEMENT SYSTEM</h1>
            </header>
            <main className="flex flex-row w-full h-full">
                <aside className="w-[15%] h-full bg-[#ecf2f3]">
                    <SidePanel />
                </aside>
                <section className="w-[85%] h-full">
                    {children}
                </section>
            </main>
        </div>
    )
}
