import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'

function TablePoints() {
    const [couples, setCouples] = useState([]);
    const [category, setCategory] = useState('S');
    const [filteredCouples, setFilteredCouples] = useState([]);
    const [ranking, setRanking] = useState(true);
    const [byOrden, setByOrden] = useState(true);
    const [eliminatedCouples, setEliminatedCouples] = useState(1)

    useEffect(() => {
        (async () => {
            const loadedCouples = await window.electronAPI.loadCouples();
            setCouples(loadedCouples);
        })();
    }, []);

    useEffect(() => {
        setFilteredCouples(couples.filter(couple => couple.category === category));
    }, [category, couples]);

    const sortByRank = () => {
        const sortedCouples = [...filteredCouples].sort((a, b) =>
            ranking ? a.rank - b.rank : b.rank - a.rank
        );
        setFilteredCouples(sortedCouples);
        setRanking(!ranking);
    };

    const sortByOrden = () => {
        const sortedCouples = [...filteredCouples].sort((a, b) =>
            byOrden ? a.orden - b.orden : b.orden - a.orden
        );
        setFilteredCouples(sortedCouples);
        setByOrden(!byOrden);
    };

    const filterByCategory = (selectedCategory) => {
        setCategory(selectedCategory);
    };

    const getOutCouples = (couples) => {
        const sortedByRank = [...couples].sort((a,b) => a.rank - b.rank);
        return sortedByRank.slice(0, -eliminatedCouples);
    }
    const outCouples = getOutCouples(filteredCouples)

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        const categories = ['S', 'A', 'L'];
        categories.forEach((cat) => {
            const data = couples.filter(couple => couple.category === cat);
            const ws = XLSX.utils.json_to_sheet(data);
            const categoryName = cat === 'S' ? 'Senior' : cat === 'A' ? 'Adultos' : 'Libre'
            XLSX.utils.book_append_sheet(wb, ws, categoryName);
        });

        XLSX.writeFile(wb, 'puntajes.xlsx')
    }

    const togglePhase = (event) => {
        const words = ['Clasificatoria', 'Semifinal', 'Final']
    if (!event.target.dataset.index) {
        event.target.dataset.index = 0;
    }

    let index = parseInt(event.target.dataset.index, 10);
    index = (index + 1) % words.length;

    event.target.textContent = words[index];
    event.target.dataset.index = index;
    }


    return (
        <section className="min-w-screen min-h-screen items-center bg-[url('../assets/table.png')] flex flex-col bg-[#290028]">
            <Link to="/" className="text-white absolute top-0 left-0 border-2 rounded-lg p-2 m-2 w-36 text-center bg-black">
                Volver atrás
            </Link>
            <div className= 'min-w-screen min-h-screen'>
            <div className="flex justify-center m-10">
                <button onClick={() => filterByCategory('S')} className="filter-btn">
                    S
                </button>
                <button onClick={() => filterByCategory('A')} className="filter-btn">
                    A
                </button>
                <button onClick={() => filterByCategory('L')} className="filter-btn">
                    L
                </button>
                    <button onClick={exportToExcel} className=" ml-10 bg-green-500 hover:scale-105 transition-all text-white py-2 px-4 rounded">
                        Exportar a Excel
                    </button>
                <div className='ml-10 flex items-center justify-center'>
                    <label className='text-white font-Montserrat mr-2'>Parejas Eliminadas:</label>
                    <input className='w-12 h-10 text-center text-2xl'
                            value={eliminatedCouples}
                            onChange={(e) => setEliminatedCouples(Number(e.target.value))}></input>
                </div>
            </div>
            <div id="table-points" className="flex flex-col min-w-screen justify-center">
            <div className="flex min-w-screen text-white justify-center items-center gap-5 mb-5 mt-5">
                <h1 onClick={togglePhase}
                    className='text-7xl font-Bebas cursor-pointer'> 
                    Clasificatoria
                </h1>
                <h1 className="text-7xl font-Bebas">
                    Categoría: { category === 'S' ? 'Senior':
                                 category === 'A' ? 'Adultos':
                                 'Libre'}
                </h1>
            </div>
                <table className="border-collapse table-fixed bg-[#290028] mb-20">
                    <thead>
                        <tr className="bg-black text-white align-center h-10 font-Montserrat">
                            <th onClick={sortByOrden} className="w-7 transition-all hover:cursor-pointer hover:bg-gray-500">
                                Orden
                            </th>
                            <th className='w-[400px]'>Participantes</th>
                            <th className="w-56">Representan</th>
                            <th className="w-24">Hoeffner</th>
                            <th className="w-24">Rodriguez</th>
                            <th className="w-24">Matera</th>
                            <th className="w-24">Gauna</th>
                            <th className="w-28">Promedio</th>
                            <th onClick={sortByRank} className="w-7 transition-all hover:cursor-pointer hover:bg-gray-500">
                                Rank
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredCouples.map((couple, index) => {
                                const isOut = outCouples.includes(couple);
                                return (
                                    <tr
                                        key={index}
                                        className={`text-center text-white align-center text-2xl font-Staatliches ${
                                            isOut ? 'odd:bg-[#286d25e5] even:bg-[#3c883981]' : 'odd:bg-[#852d2d7e] even:bg-[#a01818]'
                                        }`}
                                    >
                                        <td className="h-12 w-7">{couple.orden}</td>
                                        <td className='w-[400px]'> {couple.femaleDancer} - {couple.maleDancer}</td>
                                        <td className="w-56">{couple.country}</td>
                                        <td className="w-24 text-yellow-200">{couple.points1}</td>
                                        <td className="w-24 text-yellow-200">{couple.points2}</td>
                                        <td className="w-24 text-yellow-200">{couple.points3}</td>
                                        <td className="w-24 text-yellow-200">{couple.points4}</td>
                                        <td className="w-28 text-yellow-400">{couple.average}</td>
                                        <td className="w-7">{couple.rank}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            </div>
        </section>
    );
}

export default TablePoints;
