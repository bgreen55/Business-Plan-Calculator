const { useState } = React;

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">✅ React + Babel Works!</h1>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Count is {count}
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
