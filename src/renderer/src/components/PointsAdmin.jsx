import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import { calculateRanking } from './utils/Ranking';

function PointsAdmin() {
    const [couplesInputs, setCouplesInputs] = useState([]);

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
                count >= 3 ? (validPoints.reduce((acc, curr) => acc + curr, 0) / count).toFixed(3) : '';
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

    // Función para guardar los cambios en el estado final
    const saveData = async () => {
        const updatedCouples = recalculateRanking(couplesInputs);
        setCouplesInputs(updatedCouples);
        await window.electronAPI.saveCouples(couplesInputs);
    };

    return (
        <section className="min-w-screen min-h-screen flex flex-col bg-[url('../assets/points.png')] bg-[#003030]">
            <Link to="/" className='text-white border-2 rounded-lg p-2 m-2 w-36 text-center bg-black'>Volver atrás</Link>
            <div className='text-center'>
                <h1 className='text-white text-7xl font-Bebas'>Administración</h1>
            </div>
            <div className='items-center justify-center flex m-5'>
                <button onClick={addCouple} className='active:bg-green-500 hover:scale-105 transition-all text-black border-black border-2 font-Montserrat p-2 rounded-xl w-36 text-center bg-white'>
                    Agregar Pareja
                </button>
            </div>
            {couplesInputs.map((couple, index) => (
                <div key={index} className='flex flex-col items-center justify-center mb-4 gap-2 text-2xl text-center'>
                    {index === 0 && (
                        <div className='flex gap-5 p-1 text-lg mr-12 font-Montserrat bg-black'>
                            <label className='w-14 text-white'>Rank</label>
                            <label className='w-14 text-white'>Orden</label>
                            <label className='w-56 text-white'>Bailarina</label>
                            <label className='w-56 text-white'>Bailarín</label>
                            <label className='w-44 text-white'>Ciudad</label>
                            <label className='w-20 text-white'>Hoffner</label>
                            <label className='w-20 text-white'>Rodriguez</label>
                            <label className='w-20 text-white'>Matera</label>
                            <label className='w-20 text-white'>Gauna</label>
                            <label className='w-28 text-white'>Promedio</label>
                        </div>
                    )}
                    <div className='flex gap-5 font-Staatliches text-3xl text-white'>
                        <input type="number" className="w-14 h-10 text-center bg-transparent text-yellow-400" value={couple.rank} readOnly />
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
                </div>
            ))}
            <div className='items-center justify-center flex m-5'>
                <button onClick={saveData} className='active:bg-green-500 hover:scale-105 transition-all text-black border-black border-2 font-Montserrat p-2 rounded-xl w-44 text-center bg-white'>
                    Guardar Cambios
                </button>
            </div>
        </section>
    );
}

export default PointsAdmin;
