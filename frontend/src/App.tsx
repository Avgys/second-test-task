import './App.css';
import UsersList from './Components/UserList';
import LoremIpsum from 'react-lorem-ipsum';

function App() {
  return (
    <div className="App">
      <LoremIpsum p={2} />
      <UsersList height='400px' />
      <LoremIpsum p={2} />
    </div>
  );
}

export default App;
