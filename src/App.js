import './App.css';
import CountryComponents from './sections/CountryComponents';
import Header from './sections/Header';
import HeroSection from './sections/HeroSection';
import useLocalStorage from 'use-local-storage';


function App() {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches
  const [isLight, setIsLight] = useLocalStorage('isLight', preference)

  return (
    <div className="App" data-theme={isLight ? 'light' : 'dark'}>
      <Header
        isChecked={isLight}
        handleChange={() => setIsLight(!isLight)} />
      <HeroSection />
      <CountryComponents />
    </div>
  );
}

export default App;
