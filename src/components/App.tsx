import { Parent } from "./Parent";

const App = () => {
  return (
    <div className="h-100dvh bg-orange-100">
      <div className="p-3 mr-2 md:p-10 md:mr-0 h-full">
        <Parent />
      </div>
    </div>
  );
};

export default App;
