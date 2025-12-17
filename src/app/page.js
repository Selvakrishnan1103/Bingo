
import BingoGame from './components/CompVsHuman';
import CustomBingoGame from './components/CustomBingoGame';


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-4xl font-bold mb-8">Bingo Game</h1>
      <BingoGame />
    </div>
  );
}
