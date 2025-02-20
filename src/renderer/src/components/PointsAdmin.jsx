import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import { calculateRanking } from './utils/Ranking';
import * as XLSX from 'xlsx'

function PointsAdmin() {
    const [couplesInputs, setCouplesInputs] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('S')

    useEffect(() => {
        (async () => {
            const loadedCouples = await window.electronAPI.loadCouples();
            setCouplesInputs(loadedCouples);
        })();
    }, []);

    // Recalcular ranking solo cuando las parejas cambian
    const recalculateRanking = (updatedCouples) => {
        return calculateRanking(updatedCouples);
    };

    // Función que se ejecuta al hacer clic en "Agregar Pareja"
    const addCouple = () => {
        const newCouple = {
            category: categoryFilter || "",
            orden: '',
            femaleDancer: '',
            maleDancer: '',
            country: '',
            points1: '',
            points2: '',   
            points3: '',
            points4: '',
            average: '',
            rank: 0
        };

        setCouplesInputs((prevInputs) => {
            const updatedInputs = [...prevInputs, newCouple];
            recalculateRanking(updatedInputs);
            return updatedInputs;
        });
    };

    const handleInputChange = (index, field, value) => {
        const updatedInputs = [...couplesInputs];
        updatedInputs[index][field] = value;

        if (['points1', 'points2', 'points3', 'points4'].includes(field)) {
            const points = [
                parseFloat(updatedInputs[index].points1) || 0,
                parseFloat(updatedInputs[index].points2) || 0,
                parseFloat(updatedInputs[index].points3) || 0,
                parseFloat(updatedInputs[index].points4) || 0
            ];

            // Calcula el promedio si al menos 3 jueces han ingresado puntuaciones
            const validPoints = points.filter(val => val !== 0);
            const count = validPoints.length;

            updatedInputs[index].average = 
            count > 0 ? (validPoints.reduce((acc, curr) => acc + curr, 0) / count).toFixed(2) : 0;
        }
        setCouplesInputs(updatedInputs);
    };

    const deleteCouple = (index) => {
        setCouplesInputs((prevInputs) => {
            const updatedInputs = prevInputs.filter((_, i) => i !== index);
            recalculateRanking(updatedInputs);
            return updatedInputs;
        });
    };

    const filteredCategory = categoryFilter
        ? couplesInputs.filter(couple => couple.category === categoryFilter)
        : couplesInputs;
        
    const clearPoints = () => {
        const clearedInputs = couplesInputs.map(couple => ({
            ...couple,
            points1: '',
            points2: '',
            points3: '',
            points4: '',
            average: '',
            rank: ''
        }));
        setCouplesInputs(clearedInputs)
    }

    const excelForJudges = () => {
        const wb = XLSX.utils.book_new();
        const judges = ['Hoffner', 'Matera', 'Gauna', 'Rodriguez'];
            judges.forEach((judge, index) => {
                const data = couplesInputs.map(couple => ({
                    Orden: couple.orden,
                    Bailarin: couple.femaleDancer,
                    Bailarín: couple.maleDancer,
                    Localidad: couple.country,
                    Observaciones: '',
                    Puntaje: '',
                    Firma: ''
                }))
                 const ws = XLSX.utils.json_to_sheet(data);
                 const judgeName = judges[index + 1]
                XLSX.utils.book_append_sheet(wb, ws, judgeName);
            })
            XLSX.writeFile(wb, 'jueces.xlsx')
    };

    // Función para guardar los cambios en el estado final
    const saveData = async () => {
        const updatedCouples = recalculateRanking(couplesInputs);
        setCouplesInputs(updatedCouples);
        await window.electronAPI.saveCouples(couplesInputs);
    };

    return (
        <section className="min-w-screen min-h-screen flex flex-col items-center bg-[url('../assets/points.png')] bg-[#003030]">
        <Link to="/" className=' text-white absolute top-0 left-0 border-2 rounded-lg p-2 m-2 w-36 text-center bg-black'>
        Volver atrás
            </Link>
            <div className='text-center'>
                <h1 className='text-white text-7xl font-Bebas mt-10 '>Administración</h1>
            </div>
            <div className='items-center justify-center flex m-5 gap-10'>
                <button onClick={addCouple} className=' active:bg-green-500 hover:scale-105 transition-all text-black border-black border-2 font-Montserrat p-2 rounded-xl w-36 text-center bg-white'>
                    Agregar Pareja
                </button>
                <div className="flex gap-4">
                    <button onClick={() => setCategoryFilter('S')} className="filter-btn hover:bg-red-700 focus:bg-red-700">S</button>
                    <button onClick={() => setCategoryFilter('A')} className="filter-btn hover:bg-orange-700 focus:bg-orange-700">A</button>
                    <button onClick={() => setCategoryFilter('L')} className="filter-btn hover:bg-blue-700 focus:bg-blue-700">L</button>
                </div>
                <button onClick={clearPoints} className='active:bg-green-500 hover:scale-105 transition-all text-black border-black border-2 font-Montserrat p-2 rounded-xl w-44 text-center bg-white'>
                    Borrar Puntajes
                </button>
                <button onClick={excelForJudges} className='active:bg-blue-500 hover:scale-105 transition-all text-black border-black border-2 font-Montserrat p-2 rounded-xl w-44 text-center bg-white'>
                    Exportar a Excel
                </button>
            </div>
                <div className='flex w-[90%] mb-2 mr-12 p-1 text-center items-center justify-center gap-5 text-lg font-Montserrat bg-black'>
                            <label className='w-14 text-white'>Ctgia</label>
                            <label className='w-14 text-white'>Orden</label>
                            <label className='w-56 text-white'>Bailarina</label>
                            <label className='w-56 text-white'>Bailarín</label>
                            <label className='w-44 text-white'>Ciudad</label>
                            <label className='w-20 text-white'>Hoeffner</label>
                            <label className='w-20 text-white'>Rodriguez</label>
                            <label className='w-20 text-white'>Matera</label>
                            <label className='w-20 text-white'>Gauna</label>
                            <label className='w-28 text-white'>Promedio</label>
                            </div>
            {filteredCategory.map((couple) => {
                const index = couplesInputs.indexOf(couple);
                return (
                    <div className='w-[90%] mb-2 flex flex-wrap gap-5 text-center items-center justify-center font-Staatliches text-3xl text-white'>
                        
                        <input type="text" className={`bg-[#01010152] w-14 h-10 text-center ${
                            couple.category === 'S' ? 'text-red-600' :
                            couple.category === 'A' ? 'text-orange-600' :
                            couple.category === 'L' ? 'text-blue-600' : 'text-black'
                            }`} value={couple.category} onChange={(e) => handleInputChange(index, 'category', e.target.value.toUpperCase())}
                            maxLength={1} />
                        <input type="number" className="bg-[#01010152] w-14 h-10 text-center" value={couple.orden} onChange={(e) => handleInputChange(index, 'orden', e.target.value)} />
                        <input type="text" className="bg-[#01010152] w-56 h-10 text-center" value={couple.femaleDancer} onChange={(e) => handleInputChange(index, 'femaleDancer', e.target.value)} />
                        <input type="text" className="bg-[#01010152] w-56 h-10 text-center" value={couple.maleDancer} onChange={(e) => handleInputChange(index, 'maleDancer', e.target.value)} />
                        <input type="text" className="bg-[#01010152] w-44 h-10 text-center" value={couple.country} onChange={(e) => handleInputChange(index, 'country', e.target.value)} />
                        <input type="number" className="bg-[#01010152] w-20 h-10 text-center" value={couple.points1} onChange={(e) => handleInputChange(index, 'points1', e.target.value)} />
                        <input type="number" className="bg-[#01010152] w-20 h-10 text-center" value={couple.points2} onChange={(e) => handleInputChange(index, 'points2', e.target.value)} />
                        <input type="number" className="bg-[#01010152] w-20 h-10 text-center" value={couple.points3} onChange={(e) => handleInputChange(index, 'points3', e.target.value)} />
                        <input type="number" className="bg-[#01010152] w-20 h-10 text-center" value={couple.points4} onChange={(e) => handleInputChange(index, 'points4', e.target.value)} />
                        <input type="number" className="bg-[#01010152] w-28 h-10 text-center text-yellow-400" value={couple.average} readOnly />
                        <button onClick={() => deleteCouple(index)} className="active:scale-150 transition-all hover:scale-125 hover:bg-red-600 w-8 text-center rounded-lg h-10 text-white"><MdDeleteForever/></button>
                    </div>
                );
                })}
            <div className='items-center justify-center flex m-5'>
                <button onClick={saveData} className='active:bg-green-500 hover:scale-105 transition-all text-black border-black border-2 font-Montserrat p-2 rounded-xl w-44 text-center bg-white'>
                    Guardar Cambios
                </button>
            </div>
        </section>
    );
}

export default PointsAdmin;
