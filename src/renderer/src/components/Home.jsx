import { Link } from "react-router-dom";

function Home() {
    console.log("El componente Home carga"); // Verifica si el componente se carga
    return (
        <section className="w-screen h-screen bg-slate-300 bg-[url('../assets/tango.jpg')] flex flex-col justify-center items-center">
            <h1 className="text-white text-9xl p-10 font-Bebas">Academia</h1>
                <div className="text-center flex justify-center items-center">
                    <ul className="flex flex-col gap-10 text-white font-Raleway">
                            <Link to="/Points" className="transition-all hover:text-black hover:bg-white hover:scale-105 hover:rounded-lg justify-center items-center flex w-72 h-16 text-center text-2xl">
                                Tabla de Puntuación
                            </Link>
                            <Link to="/Admin" className="transition-all hover:text-black hover:bg-white hover:scale-105 hover:rounded-lg justify-center items-center flex w-72 h-16 text-center text-2xl">
                                Asignar Puntajes
                            </Link>
                    </ul>
                </div>
        </section>
    );
}

export default Home;