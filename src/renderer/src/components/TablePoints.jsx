import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function TablePoints() {
    const [couples, setCouples] = useState([]);
    const [ranking, setRanking] = useState(true);
    const [byOrden, setByOrden] = useState(true);

    useEffect(() => {
        (async () => {
            const loadedCouples = await window.electronAPI.loadCouples();
            setCouples(loadedCouples);
        })();
    }, []);

    const sortByRank = () => {
        const sortedCouples = [...couples].sort((a,b) => 
        ranking ? a.rank - b.rank : b.rank - a.rank
    );

    setCouples(sortedCouples)
    setRanking(!ranking);
    }

    const sortByOrden = () => {
        const sortedCouples = [...couples].sort((a,b) => 
        byOrden ? a.orden - b.orden : b.orden - a.orden
    );
    setCouples(sortedCouples)
    setByOrden(!byOrden)
    };


return (
    <section className="min-w-screen min-h-screen bg-[url('../assets/table.png')] flex flex-col bg-[#290028]">
        <Link to="/" className='text-white border-2 rounded-lg p-2 m-2 w-36 text-center bg-black'>
            Volver atrás
        </Link>
        <div className='text-center'>
            <h1 className='text-white text-7xl font-Bebas'>Puntajes</h1>
        </div>
        <div className="w-full mt-10">
            <table className="w-[90%] m-auto">
                <thead>
                    <tr className="bg-gray-100 font-Montserrat">
                    <th onClick={sortByOrden} className="transition-all hover:cursor-pointer hover:bg-gray-500 px-4 py-2">Orden {byOrden ? '▲' : '▼'}</th>
                    <th className="px-4 py-2">Bailarina</th>
                        <th className="px-4 py-2">Bailarín</th>
                        <th className="px-4 py-2">Ciudad</th>
                        <th className="px-4 py-2">Hoffner</th>
                        <th className="px-4 py-2">Rodriguez</th>
                        <th className="px-4 py-2">Matera</th>
                        <th className="px-4 py-2">Gauna</th>
                        <th className="px-4 py-2">Promedio</th>
                        <th onClick={sortByRank} className="transition-all hover:cursor-pointer hover:bg-gray-500 px-4 py-2">Rank {ranking ? '▲' : '▼'}</th>
                    </tr>
                </thead>
                <tbody>
                    {couples.map((couple, index) => (
                        <tr key={index} className="text-white text-2xl font-Staatliches text-center odd:bg-[#d3d3d32a] even:bg-[#d3d3d300]">
                            <td className=" px-4 py-2">{couple.orden}</td>
                            <td className="px-4 py-2">{couple.femaleDancer}</td>
                            <td className="px-4 py-2">{couple.maleDancer}</td>
                            <td className="px-4 py-2">{couple.country}</td>
                            <td className="px-4 py-2">{couple.points1}</td>
                            <td className="px-4 py-2">{couple.points2}</td>
                            <td className="px-4 py-2">{couple.points3}</td>
                            <td className="px-4 py-2">{couple.points4}</td>
                            <td className="text-green-500 px-4 py-2">{couple.average}</td>
                            <td className="text-yellow-400 px-4 py-2">{couple.rank}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
)
}

export default TablePoints