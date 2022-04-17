import './App.css';
import ChartComponent from './components/Chart';
import Metrics from './components/Metrics';

function App() {
  return (
    <div className="App " style={{ height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <Metrics />
    </div>
  );
}

export default App;
