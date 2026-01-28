function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-5xl font-extrabold text-white mb-4 shadow-lg p-4 rounded">
        Hello Tailwind CSS!
      </h1>
      <p className="text-lg text-white mb-6">
        Si tu vois ça, Tailwind fonctionne correctement ✅
      </p>
      <button className="bg-white text-pink-500 font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-pink-500 hover:text-white transition duration-300">
        Clique-moi
      </button>
    </div>
  );
}

export default App;
