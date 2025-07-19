import './App.css'
import Header from './components/Header.jsx'
import Admin from './pages/Admin.jsx'
import { useEffect } from 'react';
import useCompanyStore from './stores/companyStore.js';

function App() {

	//Load companies when the app starts
	const { fetchCompanies } = useCompanyStore();
	useEffect(() => {
		fetchCompanies();
	}, []);

  return (
    <div className="app">
	<Header />
	<Admin />
	</div>
  )
}

export default App
