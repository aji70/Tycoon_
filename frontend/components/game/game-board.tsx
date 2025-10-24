import React from 'react'
import PropertyCard from './cards/property-card';
import SpecialCard from './cards/special-card';
import CornerCard from './cards/corner-card';
import { boardData } from '@/data/board-data';
import { BoardSquare } from '@/types/game';

const GameBoard = () => {

    const getGridPosition = (square: BoardSquare) => {
        return {
            gridRowStart: square.gridPosition.row,
            gridColumnStart: square.gridPosition.col,
        };
    };

    // map the grid position to one of the side strings expected by child components
    const getSideFromGridPosition = (pos: { row: number; col: number }): 'top' | 'bottom' | 'left' | 'right' => {
        // assuming a 11x11 grid where edges are row === 1 (top), row === 11 (bottom), col === 1 (left), col === 11 (right)
        if (pos.row === 1) return 'top';
        if (pos.row === 11) return 'bottom';
        if (pos.col === 1) return 'left';
        if (pos.col === 11) return 'right';
        // default fallback (shouldn't normally happen for board edge squares)
        return 'top';
    };

    return (
        <div className="w-full h-full flex justify-center items-center"
        >
            {/* Aspect ratio container to keep the board square and responsive */}
            <div className="w-full max-w-[670px] bg-[#010F10] aspect-square relative shadow-2xl shadow-cyan-500/10">
                {/* The main board grid */}
                <div className="grid grid-cols-11 grid-rows-11 w-full h-full">

                    {/* Center Area */}
                    <div className="col-start-2 col-span-9 row-start-2 row-span-9 bg-[#010F10] flex flex-col justify-center items-center p-4">
                        <h1 className="text-2xl lg:text-4xl font-bold text-[#F0F7F7] font-orbitron text-center">BLOCKOPOLY</h1>
                        <button className="mt-8 px-10 py-3 bg-[#00FFFF] text-black text-xl lg:text-2xl font-bold rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.8)] transition-shadow hover:shadow-[0_0_25px_rgba(0,255,255,1)]">
                            Play
                        </button>
                    </div>

                    {/* Render all 40 squares from the data file */}
                    {boardData.map((square) => (
                        <div key={square.id} style={getGridPosition(square)}>
                            {square.type === 'property' && <PropertyCard square={{ ...square, grid_row: square.gridPosition.row, grid_col: square.gridPosition.col, position: getSideFromGridPosition(square.gridPosition) }} owner={"bank"} />}
                            {(square.type === 'chance' || square.type === 'luxury_tax' || square.type === 'community_chest' || square.type === 'income_tax') && <SpecialCard square={{ ...square, grid_row: square.gridPosition.row, grid_col: square.gridPosition.col, position: getSideFromGridPosition(square.gridPosition) }}  />}
                            {square.type === 'corner' && <CornerCard square={{ ...square, grid_row: square.gridPosition.row, grid_col: square.gridPosition.col, position: getSideFromGridPosition(square.gridPosition) }} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GameBoard