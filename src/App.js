import React, { useState } from 'react';

function App() {
  const [slowa, setSlowa] = useState([]);
  const [wpis, setWpis] = useState({ slowo: '', definicja: '' });
  const [wybraneSlowo, setWybraneSlowo] = useState(null);
  const [szukaneSlowo, setSzukaneSlowo] = useState('');
  const [blad, setBlad] = useState('');
  const [bladAPI, setBladAPI] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWpis((prevWpis) => ({ ...prevWpis, [name]: value}));
  };

  const handleInputChange2 = (event) => {
    setSzukaneSlowo(event.target.value);
  };

  const dodajWpis = () => {
    if (wpis.slowo.trim() !== '') {
      if (wpis.definicja.trim() === '') {
        setBlad('Podaj definicję do hasła i wtedy zatwierdź!');
      } else {
        setSlowa([...slowa, wpis]);
        setWpis({ slowo: '', definicja: '' });
        setBlad('');
      }
    } else {
      setBlad('Podaj hasło do wprowadzenia i wtedy zatwierdź!');
    }

  };

  const usunWpis = (wpis) => {
    const noweSlowa = slowa.filter((s) => s !== wpis);
    setSlowa(noweSlowa);
  };

  const pokazDefinicje = (wpis) => {
    setWybraneSlowo(wpis);
    setBladAPI('');
    setBlad('');
  };

  const wyszukajSlowo = () => {
    if(szukaneSlowo.length === 0) {      
      setBladAPI('Wprowadź słowo!');
      setWybraneSlowo({ slowo: 'BRAK', definicja: ''});
    } else {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${szukaneSlowo}`)
        .then((response) => response.json())
        .then((data) => {
          if(data.title === "No Definitions Found") {
            setBladAPI('Nie ma takiego hasła w API');
            setWybraneSlowo({ slowo: szukaneSlowo, definicja: ''});
          } else {
            setWybraneSlowo({ slowo: data[0].word, definicja: data[0].meanings[0].definitions[0].definition });
            setBladAPI('');
          }
        })
        .catch((error) => console.log(error));
      }
  };

  return (
    <div className="container">
      <h1><center>Słownik</center></h1>
      <table>
        <tr>
          <td>
      
      <div class="row">
        Dodaj hasło do lokalnego słownika
        <br/>
        <input className="tekst"
          type="text"
          name="slowo"
          value={wpis.slowo}
          onChange={handleInputChange}
          placeholder="Wprowadź nowe słowo"
        /><br/>
        <input
          type="text"
          name="definicja"
          value={wpis.definicja}
          onChange={handleInputChange}
          placeholder="Wprowadź definicję"
        /><br/>
        { blad && <div className="blad">{blad}</div> }
        <button onClick={dodajWpis}>Dodaj słowo</button>
      </div>
      </td>
      <td>
      <div class="row">
      <h2>Znajdź słowo w API</h2>
      <h6>Podawaj słowa w języku angielskim</h6>      
      <input
          type="text"
          name="slowo"
          value={szukaneSlowo}
          onChange={handleInputChange2}
          placeholder="Szukaj słowa"
        />        
        <button onClick={wyszukajSlowo}>Wyszukaj</button>
        
    </div></td>
        </tr>
        <tr>
          <td>
            <table>
        <thead>
          <th colSpan={3}>
          Hasła w lokalnym słowniku
          </th>
        </thead>
        <tbody>
        {slowa.map((wpis, index) => (
          <tr>
            <td key={index}>
            {wpis.slowo}
            </td>
            <td>              
            <button onClick={() => pokazDefinicje(wpis)}>Pokaż definicję</button>
            </td>
            <button onClick={() => usunWpis(wpis)}>Usuń</button>
            </tr>
        ))}
        </tbody>
      </table>    
    </td>
    <td>
      {wybraneSlowo && (
        <div class="row">
          { !bladAPI && <h2>Definicja hasła - <i>{wybraneSlowo.slowo}</i></h2> }
          { bladAPI && <div className="blad"> <h2> {bladAPI} </h2></div> }
          <p>{wybraneSlowo.definicja}</p>
        </div>
      )}
      </td></tr></table>
      <div>
        <h6>Aplikacja korzysta z API: https://api.dictionaryapi.dev/api/v2/entries/en</h6>
      </div>
    </div>
    
  );
}

export default App;